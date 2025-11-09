import { v4 as uuidv4 } from "uuid";
import { broadcastSessionsUpdate, broadcastSessionUpdate } from "./websocket.js";
import { findUserById } from "./users.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const exercicisPath = path.join(__dirname, "exercicis.json");
const exercicisData = JSON.parse(fs.readFileSync(exercicisPath, "utf-8"));

let sessions = [];
let timers = {};

export const getSessionById = (id) => {
  return sessions.find((session) => session.id === id);
};

export const getAllSessions = () => {
  return sessions;
};

export const createSession = async (sessionData, creatorId) => {
  const creator = await findUserById(creatorId);
  if (!creator) {
    throw new Error("Creator user not found");
  }

  const { name, type, duration, password, maxUsers } = sessionData;
  const allExercises = exercicisData.routine[type];

  let series = 2;
  if (duration === "Intermitja") {
    series = 3;
  } else if (duration === "Extensa") {
    series = 4;
  }

  const exercisesWithSeries = allExercises.map((exercise) => ({
    ...exercise,
    series,
  }));

  const newSession = {
    id: uuidv4(),
    name: name || `Sessió de ${creator.username}`,
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
        ready: false,
      },
    ],
    state: {
      status: "WAITING",
      startTime: Date.now(),
      currentExercise: 0,
      repetitions: 0,
      currentSeries: 1,
      timer: 0,
      isResting: false,
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

  console.log(`User ${userId} joined session ${sessionId}. Broadcasting sessions update.`);
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
  if (!session) return null;

  const initialUserCount = session.users.length;
  session.users = session.users.filter((user) => user.id !== userId);

  if (session.users.length < initialUserCount) {
    if (session.users.length === 0) {
      deleteSession(sessionId);
      return null; // Session deleted
    } else {
      console.log(`User ${userId} left session ${sessionId}. Broadcasting sessions update.`);
      broadcastSessionsUpdate();
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

  if (session.state.currentExercise < session.exercicis.length - 1) {
    session.state.currentExercise++;
    session.state.currentSeries = 1;
    session.state.repetitions = 0;
    broadcastSessionUpdate(session);
  } else {
    // Last exercise finished, end session
    session.state.status = "FINISHED";
    broadcastSessionUpdate(session);
  }

  return session;
};

export const updateRepetitions = (sessionId, userId) => {
  const session = getSessionById(sessionId);
  if (!session) {
    return null;
  }

  const userInSession = session.users.find((user) => user.id === userId);
  if (!userInSession) {
    return null;
  }

  session.state.repetitions++;

  const currentExercise = session.exercicis[session.state.currentExercise];
  if (session.state.repetitions >= currentExercise.reps) {
    if (session.state.currentSeries >= currentExercise.series) {
      nextExercise(sessionId);
    } else {
      session.state.currentSeries++;
      session.state.repetitions = 0;
    }
  }

  broadcastSessionUpdate(session);
  return session;
};

export const setReady = (sessionId, userId) => {
  const session = getSessionById(sessionId);
  if (!session) {
    return;
  }

  const userInSession = session.users.find((user) => user.id === userId);
  if (userInSession) {
    userInSession.ready = true;
  }

  const allReady = session.users.every((user) => user.ready);
  if (allReady) {
    startSession(sessionId);
  }

  broadcastSessionUpdate(session);
};

export const startSession = (sessionId) => {
  const session = getSessionById(sessionId);
  if (!session) {
    return;
  }

  if (timers[sessionId]) {
    clearInterval(timers[sessionId]);
  }

  session.state.status = "IN_PROGRESS";
  const currentExercise = session.exercicis[session.state.currentExercise];
  session.state.timer = currentExercise.duration;
  session.state.isResting = false;

  timers[sessionId] = setInterval(() => {
    if (session.state.timer > 0) {
      session.state.timer--;
    } else {
      if (!session.state.isResting) {
        session.state.isResting = true;
        session.state.timer = 15; // 15 seconds rest
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
  broadcastSessionsUpdate(); // Broadcast to update the session list status
};
