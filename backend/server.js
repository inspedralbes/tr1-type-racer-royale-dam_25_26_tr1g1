import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const PORT = 5000;

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client Conectat");

  ws.on("message", (missatge) => {
    try {
      const data = JSON.parse(missatge);
      console.log(data);
    } catch (err) {
      console.error("Error al parsear JSON:", err);
    }
  });

  ws.on("close", () => {
    console.log("Client Desconectat");
  });
});

app.get("/", (req, res) => {
  res.send("Servidor HTTP i WebSocket funcionant!");
});

server.listen(PORT, () => {
  console.log(`Servidor escoltant en el port ${PORT}`);
});
