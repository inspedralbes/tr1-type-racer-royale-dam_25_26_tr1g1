import { defineStore } from "pinia";
import router from "@/router"; // Importa el router

export const useWebSocketStore = defineStore("websocket", {
  state: () => ({
    socket: null,
    isConnected: false,
    sessions: [],
    currentSession: null,
  }),

  actions: {
    connect(url, userId) {
      return new Promise((resolve, reject) => {
        if (this.socket && this.isConnected) return resolve();

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
          this.isConnected = true;
          console.log("WebSocket conectado");
          if (userId) {
            this.registerWebSocket(userId);
          }
          this.getSessions();
          resolve();
        };

        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case "SESSIONS_UPDATE":
              this.handleSessionsUpdate(data.payload);
              break;
            case "SESSION_CREATED":
              this.handleSessionCreatedOrJoined(data.payload);
              break;
            case "SESSION_JOINED":
              this.handleSessionCreatedOrJoined(data.payload);
              break;
            case "JOIN_SESSION_ERROR":
              this.handleJoinSessionError(data.payload.message);
              break;
            default:
              console.warn("Tipo de mensaje desconocido:", data.type);
          }
        };

        this.socket.onclose = () => {
          console.log("WebSocket desconectado", this.socket);
          this.isConnected = false;
        };

        this.socket.onerror = (error) => {
          console.error("WebSocket error:", error);
          reject(error);
        };
      });
    },

    disconnect() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
        this.isConnected = false;
        console.log("WebSocket cerrado");
      }
    },

    sendMessage(message) {
      if (this.socket && this.isConnected) {
        this.socket.send(JSON.stringify(message));
      } else {
        console.error("WebSocket no está conectado.");
      }
    },

    getSessions() {
      this.sendMessage({ type: "GET_SESSIONS" });
    },

    createSession(options) {
      this.sendMessage({ type: "CREATE_SESSION", payload: options });
    },

    joinSession(sessionId, userId) {
      this.sendMessage({
        type: "JOIN_SESSION",
        payload: { sessionId, userId },
      });
    },

    registerWebSocket(userId) {
      this.sendMessage({ type: "REGISTER_WEBSOCKET", payload: { userId } });
    },

    handleSessionsUpdate(sessions) {
      this.sessions = sessions;
    },

    handleSessionCreatedOrJoined(session) {
      this.currentSessionId = session.id;
      this.currentSession = session;
      router.push(`/game/${session.id}`);
    },

    handleJoinSessionError(message) {
      console.error("Error joining session:", message);
    },
  },
});
