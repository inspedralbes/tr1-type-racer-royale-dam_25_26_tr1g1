<template>
  <v-container>
    <v-list lines="two" class="bg-transparent">
      <v-list-item
        v-for="session in sessions"
        :key="session.id"
        class="mb-4 pa-4"
        @click="joinSession(session.id)"
        :disabled="
          session.users.length >= session.maxUsers ||
          session.state.status !== 'WAITING'
        "
        elevation="4"
        rounded="lg"
        style="
          background-color: rgba(var(--v-theme-surface), 0.8);
          backdrop-filter: blur(4px);
        "
      >
        <div class="d-flex flex-wrap align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar color="primary" size="56" class="mr-4">
              <v-icon size="32">mdi-dumbbell</v-icon>
            </v-avatar>
            <div>
              <v-list-item-title class="text-h5 font-weight-bold">{{
                session.type
              }}</v-list-item-title>
              <v-list-item-subtitle class="text-body-1"
                >ID: {{ session.id.substring(0, 8) }}</v-list-item-subtitle
              >
            </div>
          </div>

          <div class="d-flex align-center text-h6 mt-4 mt-md-0">
            <div class="d-flex align-center mr-4">
              <v-icon icon="mdi-account-group" class="mr-2" />
              <span
                >{{ session.users.length }} / {{ session.maxUsers }}</span
              >
            </div>
            <div class="d-flex align-center mr-4">
              <v-icon icon="mdi-clock-outline" class="mr-2" />
              <span>{{ session.time }} min</span>
            </div>
            <div class="d-flex align-center mr-4">
              <v-icon
                :icon="session.isPublic ? 'mdi-earth' : 'mdi-lock'"
                class="mr-2"
              />
              <span v-if="smAndUp">{{ session.isPublic ? "Public" : "Private" }}</span>
            </div>
            <v-btn
              color="primary"
              variant="elevated"
              :size="smAndUp ? 'large' : 'default'"
              :disabled="
                session.users.length >= session.maxUsers ||
                session.state.status !== 'WAITING'
              "
              @click.stop="joinSession(session.id)"
            >
              <v-icon left :class="{'mr-2': smAndUp}">mdi-play-circle-outline</v-icon>
              <span v-if="smAndUp">Join</span>
            </v-btn>
          </div>
        </div>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup>
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { useWebSocketStore } from "@/stores/websocket";
import { useAppStore } from "@/stores/app";

const { smAndUp } = useDisplay();
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
