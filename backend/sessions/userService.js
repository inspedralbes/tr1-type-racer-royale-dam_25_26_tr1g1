import {
  getSessionById,
  deleteSession,
  getEmptySessionTimers,
} from "./manager.js";
import { findUserById } from "../users.js";
import {
  broadcastSessionsUpdate,
  broadcastGameEvent,
  broadcastSessionUpdate,
} from "../websocket.js";
import { GAME_SETTINGS } from "../constants.js";

// Permet a un usuari unir-se a una sessió.
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

  return session;
};

// Permet a un usuari sortir d'una sessió.
export const leaveSession = async (sessionId, userId) => {
  const session = getSessionById(sessionId);
  if (!session) return null;

  const userIndex = session.users.findIndex((user) => user.userId === userId);
  if (userIndex === -1) {
    return session; // L'usuari no és a la sessió, no fa res.
  }

  const userLeaving = session.users[userIndex];

  if (session.state.status === "IN_PROGRESS") {
    broadcastGameEvent(session, {
      text: `${userLeaving.username} ha salido de la partida.`,
      gif: "/emojis_gif/1f44b.gif",
    });
  }

  // Ara, elimina l'usuari
  session.users.splice(userIndex, 1);

  // Gestiona la lògica de sessió buida
  if (session.users.length === 0) {
    console.log(`Session ${sessionId} is empty. Starting deletion timer...`);
    const emptySessionTimers = getEmptySessionTimers();
    emptySessionTimers[sessionId] = setTimeout(() => {
      deleteSession(sessionId);
      broadcastSessionsUpdate();
      console.log(`Session ${sessionId} deleted after being empty.`);
      delete emptySessionTimers[sessionId];
    }, 60000); // 1 minute
    return null; // La sessió ara està buida, s'eliminarà
  }

  console.log(`User ${userId} left session ${sessionId}.`);
  return session; // Retorna la sessió actualitzada
};

// Actualitza la puntuació d'un usuari en una sessió.
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

// Estableix l'estat de "llest" per a un usuari en una sessió.
export const setReady = (sessionId, userId) => {
  const session = getSessionById(sessionId);
  if (!session) {
    return { session: null, allReady: false };
  }

  const userInSession = session.users.find((user) => user.userId === userId);
  if (userInSession) {
    userInSession.ready = true;
    broadcastSessionUpdate(session); // Notifica a tots els clients el canvi
  }

  const allReady = session.users.every((user) => user.ready);
  return { session, allReady };
};
