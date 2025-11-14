import { getSessionById, getTimers, saveFinishedSession, deleteSession } from "./sessionManager.js";
import { broadcastSessionUpdate } from "./websocket.js";
import { GAME_SETTINGS } from "./constants.js";

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

    broadcastSessionUpdate(session); // Broadcast final state with level progression

    deleteSession(sessionId);
  }

  return session;
};

export const updateRepetitions = (sessionId, userId) => {
  const session = getSessionById(sessionId);
  if (!session || session.state.isResting) {
    return null;
  }

  const userInSession = session.users.find((user) => user.id === userId);
  if (!userInSession) {
    return null;
  }

  userInSession.puntos += GAME_SETTINGS.POINTS_PER_REP; // Add points for each rep
  session.state.repetitions++;

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
        // Rest is over, check for next series or exercise
        if (session.state.currentSeries >= currentExercise.series) {
          nextExercise(sessionId);
        } else {
          // Start next series
          session.state.currentSeries++;
          session.state.timer = currentExercise.duration;
          session.state.isResting = false;
        }
      }
    }
    broadcastSessionUpdate(session);
  }, 1000);
};