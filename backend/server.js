import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

import { setupWebsocketHandlers } from "./websocket.js";
import {
  loadUsers,
  registerUser,
  loginUser,
  findUserByUsername,
  updateUser,
} from "./users.js";
import {
  loadSessions,
  getSessions,
  addUserToSession,
  getSessionById,
  init as initSessions,
} from "./sessions.js";

const PORT = 5000;
const SECRET = process.env.JWT_SECRET;

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  setupWebsocketHandlers(ws, wss);
});

app.get("/", (req, res) => {
  res.send("Servidor HTTP i WebSocket funcionant!");
});

app.get("/users/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No autorizado" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, SECRET);
    const user = findUserByUsername(payload.username);

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({
      username: user.username,
      email: user.email,
      date_created: user.date_created || null,
      pesoActual: user.pesoActual || null,
      altura: user.altura || null,
    });
  } catch (err) {
    res.status(401).json({ message: "Token inválido" });
  }
});

app.put("/users/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No autorizado" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, SECRET);
    const updatedUser = await updateUser(payload.username, req.body);
    res.json(updatedUser);
  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(401).json({ message: "Token inválido o error al actualizar" });
  }
});

app.post("/users/register", async (req, res) => {
  const { username, email, password, pesoActual, altura } = req.body;
  if (!username || !email || !password)
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
    const { token } = loginUser(username, password);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ message: "Credencials incorrectes" });
  }
});

app.get("/sessions", (req, res) => {
  res.json(getSessions());
});

app.get("/sessions/:id", (req, res) => {
  const session = getSessionById(req.params.id);
  if (!session) return res.status(404).json({ message: "Sessió no trobada" });
  res.json(session);
});

app.post("/sessions/:id/join", async (req, res) => {
  const { username } = req.body;
  if (!username)
    return res.status(400).json({ message: "Falta el nom d'usuari" });

  const result = await addUserToSession(req.params.id, username);
  if (result.error) return res.status(400).json({ message: result.error });

  res.json(result);
});

const startServer = async () => {
  await loadUsers();
  await loadSessions();
  initSessions(wss);
  server.listen(PORT, () =>
    console.log(`Servidor HTTP+WS escoltant en el port ${PORT}`)
  );
};

startServer();
