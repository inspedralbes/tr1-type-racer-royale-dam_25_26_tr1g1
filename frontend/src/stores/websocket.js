import { defineStore } from "pinia";

export const useWebSocketStore = defineStore("websocket", {
  state: () => ({
    socket: null,
    isConnected: false,
    message: null,
  }),
  actions: {
    connect(url) {
      this.socket = new WebSocket(url);
      if (this.socket && this.isConnected) {
        console.warn("WebSocket already connected.");
        return;
      }

      this.socket.onopen = () => {
        this.isConnected = true;
        console.log("WebSocket connected");
      };
      this.socket.onmessage = (event) => {
        this.message = JSON.parse(event.data);
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
        this.socket.onopen = null;
        this.socket.onmessage = null;
        this.socket.onclose = null;
        this.socket.onerror = null;
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
