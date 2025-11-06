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
      notification: { message: null, type: null },
      currentSession: null,
    };
  },
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

    async register(username, email, password, pesoActual, altura, biografia, foto_perfil) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/users/register`,
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
        await websocketStore.connect("ws://localhost:5000", user.id);
      }
      this.isAuthenticated = true;
      this.user = user;
      localStorage.setItem("isAuthenticated", JSON.stringify(true));
      localStorage.setItem("user", JSON.stringify(user));
    },

    async updateUser(userData) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${this.user.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          }
        );
        const updatedUser = await res.json();
        if (!res.ok) throw new Error(updatedUser.message);

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

    setRepetitions(count) {
      if (this.currentSession?.state) {
        this.currentSession.state.repetitions = count;
      }
    },

    incrementRepetitions() {
      if (this.currentSession?.state) {
        if (!this.currentSession.state.repetitions) {
          this.currentSession.state.repetitions = 0;
        }
        this.currentSession.state.repetitions++;
      }
    },

    resetRepetitions() {
      if (this.currentSession?.state) {
        this.currentSession.state.repetitions = 0;
      }
    },

    setCurrentSerie(serie) {
      if (this.currentSession?.state) {
        this.currentSession.state.currentSeries = serie;
      }
    },

    nextExercise() {
      if (this.currentSession?.state) {
        this.currentSession.state.currentExerciseIndex++;
        this.currentSession.state.currentSeries = 1;
        this.currentSession.state.repetitions = 0;
      }
    },
  },
});
