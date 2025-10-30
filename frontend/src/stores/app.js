import { defineStore } from "pinia";
import { useWebSocketStore } from "./websocket";

export const useAppStore = defineStore("app", {
  state: () => ({
    sessions: [],
    user: {
      username: "",
      email: "",
      password: "",
      date_created: "",
    },
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
        payload: { username, email, password },
      });
    },
    setLoggedIn(user) {
      this.isAuthenticated = true;
      this.user.username = user.username;
      this.user.email = user.email;
      this.user.date_created = user.date_created;
    },
    setLoggedOut() {
      this.isAuthenticated = false;
      this.user = { username: "", email: "", date_created: "", token: "" };
    },
    setNotification(message, type) {
      this.notification = { message, type };
      setTimeout(() => {
        this.notification = { message: null, type: null };
      }, 5000);
    },
    setSessions(sessions) {
      this.sessions = sessions;
    },
  },
});
