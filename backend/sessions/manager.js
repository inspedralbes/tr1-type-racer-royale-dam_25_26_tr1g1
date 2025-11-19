import sequelize from "../database/sequelize.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SESSION_DURATIONS, GAME_SETTINGS } from "../constants.js";
import { updateUserLevel, findUserById } from "../users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const exercicisPath = path.resolve(process.cwd(), "exercicis.json");
const exercicisData = JSON.parse(fs.readFileSync(exercicisPath, "utf-8"));

let sessions = []; // Array per emmagatzemar les sessions actives.
let timers = {}; // Objecte per gestionar els temporitzadors de les sessions.
let emptySessionTimers = {}; // Objecte per gestionar temporitzadors de sessions buides.

export const getSessions = () => sessions; // Retorna totes les sessions actives.
export const getTimers = () => timers; // Retorna els temporitzadors de les sessions.
export const getEmptySessionTimers = () => emptySessionTimers; // Retorna els temporitzadors de sessions buides.

// Obté una sessió per la seva ID.
export const getSessionById = (id) => {
  return sessions.find((session) => session.id === id);
};

// Obté totes les sessions.
export const getAllSessions = () => {
  return sessions;
};

// Crea una nova sessió de joc.
export const createSession = async (sessionData, creatorId) => {
  const { name, type, duration, password, maxUsers } = sessionData;
  const creator = await findUserById(creatorId);
  if (!creator) {
    throw new Error("CREATOR_NOT_FOUND");
  }

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
    users: [
      {
        userId: creator.id,
        username: creator.username,
        puntos: 0,
        ready: false,
      },
    ],
    latestReaction: null,
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

// Actualitza una sessió existent.
export const updateSession = async (id, updateData) => {
  const index = sessions.findIndex((session) => session.id === id);
  if (index > -1) {
    sessions[index] = { ...sessions[index], ...updateData };
    return sessions[index];
  }
  return null;
};

// Elimina una sessió i el seu temporitzador associat.
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

// Guarda una sessió finalitzada a la base de dades.
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
              user.userId,
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
