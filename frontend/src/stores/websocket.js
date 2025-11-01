import { defineStore } from "pinia";
import router from "@/router"; // Importa el router

export const useWebSocketStore = defineStore("websocket", {
  state: () => ({
    socket: null,
    isConnected: false,
    sessions: [],
    currentSessionId: null,
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
              this.sessions = data.payload;
              break;
            case "SESSION_CREATED":
            case "SESSION_JOINED":
              this.currentSessionId = data.payload.id;
              this.currentSession = data.payload;
              router.push(`/game/${data.payload.id}`);
              break;
            default:
              console.warn("Tipo de mensaje desconocido:", data.type);
          }
        };

        this.socket.onclose = () => {
          this.isConnected = false;
          console.log("WebSocket desconectado");
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
  },
});
