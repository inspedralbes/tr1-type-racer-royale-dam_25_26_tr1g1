import { v4 as uuidv4 } from "uuid";
import { broadcastSessionsUpdate } from "./websocket.js";
import { findUserById } from "./users.js";
import fs from "fs";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const exercicisPath = path.join(__dirname, "exercicis.json");
const exercicisData = JSON.parse(fs.readFileSync(exercicisPath, "utf-8"));

let sessions = [];

export const getSessionById = (id) => {
  return sessions.find((session) => session.id === id);
};

export const getAllSessions = () => {
  return sessions;
};

export const createSession = async (sessionData, creatorId) => {
  const creator = findUserById(creatorId);
  if (!creator) {
    throw new Error("Creator user not found");
  }

  const { type, duration, password, maxUsers } = sessionData;
  const allExercises = exercicisData.routine[type];

  let series = 2;
  if (duration === "Intermitja") {
    series = 3;
  } else if (duration === "Extensa") {
    series = 4;
  }

  const exercisesWithSeries = allExercises.map(exercise => ({
    ...exercise,
    series,
  }));

  const newSession = {
    id: uuidv4(),
    type,
    duration,
    password,
    maxUsers,
    exercicis: exercisesWithSeries,
    users: [
      {
        id: creator.id,
        username: creator.username,
        puntos: 0,
        foto_perfil: creator.foto_perfil,
      },
    ],
    state: {
      status: "WAITING",
      startTime: Date.now(),
      currentExercise: 0,
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

export const joinSession = async (sessionId, userId, password) => {
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) return null;

  if (session.password && session.password !== password) {
    throw new Error("Incorrect password");
  }

  const joiningUser = findUserById(userId);
  if (!joiningUser) {
    throw new Error("Joining user not found");
  }

  if (session.users.some((user) => user.id === userId)) return session;
  if (session.users.length >= session.maxUsers) throw new Error("Session full");
  if (session.state.status !== "WAITING")
    throw new Error("Session already started");

  session.users.push({
    id: joiningUser.id,
    username: joiningUser.username,
    puntos: 0,
    foto_perfil: joiningUser.foto_perfil,
  });
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
  if (!session) return null;

  const initialUserCount = session.users.length;
  session.users = session.users.filter((user) => user.id !== userId);

  if (session.users.length < initialUserCount) {
    if (session.users.length === 0) {
      deleteSession(sessionId);
      return null; // Session deleted
    } else {
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

  return session;
};

export const nextExercise = (sessionId) => {
  const session = getSessionById(sessionId);
  if (!session) {
    return null;
  }

  session.state.currentExercise++;
  broadcastSessionsUpdate(session);
  return session;
};
