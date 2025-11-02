<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 mb-4">Active Sessions</h2>
      </v-col>
      <v-col
        v-for="session in sessions"
        :key="session.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="mx-auto" max-width="344">
          <v-card-item>
            <v-card-title>Session ID: {{ session.id }}</v-card-title>
            <v-card-subtitle>Type: {{ session.type }}</v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <div>Status: {{ session.state.status }}</div>
            <div>
              Users: {{ session.users.length }} / {{ session.maxUsers }}
            </div>
            <div>Time: {{ session.time }} minutes</div>
            <div>Public: {{ session.isPublic ? "Yes" : "No" }}</div>
          </v-card-text>

          <v-card-actions>
            <v-btn variant="outlined" @click="joinSession(session.id)"
              >Join Session</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useWebSocketStore } from "@/stores/websocket";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const websocketStore = useWebSocketStore();
const userId = appStore.user.id;

const sessions = computed(() => websocketStore.sessions);

const fetchSessions = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/sessions`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    websocketStore.sessions = data;
  } catch (error) {
    console.error("Error fetching sessions:", error);
  }
};

const joinSession = async (sessionId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/sessions/${sessionId}/join`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedSession = await response.json();
    console.log("Joined session:", updatedSession);
  } catch (error) {
    console.error("Error joining session:", error);
  }
};

onMounted(() => {
  fetchSessions();
  websocketStore.connect("ws://localhost:5000", userId);
});

onBeforeUnmount(() => {
  websocketStore.disconnect();
});
</script>
