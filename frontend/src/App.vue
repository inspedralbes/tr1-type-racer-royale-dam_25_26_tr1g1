<template>
  <div class="h-screen bg-gray-100">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useWebSocketStore } from "@/stores/websocket";
import { useAppStore } from "@/stores/app";
import { useUsersStore } from "@/stores/users";

const webSocketSotre = useWebSocketStore();
const appStore = useAppStore();
const usersStore = useUsersStore();

onMounted(() => {
  appStore.listenForStorageChanges();
  const wsURL = import.meta.env.VITE_WS_URL + '/ws';
  const userId = appStore.userId;
  if (userId) {
    usersStore.fetchUser(userId);
    webSocketSotre.connect(wsURL, userId);
  } else {
    webSocketSotre.connect(wsURL);
  }
});
</script>
