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
        <v-card class="mx-auto" hover elevation="8" rounded="lg">
          <v-card-item>
            <v-card-title class="d-flex align-center">
              <v-icon icon="mdi-dumbbell" class="mr-2" />
              <span>{{ session.type }}</span>
            </v-card-title>
            <v-card-subtitle
              >ID: {{ session.id.substring(0, 8) }}</v-card-subtitle
            >
          </v-card-item>

          <v-divider />

          <v-card-text class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon icon="mdi-account-group" class="mr-2" />
              <span>{{ session.users.length }} / {{ session.maxUsers }}</span>
            </div>
            <div class="d-flex align-center">
              <v-icon icon="mdi-clock-outline" class="mr-2" />
              <span>{{ session.time }} min</span>
            </div>
            <div class="d-flex align-center">
              <v-icon
                :icon="session.isPublic ? 'mdi-earth' : 'mdi-lock'"
                class="mr-2"
              />
              <span>{{ session.isPublic ? "Public" : "Private" }}</span>
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions class="justify-center">
            <v-btn
              color="primary"
              variant="elevated"
              @click="joinSession(session.id)"
              :disabled="
                session.users.length >= session.maxUsers ||
                session.state.status !== 'WAITING'
              "
            >
              <v-icon left>mdi-play-circle-outline</v-icon>
              Join Session
            </v-btn>
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
