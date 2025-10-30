import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { setupWebsocketHandlers } from "./websocket.js";
import { loadUsers } from "./users.js";
import { loadSessions } from "./sessions.js";

const PORT = 5000;
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  setupWebsocketHandlers(ws);
});

app.get("/", (req, res) => {
  res.send("Servidor HTTP i WebSocket funcionant!");
});

const startServer = async () => {
  await loadUsers();
  await loadSessions();
  server.listen(PORT, () =>
    console.log(`Servidor escoltant en el port ${PORT}`)
  );
};

startServer();
