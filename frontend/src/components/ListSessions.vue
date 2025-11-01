<template>
  <v-container>
    <v-row class="">
      <v-col cols="12">
        <v-text-field
          label="Filter sessions"
          variant="outlined"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="session in sessions" :key="session.id" cols="12">
        <v-card>
          <v-card-title>{{ session.id }}</v-card-title>
          <v-card-subtitle>Workout: {{ session.workout }}</v-card-subtitle>
          <v-card-text>
            <div>Users: {{ session.users.length }}</div>
            <div>State: {{ session.state }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="joinSession(session.id)">Join</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useWebSocketStore } from "@/stores/websocket";
import { useAppStore } from "@/stores/app";
import { useRouter } from "vue-router";

const webSocketStore = useWebSocketStore();
const appStore = useAppStore();
const { sessions, currentSessionId } = storeToRefs(webSocketStore);
const router = useRouter();

const joinSession = (sessionId) => {
  if (appStore.user && appStore.user.id) {
    webSocketStore.joinSession(sessionId, appStore.user.id);
  } else {
    console.error("User not authenticated. Cannot join session.");
  }
};

watch(currentSessionId, (newSessionId) => {
  if (newSessionId) {
    router.push(`/game/${newSessionId}`);
  }
});

onMounted(() => {
  webSocketStore.getSessions();
});
</script>
