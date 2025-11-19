import { defineStore } from "pinia";
import router from "@/router";
import { useAppStore } from "./app";
import { usePostsStore } from "./posts";

export const useWebSocketStore = defineStore("websocket", {
  state: () => ({
    socket: null,
    isConnected: false,
    sessions: [],
    listeners: {},
    lastMessage: null,
  }),

  actions: {
    connect(url, userId) {
      return new Promise((resolve, reject) => {
        if (this.socket) return resolve();

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
          this.isConnected = true;
          console.log("WebSocket conectado");
          if (userId) {
            this.registerWebSocket(userId);
          }

          resolve();
        };

        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.lastMessage = data;
          const appStore = useAppStore();
          const postsStore = usePostsStore();

          // Dispatch to generic listeners
          if (this.listeners[data.type]) {
            this.listeners[data.type].forEach((callback) =>
              callback(data.payload)
            );
          }

          // Handle core, global events
          switch (data.type) {
            case "SESSIONS_UPDATE":
              this.sessions = data.payload;
              break;

            case "SESSION_UPDATE":
              const index = this.sessions.findIndex(
                (s) => s.id === data.payload.id
              );
              if (index !== -1) {
                this.sessions[index] = data.payload;
              }

              if (
                appStore.currentSession &&
                appStore.currentSession.id === data.payload.id
              ) {
                appStore.setCurrentSession(data.payload);
              }
              break;

            case "CREATE_SUCCESS":
              appStore.setCurrentSession(data.payload);
              router.push(`/session/${data.payload.id}`);
              break;

            case "JOIN_SUCCESS":
              appStore.setCurrentSession(data.payload);
              router.push(`/session/${data.payload.id}`);
              break;

            case "LEAVE_SUCCESS":
              appStore.clearCurrentSession();
              break;

            case "EMOJI_REACTION":
              const sessionIndex = this.sessions.findIndex(
                (s) => s.id === data.payload.sessionId
              );
              if (sessionIndex !== -1) {
                const session = this.sessions[sessionIndex];
                session.latestReaction = { ...data.payload, id: Date.now() };

                if (
                  appStore.currentSession &&
                  appStore.currentSession.id === session.id
                ) {
                  appStore.setCurrentSession(session);
                }
              }
              break;

            case "ERROR":
              console.error("Error from server:", data.payload.message);
              if (
                data.payload.message ===
                "La sessió no existeix o ha sigut eliminada."
              ) {
                router.push("/sessions");
              }
              break;

            // Events handled by listeners, no need for default case
            case "NEW_POST":
              postsStore.handleNewPost(data.payload);
              break;
            case "NEW_COMMENT":
              postsStore.handleNewComment(data.payload);
              break;
            case "GAME_EVENT":
              // Handled by listeners
              break;
            default:
              console.warn("Tipo de mensaje desconocido:", data.type);
          }
        };

        this.socket.onclose = () => {
          console.log("WebSocket desconectado", this.socket);
          this.isConnected = false;
        };

        this.socket.onerror = (error) => {
          console.error("WebSocket error:", error);
          reject(error);
        };
      });
    },

    disconnect() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
        this.isConnected = false;
        this.listeners = {};
        console.log("WebSocket cerrado");
      }
    },

    sendMessage(message) {
      if (this.socket && this.isConnected) {
        this.socket.send(JSON.stringify(message));
      } else {
        console.error("WebSocket no está conectado.");
      }
    },

    registerWebSocket(userId) {
      this.sendMessage({ type: "REGISTER_WEBSOCKET", payload: { userId } });
    },

    on(eventType, callback) {
      if (!this.listeners[eventType]) {
        this.listeners[eventType] = [];
      }
      this.listeners[eventType].push(callback);
    },

    off(eventType, callback) {
      if (this.listeners[eventType]) {
        this.listeners[eventType] = this.listeners[eventType].filter(
          (cb) => cb !== callback
        );
      }
    },
  },
});
