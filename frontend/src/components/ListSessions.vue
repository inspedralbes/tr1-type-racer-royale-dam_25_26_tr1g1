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

const joinSession = (sessionId) => {
  websocketStore.sendMessage({
    type: "JOIN_SESSION",
    payload: { sessionId },
  });
};

</script>
