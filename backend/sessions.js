import fs from "fs";
const fsp = fs.promises;
const SESSIONS_FILE = "./dades/sessions.json";

let sessions = [];
let wss;

export const init = (websocketServer) => {
  wss = websocketServer;
};

const broadcastSessionsUpdate = () => {
  if (!wss) return;
  const message = JSON.stringify({
    type: "SESSIONS_UPDATE",
    payload: sessions,
  });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      try {
        client.send(message);
      } catch (err) {
        console.error("Error sending message to client:", err);
      }
    }
  });
};

export const loadSessions = async () => {
  try {
    const data = await fsp.readFile(SESSIONS_FILE, "utf8");
    sessions = JSON.parse(data);
    console.log("Sessions carregades correctament.");
    console.log(sessions);
  } catch (error) {
    if (error.code === "ENOENT") {
      await saveSessions();
      console.log(
        "No s'ha trobat el fitxer de sessions, se n'ha creat un de nou."
      );
    } else {
      console.error("Error al carregar les sessions:", error);
    }
  }
};

export const saveSessions = async () => {
  console.log("saveSessions: Saving sessions...");
  try {
    await fsp.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
    console.log("saveSessions: Sessions saved successfully");
    broadcastSessionsUpdate();
  } catch (error) {
    console.error("Error al guardar les sessions:", error);
  }
};

export const getSessions = () => sessions;

export const getSessionById = (id) => sessions.find((s) => s.id === id);

export const createSession = async (options) => {
  console.log("createSession: Received options", options);
  const { type, time, isPublic, maxUsers, hostId } = options;
  const newSession = {
    id: `s${Date.now()}`,
    type: type || "Full Body",
    time: time || 30,
    isPublic: isPublic !== undefined ? isPublic : true,
    maxUsers: maxUsers || 8,
    hostId: hostId,
    users: [hostId], // El creador s'uneix automàticament
    state: {
      status: "waiting",
      startTime: null,
      currentExerciseIndex: 0,
      progress: 0,
    },
  };
  console.log("createSession: New session created", newSession);
  sessions.push(newSession);
  await saveSessions();
  return newSession;
};

export const addUserToSession = async (id, userId) => {
  const session = getSessionById(id);
  if (!session) return { error: "Sessió no trobada" };
  if (session.users.length >= session.maxUsers) {
    return { error: "La sessió està plena" };
  }
  if (session.users.includes(userId)) {
    return { error: "L'usuari ja està a la sessió" };
  }
  session.users.push(userId);
  await saveSessions();
  return { message: "Usuari afegit correctament", session };
};

export const removeUserFromSession = async (userId) => {
  const sessionIndex = sessions.findIndex((s) => s.users.includes(userId));
  if (sessionIndex === -1) {
    return { error: "L'usuari no està a cap sessió" };
  }

  const session = sessions[sessionIndex];
  const userIndex = session.users.indexOf(userId);
  session.users.splice(userIndex, 1);

  // Si el usuari era el host o la sessió queda buida, s'elimina la sessió
  if (session.hostId === userId || session.users.length === 0) {
    sessions.splice(sessionIndex, 1);
    await saveSessions();
    return { message: "Sessió eliminada correctament" };
  } else {
    await saveSessions();
    return { message: "Usuari eliminat correctament", session };
  }
};
