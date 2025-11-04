<template>
  <div class="relative min-h-screen bg-gray-900 text-white flex flex-col">
    <!-- PoseSkeleton (AI) -->
    <PoseSkeleton
      @features="onFeatures"
      class="absolute inset-0 w-full h-full object-cover z-0"
    />

    <!-- Overlay content -->
    <div class="relative z-10 flex flex-col flex-grow">
      <!-- 🔹 Top Bar -->
      <div
        class="w-full bg-gray-800 bg-opacity-70 p-4 shadow-lg flex justify-between items-center"
      >
        <h1 class="text-xl font-bold">Sessió: {{ currentSession?.type }}</h1>
        <div class="flex items-center space-x-4">
          <p class="text-3xl font-extrabold text-blue-400">
            {{ formattedTime }}
          </p>
          <button
            @click="toggleScoreboard"
            class="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            <i class="mdi mdi-trophy text-2xl"></i>
          </button>
        </div>
      </div>

      <!-- 🔹 Main content -->
      <div class="flex-grow flex justify-between items-start p-4">
        <!-- 🏆 Scoreboard -->
        <transition name="slide-fade">
          <div
            v-if="showScoreboard"
            class="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-4 w-72 max-h-full overflow-y-auto"
          >
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
        </transition>

        <!-- 🔹 Repetition Counter -->
        <div
          class="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-4 w-48 text-center"
        >
          <h2 class="text-xl font-semibold mb-2">Repeticions</h2>
          <p class="text-4xl font-bold text-blue-400">{{ repetitions }}</p>
        </div>
      </div>

      <!-- 🔹 Bottom Bar -->
      <div
        class="w-full bg-gray-800 bg-opacity-70 p-4 shadow-lg flex justify-center items-center"
      >
        <p class="text-lg text-gray-300">Controles de sessió aquí (futur)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, shallowRef } from "vue";
import { useRoute } from "vue-router";
import { useWebSocketStore } from "@/stores/websocket";
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
const showScoreboard = ref(true);

const toggleScoreboard = () => {
  showScoreboard.value = !showScoreboard.value;
};

const onFeatures = (payload) => {
  features.value =
    typeof structuredClone === "function"
      ? structuredClone(payload)
      : JSON.parse(JSON.stringify(payload));

  const score = 1;

  // 🔸 Repetition counting logic for Squats
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
    payload: { score },
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

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
