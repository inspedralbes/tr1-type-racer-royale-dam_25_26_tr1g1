<template>
  <v-form @submit.prevent="submitForm">
    <v-text-field
      v-model="session.type"
      label="Tipus d'exercici"
      required
    ></v-text-field>
    <v-text-field
      v-model.number="session.time"
      label="Temps (minuts)"
      type="number"
      required
    ></v-text-field>
    <v-switch v-model="session.isPublic" label="Sessió pública"></v-switch>
    <v-text-field
      v-model.number="session.maxUsers"
      label="Màxim d'usuaris"
      type="number"
      required
    ></v-text-field>
    <v-btn type="submit" color="primary">Crear Sessió</v-btn>
  </v-form>
</template>

<script setup>
import { ref } from "vue";
import { useWebSocketStore } from "@/stores/websocket";

const websocketStore = useWebSocketStore();

const session = ref({
  type: "Full Body",
  time: 30,
  isPublic: true,
  maxUsers: 8,
});

const submitForm = () => {
  // Send a message via WebSocket to create the session.
  // The server will handle creation and broadcast the update to all clients.
  websocketStore.sendMessage({
    type: "CREATE_SESSION",
    payload: session.value,
  });
  console.log("CREATE_SESSION message sent with payload:", session.value);
};
</script>
