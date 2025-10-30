import { defineStore } from "pinia";
import { useWebSocketStore } from "./websocket";

export const useAppStore = defineStore("app", {
  state: () => ({
    username: "",
    password: "",
    email: "",
    isAuthenticated: false,
    notification: { message: null, type: null },
  }),
  actions: {
    login(username, password) {
      const websocketStore = useWebSocketStore();
      websocketStore.sendMessage({
        type: "LOGIN_USER",
        payload: { username, password },
      });
    },
    register(username, email, password) {
      const websocketStore = useWebSocketStore();
      websocketStore.sendMessage({
        type: "REGISTER_USER",
        payload: { username, password },
      });
    },
    setLoggedIn(username) {
      this.isAuthenticated = true;
      this.username = username;
      this.password = "";
    },
    setLoggedOut() {
      this.isAuthenticated = false;
      this.username = "";
    },
    setLoggedIn(username) {
      this.isAuthenticated = true;
      this.username = username;
      this.password = "";
    },
    setLoggedOut() {
      this.isAuthenticated = false;
      this.username = "";
    },
    setNotification(message, type) {
      this.notification = { message, type };
      setTimeout(() => {
        this.notification = { message: null, type: null };
      }, 5000);
    },
  },
});
