import { getSessionById, deleteSession } from "./sessionManager.js";
import { findUserById } from "./users.js";
import { broadcastSessionUpdate } from "./websocket.js";
import { GAME_SETTINGS } from "./constants.js";

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

  if (session.users.some((user) => user.id === userId)) return session;
  if (session.users.length >= session.maxUsers) throw new Error("Session full");

  session.users.push({
    id: joiningUser.id,
    username: joiningUser.username,
    puntos: 0,
    foto_perfil: joiningUser.foto_perfil,
    ready: false,
  });

  console.log(
    `User ${userId} joined session ${sessionId}. Broadcasting sessions update.`
  );
  broadcastSessionUpdate(session);
  return session;
};

export const leaveSession = async (sessionId, userId) => {
  const session = getSessionById(sessionId);
  if (!session) return null;

  const initialUserCount = session.users.length;
  session.users = session.users.filter((user) => user.id !== userId);

  if (session.users.length < initialUserCount) {
    if (session.users.length === 0) {
      deleteSession(sessionId);
      return null; // Session deleted
    } else {
      console.log(
        `User ${userId} left session ${sessionId}. Broadcasting sessions update.`
      );
      broadcastSessionUpdate(session);
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

  const userInSession = session.users.find((user) => user.id === userId);
  if (!userInSession) {
    return null;
  }

  userInSession.puntos += score;
  broadcastSessionUpdate(session);
  return session;
};

export const setReady = (sessionId, userId) => {
  const session = getSessionById(sessionId);
  if (!session) {
    return { session: null, allReady: false };
  }

  const userInSession = session.users.find((user) => user.id === userId);
  if (userInSession) {
    userInSession.ready = true;
  }

  broadcastSessionUpdate(session);

  const allReady = session.users.every((user) => user.ready);
  return { session, allReady };
};