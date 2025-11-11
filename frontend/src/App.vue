<template>
  <div class="h-screen bg-gray-100">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useWebSocketStore } from "@/stores/websocket";
import { useAppStore } from "@/stores/app";

const webSocketSotre = useWebSocketStore();
const appStore = useAppStore();

onMounted(() => {
  const wsURL = import.meta.env.VITE_WS_URL + '/ws';
  const user = appStore.user;
  if (user) {
    webSocketSotre.connect(wsURL, user.id);
  } else {
    webSocketSotre.connect(wsURL);
  }
});
</script>
