import { defineStore } from "pinia";

export const useWebSocketStore = defineStore("websocket", {
  state: () => ({
    socket: null,
    isConnected: false,
    sessions: [],
  }),

  actions: {
    connect(url) {
      return new Promise((resolve, reject) => {
        if (this.socket && this.isConnected) return resolve();

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
          this.isConnected = true;
          console.log("WebSocket conectado");
          resolve();
        };

        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case "SESSIONS_LIST":
              this.sessions = data.payload;
              break;

            case "NEW_SESSION":
              this.getSessions();
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
  },
});
