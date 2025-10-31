<template>
  <v-container>
    <v-row>
      <v-col v-for="session in sessions" :key="session.id" cols="12" md="4">
        <v-card>
          <v-card-title>{{ session.id }}</v-card-title>
          <v-card-subtitle>Workout: {{ session.workout }}</v-card-subtitle>
          <v-card-text>
            <div>Users: {{ session.users.length }}</div>
            <div>State: {{ session.state }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary">Join</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useWebSocketStore } from "@/stores/websocket";

const webSocketStore = useWebSocketStore();
const { sessions } = storeToRefs(webSocketStore);

onMounted(() => {
  webSocketStore.getSessions();
});
</script>
