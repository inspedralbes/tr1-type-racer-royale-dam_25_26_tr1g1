<template>
  <v-container>
    <NavBar />
    <h1 class="text-h4 mb-4">Session: {{ currentSession?.id }}</h1>
    <v-card v-if="currentSession">
      <v-card-title>Workout: {{ currentSession.workout }}</v-card-title>
      <v-card-text>
        <h2 class="text-h6">Participants:</h2>
        <v-list>
          <v-list-item v-for="userId in currentSession.users" :key="userId">
            <v-list-item-title>{{ userId }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    <v-alert v-else type="info" class="mt-4"
      >No session data available.</v-alert
    >
  </v-container>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useWebSocketStore } from "@/stores/websocket";
import NavBar from "@/components/NavBar.vue";

const route = useRoute();
const webSocketStore = useWebSocketStore();
const { currentSession, currentSessionId } = storeToRefs(webSocketStore);

// If the user navigates directly to /game/:sessionId, we might not have currentSession set.
// In a real app, you'd send a websocket message to request session details.
onMounted(() => {
  if (!currentSession.value && route.params.sessionId) {
    // TODO: Implement a websocket message to request session details by ID
    console.warn(
      "Session data not found in store. Implement a way to fetch it."
    );
  }
});

// Watch for changes in currentSessionId to ensure the component reacts if the session changes
watch(currentSessionId, (newId) => {
  if (newId && newId !== route.params.sessionId) {
    // This case might happen if a user joins a different session while on this page
    // In a real app, you might want to navigate or update the session data.
    console.warn("Navigated to a different session.");
  }
});
</script>
