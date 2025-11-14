import sequelize from "./database/sequelize.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SESSION_DURATIONS, GAME_SETTINGS } from "./constants.js";
import { updateUserLevel } from "./users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const exercicisPath = path.join(__dirname, "exercicis.json");
const exercicisData = JSON.parse(fs.readFileSync(exercicisPath, "utf-8"));

let sessions = [];
let timers = {};

export const getSessions = () => sessions;
export const getTimers = () => timers;

export const getSessionById = (id) => {
  return sessions.find((session) => session.id === id);
};

export const getAllSessions = () => {
  return sessions;
};

export const createSession = async (sessionData) => {
  const { name, type, duration, password, maxUsers } = sessionData;
  const allExercises = exercicisData.routine[type];

  const series = SESSION_DURATIONS[duration.toUpperCase()] || 2;

  const exercisesWithDetails = allExercises.map((exercise) => ({
    ...exercise,
    series,
    duration: GAME_SETTINGS.EXERCISE_DURATION_SECONDS,
  }));

  const newSession = {
    id: uuidv4(),
    name: name || `Sessió sense nom`,
    type,
    duration,
    password,
    maxUsers,
    exercicis: exercisesWithDetails,
    users: [],
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
  return newSession;
};

export const updateSession = async (id, updateData) => {
  const index = sessions.findIndex((session) => session.id === id);
  if (index > -1) {
    sessions[index] = { ...sessions[index], ...updateData };
    return sessions[index];
  }
  return null;
};

export const deleteSession = async (id) => {
  const initialLength = sessions.length;
  sessions = sessions.filter((session) => session.id !== id);
  if (sessions.length < initialLength) {
    if (timers[id]) {
      clearInterval(timers[id]);
      delete timers[id];
    }
    return true;
  }
  return false;
};

export const saveFinishedSession = async (session) => {
  try {
    await sequelize.transaction(async (t) => {
      await sequelize.query(
        "INSERT INTO Sessions (id, nombre, fecha, tipo_ejercicio, duracion, password, max_usuarios, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        {
          replacements: [
            session.id,
            session.name,
            new Date(session.state.startTime),
            session.type,
            session.duration,
            session.password,
            session.maxUsers,
            new Date(),
            new Date(),
          ],
          transaction: t,
        }
      );

      for (const user of session.users) {
        const participaId = uuidv4();
        await sequelize.query(
          "INSERT INTO Participas (id, sessionId, userId, puntuacion, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
          {
            replacements: [
              participaId,
              session.id,
              user.id,
              user.puntos,
              new Date(),
              new Date(),
            ],
            transaction: t,
          }
        );
        await updateUserLevel(user, t);
      }
    });
  } catch (error) {
    console.error("Error saving finished session:", error);
  }
};