import { defineStore } from "pinia";
import { useWebSocketStore } from "./websocket";

export const useAppStore = defineStore("app", {
  state: () => ({
    isAuthenticated: false,
    token: null,
    notification: { message: null, type: null },
  }),

  actions: {
    async login(username, password) {
      try {
        const res = await fetch("http://localhost:5000/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        localStorage.setItem("token", data.token);
        this.setLoggedIn(data.token);

        this.setNotification("Inicio de sesión correcto", "success");
      } catch (err) {
        this.setNotification(err.message, "error");
      }
    },

    async register(username, email, password, pesoActual, altura, pesoObjetivo) {
      try {
        const res = await fetch("http://localhost:5000/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            email,
            password,
            pesoActual,
            altura,
            pesoObjetivo,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message);
        }

        this.setLoggedIn();
        this.setNotification("Registro correcto", "success");
      } catch (err) {
        this.setNotification(err.message, "error");
      }
    },

    setLoggedIn(token) {
      const websocketStore = useWebSocketStore();
      this.isAuthenticated = true;
      this.token = token;
      websocketStore.connect("ws://localhost:5000");
    },

    setLoggedOut() {
      const websocketStore = useWebSocketStore();
      this.isAuthenticated = false;
      this.token = null;
      this.notification = { message: null, type: null };
      websocketStore.disconnect();
    },

    setNotification(message, type) {
      this.notification = { message, type };
      setTimeout(() => {
        this.notification = { message: null, type: null };
      }, 5000);
    },
  },
});
