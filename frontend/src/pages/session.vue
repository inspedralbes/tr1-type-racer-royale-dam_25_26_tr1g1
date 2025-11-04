<template>
  <div class="relative min-h-screen bg-gray-900 text-white">
    <PoseSkeleton
      @features="onFeatures"
      class="absolute inset-0 w-full h-full object-cover z-0"
    />

    <div
      class="relative z-10 p-4 flex flex-col items-center justify-start h-full"
    >
      <!-- Session Info and Timer -->
      <div
        class="text-center mb-8 bg-gray-800 bg-opacity-70 rounded-lg p-4 shadow-lg"
      >
        <h1 class="text-3xl font-bold mb-2">
          Sessió: {{ currentSession?.type }}
        </h1>
        <p class="text-5xl font-extrabold text-blue-400">{{ formattedTime }}</p>
      </div>

      <!-- Scoreboard -->
      <div class="absolute top-4 right-4 z-20">
        <div class="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-4 w-72">
          <h2
            class="text-xl font-semibold mb-4 flex items-center justify-center"
          >
            <span class="mdi mdi-trophy text-amber-400 text-2xl mr-2"></span>
            Marcador
          </h2>
          <ul class="space-y-2">
            <li
              v-for="(participant, index) in sortedParticipants"
              :key="participant.id"
              class="flex items-center py-1 px-2 rounded-md"
              :class="{
                'bg-gray-700': index % 2 === 0,
                'bg-gray-600': index % 2 !== 0,
              }"
            >
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                :class="index === 0 ? 'bg-amber-400' : 'bg-gray-400'"
              >
                <span
                  v-if="index === 0"
                  class="mdi mdi-crown text-white text-lg"
                ></span>
                <span
                  v-else
                  class="mdi mdi-account-circle text-white text-lg"
                ></span>
              </div>
              <span class="font-medium text-sm flex-grow">{{
                participant.username
              }}</span>
              <span
                class="px-3 py-1 rounded-full text-xs font-bold"
                :class="
                  index === 0
                    ? 'bg-amber-400 text-gray-900'
                    : 'bg-blue-500 text-white'
                "
              >
                {{ participant.puntos }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Repetition Counter -->
      <div class="absolute bottom-4 left-4 z-20">
        <div
          class="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-4 w-48 text-center"
        >
          <h2 class="text-xl font-semibold mb-2">Repeticions</h2>
          <p class="text-4xl font-bold text-blue-400">{{ repetitions }}</p>
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
import { calculateAngle, KEYPOINTS } from "@/components/Ai/analysis.js";

import PoseSkeleton from "@/components/Ai/PoseSkeleton.vue";

const route = useRoute();
const websocketStore = useWebSocketStore();

const currentSession = computed(() => websocketStore.currentSession);

const features = shallowRef(null);
const repetitions = ref(0);
const exerciseState = ref("up"); // 'up' or 'down'

const timeElapsed = ref(0);
let timerInterval = null;

const onFeatures = (payload) => {
  features.value =
    typeof structuredClone === "function"
      ? structuredClone(payload)
      : JSON.parse(JSON.stringify(payload));

  const score = 1;

  // Repetition counting logic for Squats
  if (currentSession.value?.type === "Squats") {
    const keypoints = features.value?.keypoints;
    if (keypoints) {
      const leftHip = keypoints[KEYPOINTS.left_hip];
      const leftKnee = keypoints[KEYPOINTS.left_knee];
      const leftAnkle = keypoints[KEYPOINTS.left_ankle];

      const rightHip = keypoints[KEYPOINTS.right_hip];
      const rightKnee = keypoints[KEYPOINTS.right_knee];
      const rightAnkle = keypoints[KEYPOINTS.right_ankle];

      if (
        leftHip &&
        leftKnee &&
        leftAnkle &&
        rightHip &&
        rightKnee &&
        rightAnkle
      ) {
        const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
        const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

        // Use the average of both knees for more robust detection
        const kneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

        if (exerciseState.value === "up" && kneeAngle < 100) {
          exerciseState.value = "down";
        } else if (exerciseState.value === "down" && kneeAngle > 160) {
          exerciseState.value = "up";
          repetitions.value++;
        }
      }
    }
  }

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
