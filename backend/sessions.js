import fs from "fs";
const fsp = fs.promises;
const SESSIONS_FILE = "./dades/sessions.json";

let sessions = [];

export const loadSessions = async () => {
  try {
    const data = await fsp.readFile(SESSIONS_FILE, "utf8");
    sessions = JSON.parse(data);
    console.log("Sessions carregades correctament.");
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
  try {
    await fsp.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
  } catch (error) {
    console.error("Error al guardar les sessions:", error);
  }
};

export const getSessions = () => sessions;

export const getSessionById = (id) => sessions.find((s) => s.id === id);

export const addUserToSession = async (id, username) => {
  const session = getSessionById(id);
  if (!session) return { error: "Sessió no trobada" };
  if (session.users.includes(username)) {
    return { error: "L'usuari ja està a la sessió" };
  }
  session.users.push(username);
  await saveSessions();
  return { message: "Usuari afegit correctament", session };
};
