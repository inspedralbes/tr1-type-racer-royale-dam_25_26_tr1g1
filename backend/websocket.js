import { registerUser, loginUser } from "./users.js";
import {
  createSession,
  getSessions,
  addUserToSession,
  removeUserFromSession,
} from "./sessions.js";

const sendError = (ws, type, message) => {
  ws.send(JSON.stringify({ type, payload: message }));
};

const handleGetSessions = (ws) => {
  try {
    const sessions = getSessions();
    ws.send(JSON.stringify({ type: "SESSIONS_UPDATE", payload: sessions }));
  } catch (err) {
    console.error("Error getting sessions:", err);
    sendError(ws, "SESSIONS_ERROR", "Error a l'obtenir les sessions");
  }
};

const handleCreateSession = async (ws, payload) => {
  console.log("CREATE_SESSION: Received message");
  try {
    const newSession = await createSession(payload);
    console.log("CREATE_SESSION: Session created successfully", newSession);
    ws.send(JSON.stringify({ type: "SESSION_CREATED", payload: newSession }));
    console.log("CREATE_SESSION: Sent SESSION_CREATED message");
  } catch (err) {
    console.error("CREATE_SESSION: Error creating session", err);
    sendError(ws, "CREATE_SESSION_ERROR", err.message);
  }
};

const handleJoinSession = async (ws, wss, payload) => {
  try {
    const { sessionId, userId } = payload;
    const result = await addUserToSession(sessionId, userId);
    if (result.error) {
      sendError(ws, "JOIN_SESSION_ERROR", { message: result.error });
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
    sendError(ws, "JOIN_SESSION_ERROR", { message: err.message });
  }
};

const handleRegisterWebsocket = (ws, payload) => {
  if (payload.userId) {
    ws.userId = payload.userId;
    console.log(`WebSocket registered for user ${ws.userId}`);
  }
};

export const setupWebsocketHandlers = (ws, wss) => {
  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);
      switch (data.type) {
        case "GET_SESSIONS":
          handleGetSessions(ws);
          break;

        case "CREATE_SESSION":
          handleCreateSession(ws, data.payload);
          break;

        case "JOIN_SESSION":
          handleJoinSession(ws, wss, data.payload);
          break;
        case "REGISTER_WEBSOCKET":
          handleRegisterWebsocket(ws, data.payload);
          break;
        case "JOIN_SESSION_ERROR":
          console.error("Error al unirse a la sesión:", data.payload.message);
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
