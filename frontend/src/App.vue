<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
import { onMounted } from "vue";
import { useWebSocketStore } from "@/stores/websocket";

const wsStore = useWebSocketStore();

onMounted(() => {
  wsStore.connect("ws://localhost:5000");
});
</script>
