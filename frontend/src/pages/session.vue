<template>
  <div>
    <h1>Session {{ sessionId }}</h1>
    <div v-if="currentSession">
      <h2>Time Elapsed: {{ formattedTime }}</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useWebSocketStore } from "@/stores/websocket";

const route = useRoute();
const websocketStore = useWebSocketStore();

const sessionId = route.params.id;
const currentSession = computed(() => websocketStore.currentSession);

const timeElapsed = ref(0);
let timerInterval = null;

const formattedTime = computed(() => {
  const minutes = Math.floor(timeElapsed.value / 60);
  const seconds = timeElapsed.value % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
});

onMounted(() => {
  if (currentSession.value && currentSession.value.state.startTime) {
    timerInterval = setInterval(() => {
      const now = Date.now();
      const startTime = currentSession.value.state.startTime;
      timeElapsed.value = Math.floor((now - startTime) / 1000);
    }, 1000);
  }
});

onUnmounted(() => {
  clearInterval(timerInterval);
  if (currentSession.value) {
    websocketStore.sendMessage({
      type: "LEAVE_SESSION",
      payload: { sessionId: currentSession.value.id },
    });
    websocketStore.setCurrentSession(null);
  }
});
</script>
