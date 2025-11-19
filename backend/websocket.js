import {
  getAllSessions,
  createSession,
  deleteSession,
  getSessionById,
} from "./sessions/manager.js";
import { joinSession, leaveSession, setReady } from "./sessions/userService.js";
import {
  nextExercise,
  updateRepetitions,
  startSession,
} from "./sessions/gameMaster.js";
import { loginUser, registerUser } from "./users.js";
import { MESSAGE_TYPES } from "./constants.js";

let wssInstance = null;

// Estableix la instància del servidor WebSocket.
export const setWssInstance = (wss) => {
  wssInstance = wss;
};

// Difon un missatge a tots els clients connectats.
export const broadcast = (type, payload) => {
  if (!wssInstance) return;
  const message = JSON.stringify({ type, payload });

  wssInstance.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      try {
        client.send(message);
      } catch (error) {
        console.error("Error enviant missatge WebSocket:", error);
      }
    }
  });
};

// Difon l'actualització de la llista de sessions a tots els clients.
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
        console.error("Error enviant missatge WebSocket:", error);
      }
    }
  });
};

// Difon l'actualització d'una sessió específica als usuaris d'aquesta sessió.
export const broadcastSessionUpdate = (session) => {
  if (!wssInstance) return;
  const message = JSON.stringify({
    type: MESSAGE_TYPES.SESSION_UPDATE,
    payload: session,
  });

  const userIdsInSession = new Set(session.users.map((u) => u.userId));

  wssInstance.clients.forEach((client) => {
    if (
      client.readyState === client.OPEN &&
      userIdsInSession.has(client.userId)
    ) {
      try {
        client.send(message);
      } catch (error) {
        console.error("Error enviant missatge WebSocket:", error);
      }
    }
  });
};

// Difon una reacció amb emoji als usuaris d'una sessió.
export const broadcastEmojiReaction = (session, emoji, userId) => {
  if (!wssInstance) return;
  const message = JSON.stringify({
    type: MESSAGE_TYPES.EMOJI_REACTION,
    payload: { emoji, userId, sessionId: session.id },
  });

  const userIdsInSession = new Set(session.users.map((u) => u.userId));

  wssInstance.clients.forEach((client) => {
    if (
      client.readyState === client.OPEN &&
      userIdsInSession.has(client.userId)
    ) {
      try {
        client.send(message);
      } catch (error) {
        console.error("Error enviant missatge WebSocket:", error);
      }
    }
  });
};

// Difon un esdeveniment de joc als usuaris d'una sessió.
export const broadcastGameEvent = (session, payload) => {
  if (!wssInstance || !session) return;
  const message = JSON.stringify({
    type: MESSAGE_TYPES.GAME_EVENT,
    payload,
  });

  const userIdsInSession = new Set(session.users.map((u) => u.userId));

  wssInstance.clients.forEach((client) => {
    if (
      client.readyState === client.OPEN &&
      userIdsInSession.has(client.userId)
    ) {
      try {
        client.send(message);
      } catch (error) {
        console.error("Error enviant missatge d'esdeveniment de joc:", error);
      }
    }
  });
};

/**
 * Envia un missatge a un sol client.
 * @param {WebSocket} ws - La instància del client WebSocket.
 * @param {string} type - El tipus de missatge.
 * @param {Object} payload - La càrrega útil de dades.
 */
const sendMessage = (ws, type, payload) => {
  ws.send(JSON.stringify({ type, payload }));
};

/**
 * Configura els gestors de missatges i esdeveniments per a una nova connexió WebSocket.
 * @param {WebSocket} ws - El client acabat de connectar.
 * @param {WebSocketServer} wss - La instància del servidor WebSocket.
 */
export const setupWebsocketHandlers = (ws, wss) => {
  // En connectar, envia la llista inicial de sessions
  sendMessage(ws, MESSAGE_TYPES.SESSIONS_UPDATE, getAllSessions());

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);
      const { type, payload } = data;

      switch (type) {
        // GESTIÓ D'USUARIS
        case MESSAGE_TYPES.REGISTER_WEBSOCKET:
          if (payload.userId) {
            ws.userId = payload.userId;
            console.log(
              `Connexió WebSocket registrada per a l'usuari existent: ${ws.userId}`
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
              payload.altura,
              null,
              null
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
            ws.userId = user.id; // Associa l'ID d'usuari amb la connexió
            sendMessage(ws, MESSAGE_TYPES.LOGIN_SUCCESS, {
              userId: user.id,
              username: user.username,
            });
            console.log(
              `L'usuari ${user.username} (${user.id}) ha iniciat sessió via WebSocket.`
            );
          } catch (error) {
            sendMessage(ws, MESSAGE_TYPES.LOGIN_FAIL, {
              message: error.message,
            });
          }
          break;

        // GESTIÓ DE SESSIONS
        case MESSAGE_TYPES.CREATE_SESSION:
          if (!ws.userId)
            return sendMessage(ws, MESSAGE_TYPES.ERROR, {
              message: "L'usuari no ha iniciat sessió.",
            });
          try {
            const newSession = await createSession(payload, ws.userId);
            ws.currentSession = newSession.id;
            sendMessage(ws, MESSAGE_TYPES.CREATE_SUCCESS, newSession);
            broadcastSessionsUpdate();
          } catch (error) {
            sendMessage(ws, MESSAGE_TYPES.ERROR, { message: error.message });
          }
          break;

        case MESSAGE_TYPES.JOIN_SESSION:
          if (!ws.userId) {
            return sendMessage(ws, MESSAGE_TYPES.ERROR, {
              message: "L'usuari no ha iniciat sessió.",
            });
          }
          try {
            const session = await joinSession(
              payload.sessionId,
              ws.userId,
              payload.password
            );
            if (session) {
              ws.currentSession = session.id;
              sendMessage(ws, MESSAGE_TYPES.JOIN_SUCCESS, session);
              broadcastSessionUpdate(session);
              broadcastSessionsUpdate();

              // Nova lògica amb retard per evitar condicions de cursa en el client que s'uneix
              if (session.state.status === "IN_PROGRESS") {
                const joiningUser = session.users.find(
                  (u) => u.userId === ws.userId
                );
                if (joiningUser) {
                  broadcastGameEvent(session, {
                    text: `${joiningUser.username} s'ha unit a la partida.`,
                    gif: "/emojis_gif/1f44b.gif",
                  });
                }
              }
            }
          } catch (error) {
            if (error.message === "SESSION_NOT_FOUND") {
              sendMessage(ws, MESSAGE_TYPES.ERROR, {
                message: "La sessió no existeix o ha sigut eliminada.",
              });
            } else {
              sendMessage(ws, MESSAGE_TYPES.ERROR, { message: error.message });
            }
          }
          break;

        case MESSAGE_TYPES.DELETE_SESSION:
          if (!ws.userId)
            return sendMessage(ws, MESSAGE_TYPES.ERROR, {
              message: "L'usuari no ha iniciat sessió.",
            });
          deleteSession(payload.sessionId);
          broadcastSessionsUpdate();
          break;

        case MESSAGE_TYPES.LEAVE_SESSION:
          if (!ws.userId)
            return sendMessage(ws, MESSAGE_TYPES.ERROR, {
              message: "L'usuari no ha iniciat sessió.",
            });
          const updatedSession = await leaveSession(
            payload.sessionId,
            ws.userId
          );
          if (updatedSession) {
            broadcastSessionUpdate(updatedSession);
          }
          broadcastSessionsUpdate();
          ws.currentSession = null;
          sendMessage(ws, MESSAGE_TYPES.LEAVE_SUCCESS, {});
          break;

        case MESSAGE_TYPES.UPDATE_SCORE:
          if (!ws.userId || !ws.currentSession)
            return sendMessage(ws, MESSAGE_TYPES.ERROR, {
              message: "L'usuari no ha iniciat sessió o no està en una sessió.",
            });
          try {
            updateRepetitions(ws.currentSession, ws.userId);
          } catch (error) {
            sendMessage(ws, MESSAGE_TYPES.ERROR, { message: error.message });
          }
          break;

        case MESSAGE_TYPES.NEXT_EXERCISE:
          if (!ws.userId || !ws.currentSession)
            return sendMessage(ws, MESSAGE_TYPES.ERROR, {
              message: "L'usuari no ha iniciat sessió o no està en una sessió.",
            });
          try {
            const updatedSession = nextExercise(ws.currentSession);
            if (updatedSession) {
              broadcastSessionUpdate(updatedSession);
            }
          } catch (error) {
            sendMessage(ws, MESSAGE_TYPES.ERROR, { message: error.message });
          }
          break;

        case "SET_READY":
          if (!ws.userId || !ws.currentSession)
            return sendMessage(ws, MESSAGE_TYPES.ERROR, {
              message: "L'usuari no ha iniciat sessió o no està en una sessió.",
            });
          const { allReady } = setReady(ws.currentSession, ws.userId);
          if (allReady) {
            startSession(ws.currentSession);
          }
          break;

        case MESSAGE_TYPES.SEND_EMOJI_REACTION:
          if (!ws.userId || !ws.currentSession)
            return sendMessage(ws, MESSAGE_TYPES.ERROR, {
              message: "L'usuari no ha iniciat sessió o no està en una sessió.",
            });
          try {
            const session = getSessionById(ws.currentSession);
            if (session) {
              broadcastEmojiReaction(session, payload.emoji, ws.userId);
            }
          } catch (error) {
            sendMessage(ws, MESSAGE_TYPES.ERROR, { message: error.message });
          }
          break;

        default:
          console.log("Tipus de missatge desconegut:", type);
          sendMessage(ws, MESSAGE_TYPES.ERROR, {
            message: `Tipus de missatge desconegut: ${type}`,
          });
      }
    } catch (err) {
      console.error("Error processant el missatge:", err);
      sendMessage(ws, MESSAGE_TYPES.ERROR, {
        message: "Format de missatge invàlid",
      });
    }
  });

  ws.on("close", async () => {
    if (ws.userId) {
      console.log(`L'usuari ${ws.userId} s'ha desconnectat.`);
      if (ws.currentSession) {
        const updatedSession = await leaveSession(ws.currentSession, ws.userId);
        if (updatedSession) {
          broadcastSessionUpdate(updatedSession);
        }
        broadcastSessionsUpdate();
      }
    }
  });
};