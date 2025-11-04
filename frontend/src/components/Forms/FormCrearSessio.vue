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
    <v-text-field
      v-model="session.password"
      label="Contrasenya (deixar buit per a sessió pública)"
      type="password"
    ></v-text-field>
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
import { ref, defineEmits } from "vue";
import { useWebSocketStore } from "@/stores/websocket";

const emit = defineEmits(["session-created"]);

const websocketStore = useWebSocketStore();

const session = ref({
  type: "Full Body",
  time: 30,
  password: "", // Changed from isPublic
  maxUsers: 8,
});

const submitForm = () => {
  websocketStore.sendMessage({
    type: "CREATE_SESSION",
    payload: session.value,
  });
  console.log("CREATE_SESSION message sent with payload:", session.value);
  emit("session-created");
};
</script>