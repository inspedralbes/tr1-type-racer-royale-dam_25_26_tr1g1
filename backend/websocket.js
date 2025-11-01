import { registerUser, loginUser } from "./users.js";
import {
  createSession,
  getSessions,
  addUserToSession,
  removeUserFromSession,
} from "./sessions.js";

export const setupWebsocketHandlers = (ws, wss) => {
  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);
      switch (data.type) {
        case "GET_SESSIONS":
          try {
            const sessions = getSessions();

            ws.send(
              JSON.stringify({ type: "SESSIONS_UPDATE", payload: sessions })
            );
          } catch (err) {
            ws.send(
              JSON.stringify({
                type: "SESSIONS_ERROR",
                payload: "Error a l'obtenir les sessions",
              })
            );
          }
          break;

        case "CREATE_SESSION":
          try {
            const newSession = await createSession(data.payload);
            const sessions = getSessions();
            wss.clients.forEach((client) => {
              if (client.readyState === 1) {
                client.send(
                  JSON.stringify({ type: "SESSIONS_UPDATE", payload: sessions })
                );
              }
            });
          } catch (err) {
            ws.send(
              JSON.stringify({
                type: "CREATE_SESSION_ERROR",
                payload: err.message,
              })
            );
          }
          break;

        case "JOIN_SESSION":
          try {
            const { sessionId, userId } = data.payload;
            const result = await addUserToSession(sessionId, userId);
            if (result.error) {
              ws.send(
                JSON.stringify({
                  type: "JOIN_SESSION_ERROR",
                  payload: result.error,
                })
              );
            } else {
              const sessions = getSessions();
              wss.clients.forEach((client) => {
                if (client.readyState === 1) {
                  client.send(
                    JSON.stringify({
                      type: "SESSIONS_UPDATE",
                      payload: sessions,
                    })
                  );
                }
              });
            }
          } catch (err) {
            ws.send(
              JSON.stringify({
                type: "JOIN_SESSION_ERROR",
                payload: err.message,
              })
            );
          }
          break;
        case "REGISTER_WEBSOCKET":
          if (data.payload.userId) {
            ws.userId = data.payload.userId;
            console.log(`WebSocket registered for user ${ws.userId}`);
          }
          break;
        default:
          console.log("Tipus de missatge desconegut:", data.type);
      }
    } catch (err) {
      console.error("Error al parsear JSON:", err);
      ws.send(JSON.stringify({ type: "ERROR", payload: "JSON invàlid" }));
    }
  });

  ws.on("close", () => {
    if (ws.userId) {
      console.log(`User ${ws.userId} disconnected. Removing from session.`);
      removeUserFromSession(ws.userId).catch((err) => {
        console.error("Error removing user from session:", err);
      });
    }
  });
};
