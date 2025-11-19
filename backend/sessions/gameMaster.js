import {
  getSessionById,
  getTimers,
  saveFinishedSession,
  deleteSession,
} from "./manager.js";
import {
  broadcastSessionUpdate,
  broadcastGameEvent,
  broadcastSessionsUpdate,
} from "../websocket.js";
import { createSystemPost } from "../posts.js";
import { GAME_SETTINGS } from "../constants.js";

// Gestiona el pas al següent exercici o la finalització de la sessió.
export const nextExercise = async (sessionId) => {
  const session = getSessionById(sessionId);
  if (!session) {
    return null;
  }

  if (session.state.currentExercise < session.exercicis.length - 1) {
    session.state.currentExercise++;
    session.state.currentSeries = 1;
    session.state.repetitions = 0;
    session.state.isResting = true; // Descans abans del següent exercici
    session.state.timer = GAME_SETTINGS.REST_TIME_SECONDS;
    broadcastSessionUpdate(session);
  } else {
    // Últim exercici finalitzat, acaba la sessió
    session.state.status = "FINISHED";
    await saveFinishedSession(session);

    const sortedUsers = [...session.users].sort((a, b) => b.puntos - a.puntos);
    const top3 = sortedUsers.slice(0, 3);

    let postContent = `La sessió '${session.name}' ha finalitzat!`;
    if (top3.length > 0) {
      postContent += `\n\n🏆 Podium 🏆`;
      top3.forEach((user, index) => {
        postContent += `\n${index + 1}. ${user.username} - ${
          user.puntos
        } punts`;
      });
    }

    await createSystemPost(postContent);

    broadcastSessionUpdate(session);

    deleteSession(sessionId);
    broadcastSessionsUpdate(); // Notifica a tots els clients que s'ha eliminat una sessió
  }

  return session;
};

// Actualitza les repeticions i la puntuació d'un usuari durant la sessió.
export const updateRepetitions = (sessionId, userId) => {
  const session = getSessionById(sessionId);
  if (
    !session ||
    session.state.isResting ||
    session.state.status !== "IN_PROGRESS"
  ) {
    return null;
  }

  const userInSession = session.users.find((user) => user.userId === userId);
  if (!userInSession) {
    return null;
  }

  const oldLeaderboard = [...session.users].sort((a, b) => b.puntos - a.puntos);
  const oldRank = oldLeaderboard.findIndex((u) => u.userId === userId);

  let number_random = Math.floor(Math.random() * 10) - 4;
  userInSession.puntos += GAME_SETTINGS.POINTS_PER_REP + number_random;
  session.state.repetitions++;

  const newLeaderboard = [...session.users].sort((a, b) => b.puntos - a.puntos);
  const newRank = newLeaderboard.findIndex((u) => u.userId === userId);

  if (newRank === 0 && oldRank !== 0) {
    broadcastGameEvent(session, {
      text: `¡${userInSession.username} se ha puesto en cabeza!`,
      gif: "/emojis_gif/1f451.gif",
    });
  } else if (oldRank - newRank >= 2) {
    broadcastGameEvent(session, {
      text: `¡${userInSession.username} está remontando!`,
      gif: "/emojis_gif/1f525.gif",
    });
  }

  broadcastSessionUpdate(session);
  return session;
};

// Inicia el temporitzador i la lògica de progressió de la sessió.
export const startSession = (sessionId) => {
  const session = getSessionById(sessionId);
  if (!session) {
    return;
  }
  const timers = getTimers();

  if (timers[sessionId]) {
    clearInterval(timers[sessionId]);
  }

  session.state.status = "IN_PROGRESS";
  session.state.timer = GAME_SETTINGS.REST_TIME_SECONDS; // Comença amb un descans
  session.state.isResting = true;

  broadcastSessionUpdate(session);
  broadcastSessionsUpdate();

  timers[sessionId] = setInterval(() => {
    if (session.state.status !== "IN_PROGRESS") {
      clearInterval(timers[sessionId]);
      delete timers[sessionId];
      return;
    }

    const currentExercise = session.exercicis[session.state.currentExercise];

    if (session.state.timer > 0) {
      session.state.timer--;
    } else {
      if (session.state.isResting) {
        // Descans finalitzat, comença l'exercici
        session.state.isResting = false;
        session.state.timer = currentExercise.duration;
      } else {
        // Exercici finalitzat
        if (session.state.currentSeries >= currentExercise.series) {
          // Última sèrie
          nextExercise(sessionId);
        } else {
          // Més sèries per aquest exercici, comença un descans
          session.state.currentSeries++;
          session.state.isResting = true;
          session.state.timer = GAME_SETTINGS.REST_TIME_SECONDS;
        }
      }
    }
    broadcastSessionUpdate(session);
  }, 1000);
};
