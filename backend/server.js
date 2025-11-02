import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";

dotenv.config();

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

const PORT = 5000;

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  setupWebsocketHandlers(ws, wss);
});

setWssInstance(wss);

app.get("/", (req, res) => {
  res.send("Servidor HTTP i WebSocket funcionant!");
});

// app.get("/sessions", (req, res) => {
//   res.json(getAllSessions());
// });

// app.post("/sessions", async (req, res) => {
//   try {
//     const newSession = await createSession(req.body);
//     res.status(201).json(newSession);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error creating session", error: error.message });
//   }
// });

// app.get("/sessions/:id", (req, res) => {
//   const session = getSessionById(req.params.id);
//   if (session) {
//     res.json(session);
//   } else {
//     res.status(404).json({ message: "Session not found" });
//   }
// });

// app.put("/sessions/:id", async (req, res) => {
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

// app.delete("/sessions/:id", async (req, res) => {
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

// app.post("/sessions/:id/join", async (req, res) => {
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

app.get("/users/:id", (req, res) => {
  const user = findUserById(req.params.id);

  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    date_created: user.date_created || null,
    pesoActual: user.pesoActual || null,
    altura: user.altura || null,
  });
});

app.put("/users/:id", async (req, res) => {
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

app.post("/users/register", async (req, res) => {
  const { username, email, password, pesoActual, altura } = req.body;
  if (!username || !email || !password || !pesoActual || !altura)
    return res.status(400).json({ message: "Falten camps obligatoris" });

  try {
    const newUser = await registerUser(
      username,
      email,
      password,
      pesoActual,
      altura
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

app.post("/users/login", (req, res) => {
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
        puntos: user.puntos || 0,
      },
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

startServer();
