import { defineStore } from "pinia";
import { useAppStore } from "./app";
import router from "@/router";

export const useWebSocketStore = defineStore("websocket", {
  state: () => ({
    socket: null,
    isConnected: false,
    message: null,
  }),
  actions: {
    connect(url) {
      if (this.socket && this.isConnected) return;
      this.socket = new WebSocket(url);
      this.socket.onopen = () => {
        this.isConnected = true;
      };
      this.socket.onmessage = (event) => {
        const appStore = useAppStore();
        const data = JSON.parse(event.data);

        this.message = data;
        switch (data.type) {
          case "LOGIN_SUCCESS":
            appStore.setLoggedIn(data.payload);
            router.push("/sessions");
            break;
          case "LOGIN_ERROR":
            appStore.setNotification(data.payload, "error");
            break;
          case "REGISTER_SUCCESS":
            appStore.setLoggedIn(data.payload);
            router.push("/sessions");
            break;
          case "REGISTER_ERROR":
            appStore.setNotification(data.payload, "error");
            break;
          case "SESSIONS_LIST":
            appStore.setSessions(data.payload);
            break;
        }
      };
      this.socket.onclose = () => {
        this.isConnected = false;
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
    getSessions() {
      this.sendMessage({ type: "GET_SESSIONS" });
    },
  },
});
