<template>
  <div class="relative min-h-screen bg-gray-900 text-white">
    <PoseSkeleton @features="onFeatures" class="absolute inset-0 w-full h-full object-cover z-0" />

    <div class="relative z-10 p-4 flex flex-col items-center justify-start h-full">
      <!-- Session Info and Timer -->
      <div class="text-center mb-8 bg-gray-800 bg-opacity-70 rounded-lg p-4 shadow-lg">
        <h1 class="text-3xl font-bold mb-2">Sessió: {{ currentSession?.type }}</h1>
        <p class="text-5xl font-extrabold text-blue-400">{{ formattedTime }}</p>
      </div>

      <!-- Scoreboard -->
      <div class="absolute top-4 right-4 z-20">
        <div class="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-4 w-72">
          <h2 class="text-xl font-semibold mb-4 flex items-center justify-center">
            <span class="mdi mdi-trophy text-amber-400 text-2xl mr-2"></span>
            Marcador
          </h2>
          <ul class="space-y-2">
            <li
              v-for="(participant, index) in sortedParticipants"
              :key="participant.id"
              class="flex items-center py-1 px-2 rounded-md"
              :class="{ 'bg-gray-700': index % 2 === 0, 'bg-gray-600': index % 2 !== 0 }"
            >
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                :class="index === 0 ? 'bg-amber-400' : 'bg-gray-400'"
              >
                <span v-if="index === 0" class="mdi mdi-crown text-white text-lg"></span>
                <span v-else class="mdi mdi-account-circle text-white text-lg"></span>
              </div>
              <span class="font-medium text-sm flex-grow">{{ participant.username }}</span>
              <span
                class="px-3 py-1 rounded-full text-xs font-bold"
                :class="index === 0 ? 'bg-amber-400 text-gray-900' : 'bg-blue-500 text-white'"
              >
                {{ participant.puntos }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useWebSocketStore } from "@/stores/websocket";
import { shallowRef } from "vue";

import PoseSkeleton from "@/components/Ai/PoseSkeleton.vue";

const route = useRoute();
const websocketStore = useWebSocketStore();

const currentSession = computed(() => websocketStore.currentSession);

const features = shallowRef(null);

const timeElapsed = ref(0);
let timerInterval = null;

const onFeatures = (payload) => {
  features.value =
    typeof structuredClone === "function"
      ? structuredClone(payload)
      : JSON.parse(JSON.stringify(payload));

  const score = 1;

  websocketStore.sendMessage({
    type: "UPDATE_SCORE",
    payload: { score: score },
  });
};

const sortedParticipants = computed(() => {
  if (!currentSession.value || !currentSession.value.users) return [];
  return [...currentSession.value.users].sort((a, b) => b.puntos - a.puntos);
});

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
