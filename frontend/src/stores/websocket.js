import { defineStore } from "pinia";
import router from "@/router"; // Importa el router

export const useWebSocketStore = defineStore("websocket", {
  state: () => ({
    socket: null,
    isConnected: false,
    sessions: [], // New state property for sessions
  }),

  actions: {
    connect(url, userId) {
      return new Promise((resolve, reject) => {
        if (this.socket && this.isConnected) return resolve();

        this.socket = new WebSocket(import.meta.env.VITE_WS_URL);

        this.socket.onopen = () => {
          this.isConnected = true;
          console.log("WebSocket conectado");
          if (userId) {
            this.registerWebSocket(userId);
          }

          resolve();
        };

        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case "SESSIONS_UPDATE":
              this.sessions = data.payload; // Update sessions state
              console.log("Sessions updated via WebSocket:", this.sessions);
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

    registerWebSocket(userId) {
      this.sendMessage({ type: "REGISTER_WEBSOCKET", payload: { userId } });
    },
  },
});
