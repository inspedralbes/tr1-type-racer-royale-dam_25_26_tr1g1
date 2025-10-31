import { registerUser, loginUser } from "./users.js";
import { createSession, getSessions } from "./sessions.js";

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
            await createSession(data.payload.workout);
          } catch (err) {
            ws.send(
              JSON.stringify({
                type: "CREATE_SESSION_ERROR",
                payload: err.message,
              })
            );
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

  ws.on("close", () => {});
};
