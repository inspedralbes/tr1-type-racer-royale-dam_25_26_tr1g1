import { defineStore } from "pinia";
import { useWebSocketStore } from "./websocket";
import { useUsersStore } from "./users"; // Import the new users store

export const useAppStore = defineStore("app", {
  state: () => {
    const isAuthenticated =
      JSON.parse(localStorage.getItem("isAuthenticated")) || false;
    const userId = JSON.parse(localStorage.getItem("userId")) || null; // Store only userId
    return {
      isAuthenticated,
      userId, // Use userId instead of user object
      currentSession: null,
      notification: { message: null, type: null },
      lastGameEvent: null,
    };
  },
  actions: {
    setLastGameEvent(event) {
      this.lastGameEvent = { ...event, id: Date.now() };
    },
    listenForStorageChanges() {
      window.addEventListener("storage", (event) => {
        if (event.key === "userId") {
          this.userId = event.newValue ? JSON.parse(event.newValue) : null;
        }
        if (event.key === "isAuthenticated") {
          this.isAuthenticated = event.newValue
            ? JSON.parse(event.newValue)
            : false;
        }
      });
    },
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

        // Store the full user object in the users store cache
        const usersStore = useUsersStore();
        usersStore.users[data.user.id] = data.user;

        await this.setLoggedIn(data.user.id); // Pass only the user ID

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
              biografia: biografia,
              foto_perfil: foto_perfil,
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

    async setLoggedIn(userId) {
      const websocketStore = useWebSocketStore();
      if (websocketStore.isConnected) {
        websocketStore.registerWebSocket(userId);
      } else {
        await websocketStore.connect(
          import.meta.env.VITE_WS_URL + "/ws",
          userId
        );
      }
      this.isAuthenticated = true;
      this.userId = userId; // Store only userId
      localStorage.setItem("isAuthenticated", JSON.stringify(true));
      localStorage.setItem("userId", JSON.stringify(userId)); // Store only userId
    },

    async updateUser(userData) {
      try {
        const usersStore = useUsersStore();
        // Determine user id from currently logged in user or from payload
        const userId = this.userId || userData.id;
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
          `${import.meta.env.VITE_API_URL || ""}/api/users/${userId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const updatedUser = await res.json();
        if (!res.ok)
          throw new Error(updatedUser.message || "Error actualitzant usuari");

        // Update the user in the users store cache
        usersStore.users[userId] = updatedUser;
        // No need to update this.userId as it remains the same
        localStorage.setItem("userId", JSON.stringify(this.userId)); // Ensure localStorage is updated with the latest userId

        this.setNotification("Perfil actualitzat correctament", "success");
      } catch (err) {
        this.setNotification(err.message, "error");
      }
    },

    clearUser() {
      this.isAuthenticated = false;
      this.userId = null; // Clear userId
      this.notification = { message: null, type: null };
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userId"); // Remove userId from localStorage
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
