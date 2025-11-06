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
          <div v-if="currentExercise?.duration_seconds" class="text-center">
            <p class="text-xs text-gray-400">Temps restant</p>
            <p class="text-3xl font-bold text-amber-400">{{ exerciseTime }}</p>
          </div>
          <div class="text-center">
            <p class="text-xs text-gray-400">Temps total</p>
            <p class="text-3xl font-extrabold text-blue-400">
              {{ formattedTime }}
            </p>
          </div>
          <button
            @click="toggleInfoExercices"
            class="p-2 rounded-full bg-blue-500 text-white self-center"
          >
            <i class="mdi mdi-gymnastics text-2xl"></i>
          </button>
          <button
            @click="toggleScoreboard"
            class="p-2 rounded-full bg-blue-500 text-white self-center"
          >
            <i class="mdi mdi-trophy text-2xl"></i>
          </button>
        </div>
      </div>

      <!-- 🔹 Main content -->
      <div class="flex-grow flex justify-end items-start p-4">
        <div class="flex flex-col space-y-4">
          <!-- 🔹 Current Exercise & Reps/Time -->
          <transition name="slide-fade">
            <div
              v-if="showInfoExercices"
              class="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-4 w-72 text-center"
            >
              <h2 class="text-xl font-semibold mb-2">Exercici Actual</h2>
              <p class="text-2xl font-bold text-amber-400">
                {{ currentExercise?.name }}
              </p>
              <p class="text-sm text-gray-300 mt-2">
                {{ currentExercise?.description }}
              </p>
            </div>
          </transition>

          <div
            class="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-4 w-72 text-center"
          >
            <h2 class="text-xl font-semibold mb-2">Repeticions</h2>
            <p class="text-4xl font-bold text-blue-400">
              {{ repetitions }}
            </p>
            <div class="mt-2">
              <p class="text-lg font-semibold text-gray-300">
                Sèrie: {{ currentSerie }} / {{ numberOfSeries }}
              </p>
            </div>
          </div>

          <!-- 🏆 Scoreboard -->
          <transition name="slide-fade">
            <div
              v-if="showScoreboard"
              class="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-4 w-72 max-h-full overflow-y-auto"
            >
              <h2
                class="text-xl font-semibold mb-4 flex items-center justify-center"
              >
                <span
                  class="mdi mdi-trophy text-amber-400 text-2xl mr-2"
                ></span>
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
                    class="w-8 h-8 rounded-full flex items-center justify-center mr-3 overflow-hidden"
                    :class="index === 0 ? 'bg-amber-400' : 'bg-gray-400'"
                  >
                    <img
                      v-if="participant.foto_perfil"
                      :src="participant.foto_perfil"
                      alt="Avatar"
                      class="w-full h-full object-cover"
                    />
                    <span
                      v-else
                      class="mdi mdi-crown text-white text-lg"
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
import { ref, onMounted, onUnmounted, computed, shallowRef, watch } from "vue";
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
const exerciseTime = ref(0);

const timeElapsed = ref(0);
let timerInterval = null;

const showScoreboard = ref(true);
const showInfoExercices = ref(true);

const exercises = computed(() => currentSession.value?.exercicis || []);
const currentExerciseIndex = computed(
  () => currentSession.value?.state.currentExerciseIndex || 0
);
const currentSerie = computed(
  () => currentSession.value?.state.currentSeries || 1
);

const numberOfSeries = computed(() => {
  if (!currentSession.value) return 1;
  switch (currentSession.value.duration) {
    case "Ràpida":
      return 2;
    case "Intermitja":
      return 3;
    case "Extensa":
      return 4;
    default:
      return 1;
  }
});

const toggleScoreboard = () => {
  showScoreboard.value = !showScoreboard.value;
};

const toggleInfoExercices = () => {
  showInfoExercices.value = !showInfoExercices.value;
};

const onFeatures = (payload) => {
  features.value =
    typeof structuredClone === "function"
      ? structuredClone(payload)
      : JSON.parse(JSON.stringify(payload));

  const score = 1;
  const keypoints = features.value?.keypoints;

  if (keypoints && currentExercise.value) {
    let kneeAngle, elbowAngle, hipAngle;

    const leftHip = keypoints[KEYPOINTS.left_hip];
    const leftKnee = keypoints[KEYPOINTS.left_knee];
    const leftAnkle = keypoints[KEYPOINTS.left_ankle];
    const rightHip = keypoints[KEYPOINTS.right_hip];
    const rightKnee = keypoints[KEYPOINTS.right_knee];
    const rightAnkle = keypoints[KEYPOINTS.right_ankle];
    const leftShoulder = keypoints[KEYPOINTS.left_shoulder];
    const leftElbow = keypoints[KEYPOINTS.left_elbow];
    const leftWrist = keypoints[KEYPOINTS.left_wrist];
    const rightShoulder = keypoints[KEYPOINTS.right_shoulder];
    const rightElbow = keypoints[KEYPOINTS.right_elbow];
    const rightWrist = keypoints[KEYPOINTS.right_wrist];

    switch (currentExercise.value.name) {
      case "Squats":
      case "Lunges":
        if (
          leftHip &&
          leftKnee &&
          leftAnkle &&
          rightHip &&
          rightKnee &&
          rightAnkle
        ) {
          const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
          const rightKneeAngle = calculateAngle(
            rightHip,
            rightKnee,
            rightAnkle
          );
          kneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

          if (exerciseState.value === "up" && kneeAngle < 100) {
            exerciseState.value = "down";
          } else if (exerciseState.value === "down" && kneeAngle > 160) {
            exerciseState.value = "up";
            repetitions.value++;
          }
        }
        break;

      case "Push-ups":
      case "Triceps Dips":
      case "Wall Push-ups":
      case "Burpees": // Burpees also have a push-up like movement
        if (
          leftShoulder &&
          leftElbow &&
          leftWrist &&
          rightShoulder &&
          rightElbow &&
          rightWrist
        ) {
          const leftElbowAngle = calculateAngle(
            leftShoulder,
            leftElbow,
            leftWrist
          );
          const rightElbowAngle = calculateAngle(
            rightShoulder,
            rightElbow,
            rightWrist
          );
          elbowAngle = (leftElbowAngle + rightElbowAngle) / 2;

          if (exerciseState.value === "up" && elbowAngle < 100) {
            exerciseState.value = "down";
          } else if (exerciseState.value === "down" && elbowAngle > 160) {
            exerciseState.value = "up";
            repetitions.value++;
          }
        }
        break;

      case "Plank Shoulder Taps":
        // This is more complex, maybe just count taps based on hand position?
        // For now, let's just increment repetitions as a placeholder.
        repetitions.value++;
        break;

      case "Calf Raises":
        // Needs a way to detect heel lifting. Maybe check ankle y position relative to toes?
        // Placeholder
        repetitions.value++;
        break;

      case "Side Leg Raises":
        if (leftHip && leftKnee && leftAnkle) {
          hipAngle = calculateAngle(
            leftKnee,
            leftHip,
            keypoints[KEYPOINTS.right_hip]
          ); // Angle between legs
          if (exerciseState.value === "down" && hipAngle > 30) {
            exerciseState.value = "up";
          } else if (exerciseState.value === "up" && hipAngle < 10) {
            exerciseState.value = "down";
            repetitions.value++;
          }
        }
        break;

      case "Glute Bridge":
        if (leftShoulder && leftHip && leftKnee) {
          hipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
          if (exerciseState.value === "down" && hipAngle > 160) {
            exerciseState.value = "up";
          } else if (exerciseState.value === "up" && hipAngle < 120) {
            exerciseState.value = "down";
            repetitions.value++;
          }
        }
        break;
    }

    if (
      currentExercise.value.repetitions &&
      repetitions.value >= currentExercise.value.repetitions
    ) {
      handleExerciseCompletion();
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

const currentExercise = computed(() => {
  if (currentExerciseIndex.value < exercises.value.length) {
    return exercises.value[currentExerciseIndex.value];
  }
  return null;
});

const handleExerciseCompletion = () => {
  websocketStore.sendMessage({
    type: "NEXT_EXERCISE",
  });
};

watch(currentExercise, (newExercise) => {
  repetitions.value = 0;
  exerciseState.value = "up";
  if (newExercise?.duration_seconds) {
    exerciseTime.value = newExercise.duration_seconds;
  } else {
    exerciseTime.value = 0;
  }
}, { immediate: true });

watch(
  currentSession,
  (newSession) => {
    if (newSession && newSession.state.startTime) {
      if (!timerInterval) {
        timerInterval = setInterval(() => {
          const now = Date.now();
          const startTime = newSession.state.startTime;
          timeElapsed.value = Math.floor((now - startTime) / 1000);

          if (
            currentExercise.value?.duration_seconds &&
            exerciseTime.value > 0
          ) {
            exerciseTime.value--;
            if (exerciseTime.value === 0) {
              handleExerciseCompletion();
            }
          }
        }, 1000);
      }
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  },
  { immediate: true, deep: true }
);

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
  transform: translateX(-20px);
  opacity: 0;
}
</style>
