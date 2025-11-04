import {
  getAllSessions,
  createSession,
  joinSession,
  deleteSession,
  leaveSession,
} from "./sessions.js";
import { loginUser, registerUser } from "./users.js";
import { MESSAGE_TYPES } from "./constants.js";

let wssInstance = null;

export const setWssInstance = (wss) => {
  wssInstance = wss;
};

export const broadcastSessionsUpdate = () => {
  if (!wssInstance) return;
  const sessions = getAllSessions();
  const message = JSON.stringify({
    type: "SESSIONS_UPDATE",
    payload: sessions,
  });

  wssInstance.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      try {
        client.send(message);
      } catch (error) {
        console.error("Error enviando mensaje WebSocket:", error);
      }
    }
  });
};

/**
 * Sends a message to a single client.
 * @param {WebSocket} ws - The WebSocket client instance.
 * @param {string} type - The message type.
 * @param {Object} payload - The data payload.
 */
const sendMessage = (ws, type, payload) => {
  ws.send(JSON.stringify({ type, payload }));
};

/**
 * Sets up the message and event handlers for a new WebSocket connection.
 * @param {WebSocket} ws - The newly connected client.
 * @param {WebSocketServer} wss - The WebSocket server instance.
 */
export const setupWebsocketHandlers = (ws, wss) => {
  // On connect, send the initial list of sessions
  sendMessage(ws, MESSAGE_TYPES.SESSIONS_UPDATE, getAllSessions());

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);
      const { type, payload } = data;

      switch (type) {
        // USER MANAGEMENT
        case MESSAGE_TYPES.REGISTER_WEBSOCKET:
          if (payload.userId) {
            ws.userId = payload.userId;
            console.log(
              `WebSocket connection registered for existing user: ${ws.userId}`
            );
          }
          break;

        case MESSAGE_TYPES.REGISTER_USER:
          try {
            const { user } = await registerUser(
              payload.username,
              payload.email,
              payload.password,
              payload.pesoActual,
              payload.altura
            );
            sendMessage(ws, MESSAGE_TYPES.REGISTER_SUCCESS, {
              userId: user.id,
              username: user.username,
            });
          } catch (error) {
            sendMessage(ws, MESSAGE_TYPES.REGISTER_FAIL, {
              message: error.message,
            });
          }
          break;

        case MESSAGE_TYPES.LOGIN_USER:
          try {
            const { user } = loginUser(payload.username, payload.password);
            ws.userId = user.id; // Associate userId with the connection
            sendMessage(ws, MESSAGE_TYPES.LOGIN_SUCCESS, {
              userId: user.id,
              username: user.username,
            });
            console.log(
              `User ${user.username} (${user.id}) logged in via WebSocket.`
            );
          } catch (error) {
            sendMessage(ws, MESSAGE_TYPES.LOGIN_FAIL, {
              message: error.message,
            });
          }
          break;

        // SESSION MANAGEMENT
        case MESSAGE_TYPES.CREATE_SESSION:
          if (!ws.userId)
            return sendMessage(ws, MESSAGE_TYPES.ERROR, {
              message: "User not logged in.",
            });
          try {
            const newSession = await createSession(payload, ws.userId);
            ws.currentSession = newSession.id;
            sendMessage(ws, MESSAGE_TYPES.CREATE_SUCCESS, newSession);
          } catch (error) {
            sendMessage(ws, MESSAGE_TYPES.ERROR, { message: error.message });
          }
          break;

        case MESSAGE_TYPES.JOIN_SESSION:
          if (!ws.userId)
            return sendMessage(ws, MESSAGE_TYPES.ERROR, {
              message: "User not logged in.",
            });
          try {
            const session = await joinSession(
              payload.sessionId,
              ws.userId,
              payload.password
            );
            if (session) {
              ws.currentSession = session.id;
              sendMessage(ws, MESSAGE_TYPES.JOIN_SUCCESS, session);
            }
          } catch (error) {
            sendMessage(ws, MESSAGE_TYPES.ERROR, { message: error.message });
          }
          break;

        case MESSAGE_TYPES.DELETE_SESSION:
          if (!ws.userId)
            return sendMessage(ws, MESSAGE_TYPES.ERROR, {
              message: "User not logged in.",
            });
          deleteSession(payload.sessionId);
          break;

        case MESSAGE_TYPES.LEAVE_SESSION:
          if (!ws.userId)
            return sendMessage(ws, MESSAGE_TYPES.ERROR, {
              message: "User not logged in.",
            });
          leaveSession(payload.sessionId, ws.userId);
          ws.currentSession = null;
          sendMessage(ws, MESSAGE_TYPES.LEAVE_SUCCESS, {});
          break;

        default:
          console.log("Unknown message type:", type);
          sendMessage(ws, MESSAGE_TYPES.ERROR, {
            message: `Unknown message type: ${type}`,
          });
      }
    } catch (err) {
      console.error("Error processing message:", err);
      sendMessage(ws, MESSAGE_TYPES.ERROR, {
        message: "Invalid message format",
      });
    }
  });

  ws.on("close", () => {
    if (ws.userId) {
      console.log(`User ${ws.userId} disconnected.`);
      if (ws.currentSession) {
        leaveSession(ws.currentSession, ws.userId);
      }
    }
  });
};
