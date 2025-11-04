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
  const user = appStore.user;
  if (user) {
    webSocketSotre.connect("ws://localhost:5000", user.id);
  } else {
    webSocketSotre.connect("ws://localhost:5000");
  }
});
</script>
