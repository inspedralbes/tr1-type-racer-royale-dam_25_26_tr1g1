import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";

dotenv.config();
/*
import { setupWebsocketHandlers, setWssInstance } from "./websocket.js";
import { findUserById, registerUser, loginUser, updateUser } from "./users.js";
import {
  getAllSessions,
  createSession,
  getSessionById,
  updateSession,
  deleteSession,
  joinSession,
} from "./sessions.js";
import {
  getAllPosts,
  createPost,
  toggleLike,
  addComment,
  deletePost,
  deleteComment,
} from "./posts.js";

const PORT = 5000;

const app = express();
app.use(cors());
app.use(express.json());

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  setupWebsocketHandlers(ws, wss);
});

setWssInstance(wss);

app.get("/api/", (req, res) => {
  res.send("Servidor HTTP i WebSocket funcionant!");
});

app.get("/api/users/:id", (req, res) => {
  const user = findUserById(req.params.id);

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
  if (!username || !email || !password || !pesoActual || !altura)
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

app.post("/api/users/login", (req, res) => {
  const { username, password } = req.body;
  try {
    const { user } = loginUser(username, password);
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
    res.status(401).json({ message: "Credencials incorrectes" });
  }
});

app.get("/api/exercicis", (req, res) => {
  const filePath = path.join(__dirname, "exercicis.json");
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

// app.get("/api/sessions/:id", (req, res) => {
//   const session = getSessionById(req.params.id);
//   if (session) {
//     res.json(session);
//   } else {
//     res.status(404).json({ message: "Session not found" });
//   }
// });

// app.put("/api/sessions/:id", async (req, res) => {
//   try {
//     const updatedSession = await updateSession(req.params.id, req.body);
//     if (updatedSession) {
//       res.json(updatedSession);
//     } else {
//       res.status(404).json({ message: "Session not found" });
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error updating session", error: error.message });
//   }
// });

// app.delete("/api/sessions/:id", async (req, res) => {
//   try {
//     const success = await deleteSession(req.params.id);
//     if (success) {
//       res.status(204).send();
//     } else {
//       res.status(404).json({ message: "Session not found" });
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error deleting session", error: error.message });
//   }
// });

// app.post("/api/sessions/:id/join", async (req, res) => {
//   const { userId } = req.body;
//   if (!userId) {
//     return res.status(400).json({ message: "User ID is required" });
//   }
//   try {
//     const updatedSession = await joinSession(req.params.id, userId);
//     if (updatedSession) {
//       res.json(updatedSession);
//     } else {
//       res.status(404).json({ message: "Session not found" });
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error joining session", error: error.message });
//   }
// });

app.get("/api/users/:id", (req, res) => {
  const user = findUserById(req.params.id);

  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    date_created: user.date_created || null,
    pesoActual: user.pesoActual || null,
    altura: user.altura || null,
    biografia: user.biografia || null,
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
  const { username, email, password, pesoActual, altura, biografia } = req.body;
  if (!username || !email || !password || !pesoActual || !altura)
    return res.status(400).json({ message: "Falten camps obligatoris" });

  try {
    const newUser = await registerUser(
      username,
      email,
      password,
      pesoActual,
      altura,
      biografia
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

app.post("/api/users/login", (req, res) => {
  const { username, password } = req.body;
  try {
    const { user } = loginUser(username, password);
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
      },
    });
  } catch (err) {
    res.status(401).json({ message: "Credencials incorrectes" });
  }
});

app.get("/api/posts", (req, res) => {
  res.json(getAllPosts());
});

app.post("/api/posts", (req, res) => {
  const { username, content } = req.body;
  if (!username || !content) {
    return res
      .status(400)
      .json({ message: "Username and content are required" });
  }
  const newPost = createPost(username, content);
  res.status(201).json(newPost);
});

// Like
app.post("/api/posts/:id/like", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: "Username required" });

  const updatedPost = toggleLike(req.params.id, username);
  if (!updatedPost) return res.status(404).json({ message: "Post not found" });

  res.json(updatedPost);
});

// Comentari post
app.post("/api/posts/:id/comment", (req, res) => {
  const { username, text } = req.body;
  if (!username || !text)
    return res.status(400).json({ message: "Username and text required" });

  const comment = addComment(req.params.id, username, text);
  if (!comment) return res.status(404).json({ message: "Post not found" });

  res.status(201).json(comment);
});

// Eliminar post
app.delete("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  const success = deletePost(id, username);
  if (!success)
    return res
      .status(403)
      .json({ message: "No autorizado o post no encontrado" });
  res.json({ message: "Post eliminado correctamente" });
});

// Eliminar comentari
app.delete("/api/posts/:postId/comments/:commentId", (req, res) => {
  const { postId, commentId } = req.params;
  const { username } = req.body;
  const success = deleteComment(postId, commentId, username);
  if (!success)
    return res
      .status(403)
      .json({ message: "No autorizado o comentario no encontrado" });
  res.json({ message: "Comentario eliminado correctamente" });
});

const startServer = async () => {
  server.listen(PORT, () =>
    console.log(`Servidor HTTP+WS escoltant en el port ${PORT}`)
  );
};

startServer();
*/
import { setupWebsocketHandlers, setWssInstance } from "./websocket.js";
// Las funciones importadas ahora son asíncronas
import { findUserById, registerUser, loginUser, updateUser } from "./users.js"; 
import {
  getAllSessions,
  createSession,
// ... otras funciones de sessions ...
} from "./sessions.js";
import { getAllPosts, createPost } from "./posts.js";
const PORT = 5000;

const app = express();
app.use(cors());
app.use(express.json());

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  setupWebsocketHandlers(ws, wss);
});

setWssInstance(wss);
// MAPEAR DATOS DE LA BASE DE DATOS
const mapUserToApiResponse = (user) => {
    if (!user) return null;
    
    // 1. ✅ CORRECCIÓN: Definir nivelNumerico aquí
    // Usamos 'user.nivell' y si es null/undefined, usamos 0.
    const nivelNumerico = user.nivell || 0; 

    return {
        id: user.id_sessio, 
        username: user.nom_usuari, 
        email: user.correu,
        date_created: user.data_registre, 
        pesoActual: user.pes_actual,
        altura: user.altura,
        biografia: user.biografia,
        nivel: Number(nivelNumerico)
    };
};


app.get("/api/", (req, res) => {
  res.send("Servidor HTTP i WebSocket funcionant!");
});

// Obtener Usuario por ID
app.get("/api/users/:id", async (req, res) => { // ¡Marcar como async!
  const id = req.params.id;
  const user = await findUserById(id); // ¡Usar await!

  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  res.json(mapUserToApiResponse(user)); // Usar el helper de mapeo
});

// Actualizar Usuario por ID
app.put("/api/users/:id", async (req, res) => { 
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
  
    res.json(mapUserToApiResponse(updatedUser)); 
    
  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Añadimos logging para ver el error real
    console.error("Error al actualizar usuario:", err); 
    res.status(500).json({ message: "Error al actualizar" });
  }
});

// Registro de Usuario
app.post("/api/users/register", async (req, res) => { // Ya es async, ¡ajustar campos y mapeo!
  const {
    username,
    email,
    password,
    pesoActual,
    altura,
    biografia,
    foto_perfil, // Quitar si no se usa, o ignorar
  } = req.body;
  // foto_perfil no está en la BD, se omite en el check de campos obligatorios
  if (!username || !email || !password || !pesoActual || !altura)
    return res.status(400).json({ message: "Falten camps obligatoris" });

  try {
    const { user } = await registerUser( // ¡Usar await y quitar foto_perfil!
      username,
      email,
      password,
      pesoActual,
      altura,
      biografia
    );
    res.status(201).json({ user: mapUserToApiResponse(user) }); 
    
  } catch (err) {
    if (err.message === "USERNAME_EXISTS") {
      res.status(400).json({ message: "El nom d'usuari ja existeix" });
    } else if (err.message === "EMAIL_EXISTS") { // Manejo de duplicidad de correo desde users.js
      res.status(400).json({ message: "El correu ja està registrat" });
    } else {
      console.error(err);
      res.status(500).json({ message: "Error intern al registrar" });
    }
  }
});
app.post("/api/users/login", async (req, res) => { // ¡Marcar como async!
  const { username, password } = req.body;
  try {
    const { user } = await loginUser(username, password); // ¡Usar await!
    
    // Devolver la respuesta mapeada
    res.json({
      user: mapUserToApiResponse(user),
    });
  } catch (err) {
    res.status(401).json({ message: "Credencials incorrectes" });
  }
});
const startServer = async () => {
  server.listen(PORT, () =>
    console.log(`Servidor HTTP+WS escoltant en el port ${PORT}`)
  );
};
app.get("/api/exercicis", (req, res) => {
  const filePath = path.join(__dirname, "exercicis.json");
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

startServer();