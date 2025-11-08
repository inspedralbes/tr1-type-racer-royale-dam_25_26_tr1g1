import { defineStore } from "pinia";
import { useWebSocketStore } from "./websocket";

export const useAppStore = defineStore("app", {
  state: () => {
    const isAuthenticated =
      JSON.parse(localStorage.getItem("isAuthenticated")) || false;
    const user = JSON.parse(localStorage.getItem("user")) || null;
    return {
      isAuthenticated,
      user,
      currentSession: null,
      notification: { message: null, type: null },
    };
  },
  actions: {
    async login(username, password) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || ""}/api/users/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          }
        );

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

    async register(
      username,
      email,
      password,
      pesoActual,
      altura,
      biografia,
      foto_perfil
    ) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || ""}/api/users/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username,
              email,
              password,
              pesoActual,
              altura,
              biografia: biografia || "",
              foto_perfil: foto_perfil || "",
            }),
          }
        );

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
      if (websocketStore.isConnected) {
        websocketStore.registerWebSocket(user.id);
      } else {
        await websocketStore.connect(import.meta.env.VITE_WS_URL, user.id);
      }
      this.isAuthenticated = true;
      this.user = user;
      localStorage.setItem("isAuthenticated", JSON.stringify(true));
      localStorage.setItem("user", JSON.stringify(user));
    },

    async updateUser(userData) {
      try {
        // Determine user id from currently logged in user or from payload
        const userId = this.user?.id || userData.id;
        if (!userId) throw new Error("User ID no disponible per actualitzar");

        // Ensure numeric fields are numbers (v-model may provide strings)
        const payload = { ...userData };
        if (payload.pesoActual !== undefined && payload.pesoActual !== null) {
          const n = Number(payload.pesoActual);
          if (!Number.isNaN(n)) payload.pesoActual = n;
        }
        if (payload.altura !== undefined && payload.altura !== null) {
          const n = Number(payload.altura);
          if (!Number.isNaN(n)) payload.altura = n;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL || ''}/api/users/${userId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const updatedUser = await res.json();
        if (!res.ok) throw new Error(updatedUser.message || "Error actualitzant usuari");

        this.user = updatedUser;
        localStorage.setItem("user", JSON.stringify(this.user));
        this.setNotification("Perfil actualitzat correctament", "success");
      } catch (err) {
        this.setNotification(err.message, "error");
      }
    },

    clearUser() {
      this.isAuthenticated = false;
      this.user = null;
      this.notification = { message: null, type: null };
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    },

    setLoggedOut() {
      const websocketStore = useWebSocketStore();
      this.clearUser();
      websocketStore.disconnect();
    },

    setNotification(message, type) {
      this.notification = { message, type };
      setTimeout(() => {
        this.notification = { message: null, type: null };
      }, 5000);
    },

    setCurrentSession(session) {
      this.currentSession = session;
    },

    clearCurrentSession() {
      this.currentSession = null;
    },

    nextExercise() {
      if (this.currentSession?.state) {
        this.currentSession.state.currentExercise++;
        this.currentSession.state.repetitions = 0;
        this.currentSession.state.currentSerie = 1;
      }
    },

    incrementRepetitions() {
      if (this.currentSession?.state) {
        this.currentSession.state.repetitions++;
      }
    },

    nextSerie() {
      if (this.currentSession?.state) {
        this.currentSession.state.currentSerie++;
        this.currentSession.state.repetitions = 0;
      }
    },
  },
});
