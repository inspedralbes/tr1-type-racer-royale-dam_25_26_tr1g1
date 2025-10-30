import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const PORT = 5000;

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Cliente conectado");

  ws.on("message", (message) => {
    console.log("Mensaje recibido:", message.toString());
  });

  ws.on("close", () => {
    console.log("Cliente desconectado");
  });
});

app.get("/", (req, res) => {
  res.send("Servidor HTTP i WebSocket funcionant!");
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
