import { v4 as uuidv4 } from "uuid";

let sessions = [
  {
    id: "session_001",
    users: [],
    type: "Full Body",
    time: 30,
    isPublic: true,
    maxUsers: 8,
    state: {
      status: "IN_PROGRESS",
      startTime: "2025-10-30T18:00:00Z",
      currentExerciseIndex: 1,
      progress: 0.5,
    },
  },
];

let wssInstance = null;

export const setWssInstance = (wss) => {
  wssInstance = wss;
};

const broadcastSessionsUpdate = () => {
  if (wssInstance) {
    wssInstance.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        try {
          client.send(
            JSON.stringify({ type: "SESSIONS_UPDATE", payload: sessions })
          );
        } catch (error) {
          console.error("Error sending WebSocket message to client:", error);
        }
      }
    });
  }
};

export const getAllSessions = () => {
  return sessions;
};

export const createSession = async (sessionData) => {
  const newSession = {
    id: uuidv4(),
    ...sessionData,
    users: [],
    state: {
      status: "WAITING",
      startTime: null,
      currentExerciseIndex: 0,
      progress: 0,
    },
  };
  sessions.push(newSession);
  broadcastSessionsUpdate();
  return newSession;
};

export const getSessionById = (id) => {
  return sessions.find((session) => session.id === id);
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
  if (session) {
    if (!session.users.includes(userId)) {
      session.users.push(userId);
      broadcastSessionsUpdate();
      return session;
    }
    return session;
  }
  return null;
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
