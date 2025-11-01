import { defineStore } from "pinia";
import { useWebSocketStore } from "./websocket";

export const useAppStore = defineStore("app", {
  state: () => ({
    isAuthenticated: false,
    user: null,
    notification: { message: null, type: null },
  }),

  actions: {
    async login(username, password) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        await this.setLoggedIn(data.user);

        this.setNotification("Inicio de sesión correcto", "success");
        return true;
      } catch (err) {
        this.setNotification(err.message, "error");
        return false;
      }
    },

    async register(username, email, password, pesoActual, altura) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            email,
            password,
            pesoActual,
            altura,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        this.setNotification(
          "Registro correcto, ahora inicia sesión",
          "success"
        );
        return true;
      } catch (err) {
        this.setNotification(err.message, "error");
        return false;
      }
    },

    async setLoggedIn(user) {
      const websocketStore = useWebSocketStore();
      await websocketStore.connect("ws://localhost:5000", user.id);
      this.isAuthenticated = true;
      this.user = user;
    },

    setLoggedOut() {
      const websocketStore = useWebSocketStore();
      this.isAuthenticated = false;
      this.user = null;
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
