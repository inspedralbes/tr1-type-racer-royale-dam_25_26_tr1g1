import { defineStore } from "pinia";
import { useAppStore } from "./app";

export const useWebSocketStore = defineStore("websocket", {
  state: () => ({
    socket: null,
    isConnected: false,
    message: null,
  }),
  actions: {
    connect(url) {
      if (this.socket && this.isConnected) {
        console.warn("WebSocket already connected.");
        return;
      }

      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        this.isConnected = true;
        console.log("WebSocket connected");
      };

      this.socket.onmessage = (event) => {
        const appStore = useAppStore();
        const data = JSON.parse(event.data);
        this.message = data;

        switch (data.type) {
          case "LOGIN_SUCCESS":
            appStore.setLoggedIn(data.payload.username);
            break;
          case "LOGIN_ERROR":
            appStore.setNotification(data.payload, "error");
            break;
          case "REGISTER_SUCCESS":
            appStore.setNotification(data.payload, "success");
            break;
          case "REGISTER_ERROR":
            break;
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        console.log("WebSocket disconnected");
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    },

    disconnect() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
        this.isConnected = false;
      }
    },

    sendMessage(message) {
      if (this.socket && this.isConnected) {
        this.socket.send(JSON.stringify(message));
      } else {
        console.error("WebSocket is not connected.");
      }
    },
  },
});
