import { v4 as uuidv4 } from "uuid";
import { broadcastSessionsUpdate } from "./websocket.js";

let sessions = [];

export const getSessionById = (id) => {
  return sessions.find((session) => session.id === id);
};

export const getAllSessions = () => {
  return sessions;
};

export const createSession = async (sessionData, creatorId) => {
  const newSession = {
    id: uuidv4(),
    ...sessionData,
    users: [creatorId],
    state: {
      status: "WAITING",
      startTime: Date.now(),
      currentExerciseIndex: 0,
      progress: 0,
    },
  };
  sessions.push(newSession);
  broadcastSessionsUpdate();
  return newSession;
};

export const updateSession = async (id, updateData) => {
  const index = sessions.findIndex((session) => session.id === id);
  if (index > -1) {
    sessions[index] = { ...sessions[index], ...updateData };
    broadcastSessionsUpdate();
    return sessions[index];
  }
  return null;
};

export const joinSession = async (sessionId, userId) => {
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) return null;

  if (session.users.includes(userId)) return session;
  if (session.users.length >= session.maxUsers) throw new Error("Session full");
  if (session.state.status !== "WAITING")
    throw new Error("Session already started");

  session.users.push(userId);
  broadcastSessionsUpdate();
  return session;
};

export const deleteSession = async (id) => {
  const initialLength = sessions.length;
  sessions = sessions.filter((session) => session.id !== id);
  if (sessions.length < initialLength) {
    broadcastSessionsUpdate();
    return true;
  }
  return false;
};

export const leaveSession = async (sessionId, userId) => {
  const session = getSessionById(sessionId);
  if (!session) return;

  const userIndex = session.users.indexOf(userId);
  if (userIndex > -1) {
    session.users.splice(userIndex, 1);
    if (session.users.length === 0) {
      deleteSession(sessionId);
    } else {
      broadcastSessionsUpdate();
    }
  }
};
