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
              this.sessions = data.payload;
              break;

            case "CREATE_SUCCESS":
              this.currentSession = data.payload;
              router.push(`/session/${data.payload.id}`);
              break;

            case "JOIN_SUCCESS":
              this.currentSession = data.payload;
              router.push(`/session/${data.payload.id}`);
              break;


            case "ERROR":
              console.error("Error from server:", data.payload.message);
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
