import { defineStore } from "pinia";
import router from "@/router"; // Importa el router
import { useAppStore } from "./app";

export const useWebSocketStore = defineStore("websocket", {
  state: () => ({
    socket: null,
    isConnected: false,
    sessions: [],
  }),

  actions: {
    connect(url, userId) {
      return new Promise((resolve, reject) => {
        if (this.socket && this.isConnected) return resolve();

        this.socket = new WebSocket(import.meta.env.VITE_WS_BASE_URL || `${window.location.protocol === 'https:' ? 'wss://' : 'ws://'}${window.location.host}/ws/`);

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
          const appStore = useAppStore();

          switch (data.type) {
            case "SESSIONS_UPDATE":
              this.sessions = data.payload;
              break;

            case "SESSION_UPDATE":
              if (appStore.currentSession && appStore.currentSession.id === data.payload.id) {
                appStore.setCurrentSession(data.payload);
              }
              break;

            case "CREATE_SUCCESS":
              appStore.setCurrentSession(data.payload);
              router.push(`/session/${data.payload.id}`);
              break;

            case "JOIN_SUCCESS":
              appStore.setCurrentSession(data.payload);
              router.push(`/session/${data.payload.id}`);
              break;

            case "LEAVE_SUCCESS":
              appStore.clearCurrentSession();
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
