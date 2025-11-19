import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import db from "./models/index.js"; // Importa la configuració de la base de dades.

// Configuració de rutes de fitxers.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega les variables d'entorn segons l'entorn (producció/desenvolupament).
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Importa mòduls de gestió de WebSockets, usuaris, sessions i publicacions.
import { setupWebsocketHandlers, setWssInstance } from "./websocket.js";
import { findUserById, registerUser, loginUser, updateUser } from "./users.js";
import {
  getAllSessions,
  createSession,
  getSessionById,
  updateSession,
  deleteSession,
} from "./sessions/manager.js";
import { joinSession, leaveSession, setReady } from "./sessions/userService.js";
import { startSession } from "./sessions/gameMaster.js";
import {
  getAllPosts,
  createPost,
  addComment,
  deletePost,
  updatePost,
  deleteComment,
} from "./posts.js";

const PORT = process.env.PORT; // Port del servidor.

const app = express(); // Inicialitza l'aplicació Express.
app.use(cors()); // Habilita CORS.
app.use(express.json()); // Habilita el parsing de JSON al cos de les peticions.
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serveix fitxers estàtics des de la carpeta 'uploads'.

const server = http.createServer(app); // Crea un servidor HTTP.
const wss = new WebSocketServer({ noServer: true }); // Crea un servidor WebSocket.

// Gestiona les peticions d'actualització (upgrade) per a connexions WebSocket.
server.on("upgrade", (request, socket, head) => {
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);

  if (pathname === "/ws") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

// Configura els gestors d'esdeveniments per a noves connexions WebSocket.
wss.on("connection", (ws) => {
  setupWebsocketHandlers(ws, wss);
});

setWssInstance(wss); // Estableix la instància de WebSocket Server.

// Ruta de prova per verificar el funcionament del servidor.
app.get("/api/", (req, res) => {
  res.send("Servidor HTTP i WebSocket funcionant!");
});

// Ruta per obtenir un usuari per ID.
app.get("/api/users/:id", async (req, res) => {
  const user = await findUserById(req.params.id);

  if (!user) return res.status(404).json({ message: "Usuari no trobat" });

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    date_created: user.date_created || null,
    pesoActual: user.pesoActual || null,
    altura: user.altura || null,
    biografia: user.biografia || null,
    foto_perfil: user.foto_perfil || null,
    nivel: user.nivel || 0,
  });
});

// Ruta per actualitzar un usuari.
app.put("/api/users/:id", async (req, res) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Usuari no trobat" });
    }
    res.status(500).json({ message: "Error en actualitzar" });
  }
});

// Ruta per registrar un nou usuari.
app.post("/api/users/register", async (req, res) => {
  const {
    username,
    email,
    password,
    pesoActual,
    altura,
    biografia,
    foto_perfil,
  } = req.body;
  if (!username || !email || !password || pesoActual == null || altura == null)
    return res.status(400).json({ message: "Falten camps obligatoris" });

  try {
    const newUser = await registerUser(
      username,
      email,
      password,
      pesoActual,
      altura,
      biografia,
      foto_perfil
    );
    res.json(newUser);
  } catch (err) {
    if (err.message === "USERNAME_EXISTS") {
      res.status(400).json({ message: "El nom d'usuari ja existeix" });
    } else {
      res.status(500).json({ message: "Error intern en registrar" });
    }
  }
});

// Ruta per iniciar sessió d'un usuari.
app.post("/api/users/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const { user } = await loginUser(username, password);
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        date_created: user.date_created || null,
        pesoActual: user.pesoActual || null,
        altura: user.altura || null,
        nivel: user.nivel || 0,
        biografia: user.biografia || null,
        foto_perfil: user.foto_perfil || null,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Credencials incorrectes" });
  }
});

// Ruta per obtenir la llista d'exercicis.
app.get("/api/exercicis", (req, res) => {
  const filePath = path.resolve(process.cwd(), "exercicis.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error llegint exercicis" });
    }
    try {
      const json = JSON.parse(data);
      return res.json(json);
    } catch (e) {
      return res.status(500).json({ message: "JSON invàlid" });
    }
  });
});

// Ruta per obtenir totes les sessions.
app.get("/api/sessions", (req, res) => {
  res.json(getAllSessions());
});

// Ruta per crear una nova sessió.
app.post("/api/sessions", async (req, res) => {
  const { creatorId, ...sessionData } = req.body;
  if (!creatorId) {
    return res.status(400).json({ message: "L'ID del creador és obligatori" });
  }
  try {
    const newSession = await createSession(sessionData);
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ message: "Error en crear la sessió", error: error.message });
  }
});

// Ruta per obtenir una sessió per ID.
app.get("/api/sessions/:id", (req, res) => {
  const session = getSessionById(req.params.id);
  if (session) {
    res.json(session);
  } else {
    res.status(404).json({ message: "Sessió no trobada" });
  }
});

// Ruta per actualitzar una sessió.
app.put("/api/sessions/:id", async (req, res) => {
  try {
    const updatedSession = await updateSession(req.params.id, req.body);
    if (updatedSession) {
      res.json(updatedSession);
    } else {
      res.status(404).json({ message: "Sessió no trobada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en actualitzar la sessió", error: error.message });
  }
});

// Ruta per eliminar una sessió.
app.delete("/api/sessions/:id", async (req, res) => {
  try {
    const success = await deleteSession(req.params.id);
    if (success) {
      broadcastSessionsUpdate(); // Notifica a tots els clients l'actualització de sessions.
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Sessió no trobada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en eliminar la sessió", error: error.message });
  }
});

// Ruta per unir-se a una sessió.
app.post("/api/sessions/:id/join", async (req, res) => {
  const { userId, password } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "L'ID d'usuari és obligatori" });
  }
  try {
    const updatedSession = await joinSession(req.params.id, userId, password);
    if (updatedSession) {
      res.json(updatedSession);
    } else {
      res.status(404).json({ message: "Sessió no trobada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en unir-se a la sessió", error: error.message });
  }
});

// Ruta per sortir d'una sessió.
app.post("/api/sessions/:id/leave", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "L'ID d'usuari és obligatori" });
  }
  try {
    const updatedSession = await leaveSession(req.params.id, userId);
    if (updatedSession) {
      res.json(updatedSession);
    } else {
      res.status(404).json({ message: "Sessió no trobada o eliminada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en sortir de la sessió", error: error.message });
  }
});

// Ruta per marcar un usuari com a "llest" en una sessió.
app.post("/api/sessions/:id/ready", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "L'ID d'usuari és obligatori" });
  }
  try {
    const { allReady } = setReady(req.params.id, userId);
    if (allReady) {
      startSession(req.params.id);
    }
    res.status(200).json({ message: "Estat de preparació de l'usuari actualitzat" });
  } catch (error) {
    res.status(500).json({ message: "Error en establir l'usuari com a llest", error: error.message });
  }
});

// Ruta per obtenir totes les publicacions.
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error en obtenir les publicacions" });
  }
});

// Ruta per crear una nova publicació.
app.post("/api/posts", async (req, res) => {
  const { username, content } = req.body;
  if (!username || !content) {
    return res.status(400).json({ message: "Usuari i contingut són obligatoris" });
  }
  try {
    const newPost = await createPost(username, content);
    res.status(201).json(newPost);
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Usuari no trobat" });
    }
    res.status(500).json({ message: "Error en crear la publicació" });
  }
});

// Ruta per afegir un comentari a una publicació.
app.post("/api/posts/:id/comment", async (req, res) => {
  const { username, text } = req.body;
  if (!username || !text)
    return res.status(400).json({ message: "Usuari i text són obligatoris" });

  try {
    const comment = await addComment(req.params.id, username, text);
    res.status(201).json(comment);
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Usuari no trobat" });
    }
    if (error.message === "POST_NOT_FOUND") {
      return res.status(404).json({ message: "Publicació no trobada" });
    }
    res.status(500).json({ message: "Error en afegir el comentari" });
  }
});

// Ruta per eliminar una publicació.
app.delete("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  try {
    const success = await deletePost(id, username);
    if (!success)
      return res.status(403).json({ message: "No autoritzat o publicació no trobada" });
    res.json({ message: "Publicació eliminada correctament" });
  } catch (error) {
    res.status(500).json({ message: "Error en eliminar la publicació" });
  }
});

// Ruta per actualitzar una publicació.
app.put("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { username, content } = req.body;
  try {
    const updatedPost = await updatePost(id, username, content);
    if (!updatedPost)
      return res.status(403).json({ message: "No autoritzat o publicació no trobada" });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error en actualitzar la publicació" });
  }
});

// Ruta per eliminar un comentari.
app.delete("/api/posts/:postId/comments/:commentId", async (req, res) => {
  const { postId, commentId } = req.params;
  const { username } = req.body;
  try {
    const success = await deleteComment(postId, commentId, username);
    if (!success)
      return res.status(403).json({ message: "No autoritzat o comentari no trobat" });
    res.json({ message: "Comentari eliminat correctament" });
  } catch (error) {
    res.status(500).json({ message: "Error en eliminar el comentari" });
  }
});

// Funció per iniciar el servidor.
const startServer = async () => {
  try {
    await db.sequelize.sync({ alter: true }); // Sincronitza la base de dades.
    console.log("Base de dades sincronitzada");

    server.listen(PORT, () =>
      console.log(`Servidor HTTP+WS escoltant en el port ${PORT}`)
    );
  } catch (error) {
    console.error("No s'ha pogut connectar a la base de dades:", error);
  }
};

startServer(); // Inicia el servidor.
