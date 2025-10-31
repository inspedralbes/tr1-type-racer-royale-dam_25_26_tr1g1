<template>
  <v-container>
    <h1>Sessions disponibles</h1>
    <v-row>
      <v-col v-for="session in sessions" :key="session.id" cols="12" md="4">
        <v-card>
                    <v-card-title>{{ session.workout }}</v-card-title>
                    <v-card-text>
                      <p>Jugadors: {{ session.users.length }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary">Unir-se</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useAppStore } from "@/stores/app";
import { useWebSocketStore } from "@/stores/websocket";

const appStore = useAppStore();
const websocketStore = useWebSocketStore();

const sessions = computed(() => appStore.sessions);

onMounted(() => {
  websocketStore.getSessions();
});
</script>
