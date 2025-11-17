import {
  getSessionById,
  deleteSession,
  getEmptySessionTimers,
} from "./manager.js";
import { findUserById } from "../users.js";
import { broadcastSessionsUpdate } from "../websocket.js";
import { GAME_SETTINGS } from "../constants.js";

export const joinSession = async (sessionId, userId, password) => {
  const session = getSessionById(sessionId);
  if (!session) throw new Error("SESSION_NOT_FOUND");

  if (session.password && session.password !== password) {
    throw new Error("La contrasenya es incorrecta.");
  }

  const joiningUser = await findUserById(userId);
  if (!joiningUser) {
    throw new Error("Joining user not found");
  }

  if (session.users.some((user) => user.userId === userId)) return session;
  if (session.users.length >= session.maxUsers) throw new Error("Session full");

  const emptySessionTimers = getEmptySessionTimers();
  if (emptySessionTimers[sessionId]) {
    clearTimeout(emptySessionTimers[sessionId]);
    delete emptySessionTimers[sessionId];
    console.log(`Canceled deletion timer for session ${sessionId}.`);
  }

  session.users.push({
    userId: joiningUser.id,
    username: joiningUser.username,
    puntos: 0,
    ready: false,
  });

  console.log(`User ${userId} joined session ${sessionId}.`);
  return session;
};

export const leaveSession = async (sessionId, userId) => {
  const session = getSessionById(sessionId);
  if (!session) return null;

  const initialUserCount = session.users.length;
  session.users = session.users.filter((user) => user.userId !== userId);

  if (session.users.length < initialUserCount) {
    if (session.users.length === 0) {
      console.log(`Session ${sessionId} is empty. Starting deletion timer...`);
      const emptySessionTimers = getEmptySessionTimers();
      emptySessionTimers[sessionId] = setTimeout(() => {
        deleteSession(sessionId);
        broadcastSessionsUpdate(); // This is a special case, a session is deleted, so we need to notify everyone.
        console.log(`Session ${sessionId} deleted after being empty.`);
        delete emptySessionTimers[sessionId];
      }, 60000); // 1 minute
      return null; // Session is now empty, will be deleted
    } else {
      console.log(`User ${userId} left session ${sessionId}.`);
      return session; // Return updated session
    }
  }
  return session; // User not found, return original session
};

export const updateUserScore = (sessionId, userId, score) => {
  const session = getSessionById(sessionId);
  if (!session) {
    return null;
  }

  const userInSession = session.users.find((user) => user.userId === userId);
  if (!userInSession) {
    return null;
  }

  userInSession.puntos += score;
  return session;
};

export const setReady = (sessionId, userId) => {
  const session = getSessionById(sessionId);
  if (!session) {
    return { session: null, allReady: false };
  }

  const userInSession = session.users.find((user) => user.userId === userId);
  if (userInSession) {
    userInSession.ready = true;
  }

  const allReady = session.users.every((user) => user.ready);
  return { session, allReady };
};
