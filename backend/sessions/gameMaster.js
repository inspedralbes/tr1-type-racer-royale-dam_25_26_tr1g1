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

export const nextExercise = async (sessionId) => {
  const session = getSessionById(sessionId);
  if (!session) {
    return null;
  }

  if (session.state.currentExercise < session.exercicis.length - 1) {
    session.state.currentExercise++;
    session.state.currentSeries = 1;
    session.state.repetitions = 0;
    session.state.isResting = false; // Reset resting state
    const newExercise = session.exercicis[session.state.currentExercise];
    session.state.timer = newExercise.duration; // Set timer for new exercise
    broadcastSessionUpdate(session);
  } else {
    // Last exercise finished, end session
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
    broadcastSessionsUpdate(); // Notify all clients that a session was removed
  }

  return session;
};

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

  userInSession.puntos += GAME_SETTINGS.POINTS_PER_REP;
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
  const firstExercise = session.exercicis[session.state.currentExercise];
  session.state.timer = firstExercise.duration;
  session.state.isResting = false;

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
      if (!session.state.isResting) {
        // Transition to rest
        session.state.isResting = true;
        session.state.timer = GAME_SETTINGS.REST_TIME_SECONDS;
      } else {
        if (session.state.currentSeries >= currentExercise.series) {
          nextExercise(sessionId);
        } else {
          session.state.currentSeries++;
          session.state.timer = currentExercise.duration;
          session.state.isResting = false;
        }
      }
    }
    broadcastSessionUpdate(session);
  }, 1000);
};
