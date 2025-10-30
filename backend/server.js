import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

import fs from "fs";
const fsp = fs.promises;

const PORT = 5000;

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let usuaris = [];

wss.on("connection", (ws) => {
  console.log("Client Conectat");

  ws.on("message", (missatge) => {
    try {
      const data = JSON.parse(missatge);
      switch (data.type) {
        case "REGISTER_USER":
          const { username, password } = data.payload;
          if (usuaris.find((user) => user.username === username)) {
            ws.send(
              JSON.stringify({
                type: "REGISTER_ERROR",
                payload: "El nom d'usuari ja existeix",
              })
            );
          } else {
            usuaris.push({ username, password });
            ws.send(
              JSON.stringify({
                type: "REGISTER_SUCCESS",
                payload: "Usuari registrat correctament",
              })
            );
            console.log("Usuari nou registrat:", { username });
            console.log("Llista d'usuaris:", usuaris);
          }
          break;

        case "LOGIN_USER":
          const { username: loginUsername, password: loginPassword } =
            data.payload;
          const user = usuaris.find(
            (user) =>
              user.username === loginUsername && user.password === loginPassword
          );
          if (user) {
            ws.send(
              JSON.stringify({
                type: "LOGIN_SUCCESS",
                payload: { username: user.username },
              })
            );
            console.log("Usuari loguejat:", { username: user.username });
          } else {
            ws.send(
              JSON.stringify({
                type: "LOGIN_ERROR",
                payload: "Credencials incorrectes",
              })
            );
            console.log("Intent de login fallit:", {
              username: loginUsername,
            });
          }
          break;

        default:
          console.log("Tipus de missatge desconegut:", data.type);
          break;
      }
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
