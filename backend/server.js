import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import db from "./models/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

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

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

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

wss.on("connection", (ws) => {
  setupWebsocketHandlers(ws, wss);
});

setWssInstance(wss);

app.get("/api/", (req, res) => {
  res.send("Servidor HTTP i WebSocket funcionant!");
});

app.get("/api/users/:id", async (req, res) => {
  const user = await findUserById(req.params.id);

  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

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

app.put("/api/users/:id", async (req, res) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(500).json({ message: "Error al actualizar" });
  }
});

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
      res.status(500).json({ message: "Error intern al registrar" });
    }
  }
});

app.post("/api/users/login", async (req, res) => {
  console.log("Login request body:", req.body);
  const { username, password } = req.body;
  try {
    const { user } = await loginUser(username, password);
    console.log("User found:", user);
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
    console.error("Login error:", err);
    res.status(500).json({ message: "Credencials incorrectes" });
  }
});

app.get("/api/exercicis", (req, res) => {
  const filePath = path.resolve(process.cwd(), "exercicis.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error llegint exercicis.json:", err);
      return res.status(500).json({ message: "Error llegint exercicis" });
    }
    try {
      const json = JSON.parse(data);
      return res.json(json);
    } catch (e) {
      console.error("JSON invàlid a exercicis.json:", e);
      return res.status(500).json({ message: "JSON invàlid" });
    }
  });
});

app.get("/api/sessions", (req, res) => {
  res.json(getAllSessions());
});

app.post("/api/sessions", async (req, res) => {
  const { creatorId, ...sessionData } = req.body;
  if (!creatorId) {
    return res.status(400).json({ message: "Creator ID is required" });
  }
  try {
    const newSession = await createSession(sessionData);
    res.status(201).json(newSession);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating session", error: error.message });
  }
});

app.get("/api/sessions/:id", (req, res) => {
  const session = getSessionById(req.params.id);
  if (session) {
    res.json(session);
  } else {
    res.status(404).json({ message: "Session not found" });
  }
});

app.put("/api/sessions/:id", async (req, res) => {
  try {
    const updatedSession = await updateSession(req.params.id, req.body);
    if (updatedSession) {
      res.json(updatedSession);
    } else {
      res.status(404).json({ message: "Session not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating session", error: error.message });
  }
});

app.delete("/api/sessions/:id", async (req, res) => {
  try {
    const success = await deleteSession(req.params.id);
    if (success) {
      broadcastSessionsUpdate(); // Add this line
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Session not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting session", error: error.message });
  }
});

app.post("/api/sessions/:id/join", async (req, res) => {
  const { userId, password } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const updatedSession = await joinSession(req.params.id, userId, password);
    if (updatedSession) {
      res.json(updatedSession);
    } else {
      res.status(404).json({ message: "Session not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error joining session", error: error.message });
  }
});

app.post("/api/sessions/:id/leave", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const updatedSession = await leaveSession(req.params.id, userId);
    if (updatedSession) {
      res.json(updatedSession);
    } else {
      res.status(404).json({ message: "Session not found or deleted" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error leaving session", error: error.message });
  }
});

app.post("/api/sessions/:id/ready", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const { allReady } = setReady(req.params.id, userId);
    if (allReady) {
      startSession(req.params.id);
    }
    res.status(200).json({ message: "User ready status updated" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error setting user ready", error: error.message });
  }
});

app.get("/api/posts", async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los posts" });
  }
});

app.post("/api/posts", async (req, res) => {
  const { username, content } = req.body;
  if (!username || !content) {
    return res
      .status(400)
      .json({ message: "Usuario y contenido son obligatorios" });
  }
  try {
    const newPost = await createPost(username, content);
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(500).json({ message: "Error al crear el post" });
  }
});

// Comentari post
app.post("/api/posts/:id/comment", async (req, res) => {
  const { username, text } = req.body;
  if (!username || !text)
    return res
      .status(400)
      .json({ message: "Usuario y texto son obligatorios" });

  try {
    const comment = await addComment(req.params.id, username, text);
    res.status(201).json(comment);
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    if (error.message === "POST_NOT_FOUND") {
      return res.status(404).json({ message: "Post no encontrado" });
    }
    res.status(500).json({ message: "Error al añadir comentario" });
  }
});

// Eliminar post
app.delete("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  try {
    const success = await deletePost(id, username);
    if (!success)
      return res
        .status(403)
        .json({ message: "No autorizado o post no encontrado" });
    res.json({ message: "Post eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el post" });
  }
});

// Actualizar post
app.put("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { username, content } = req.body;
  try {
    const updatedPost = await updatePost(id, username, content);
    if (!updatedPost)
      return res
        .status(403)
        .json({ message: "No autorizado o post no encontrado" });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el post" });
  }
});

// Eliminar comentari
app.delete("/api/posts/:postId/comments/:commentId", async (req, res) => {
  const { postId, commentId } = req.params;
  const { username } = req.body;
  try {
    const success = await deleteComment(postId, commentId, username);
    if (!success)
      return res
        .status(403)
        .json({ message: "No autorizado o comentario no encontrado" });
    res.json({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el comentario" });
  }
});

const startServer = async () => {
  try {
    await db.sequelize.sync({ alter: true });
    console.log("Database synchronized");

    server.listen(PORT, () =>
      console.log(`Servidor HTTP+WS escoltant en el port ${PORT}`)
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
