<template>
  <div
    class="relative min-h-screen bg-gray-900 text-white flex flex-col"
    @mousemove="handleUserInteraction"
    @touchstart="handleUserInteraction"
  >
    <!-- PoseSkeleton (AI) -->
    <!-- PoseSkeleton (AI) -->
    <PoseSkeleton
      ref="poseSkeletonRef"
      :current-exercise="currentExercise"
      @rep="appStore.incrementRepetitions()"
      @cameras="handleCameras"
      @in-pose="handleInPose"
      class="absolute inset-0 w-full h-full object-cover z-0"
    />

    <!-- Overlay content -->
    <div class="relative z-10 flex flex-col flex-grow">
      <!-- 🔹 Top Bar -->
      <SessionTopBar
        :current-session="currentSession"
        :current-exercise="currentExercise"
        :exercise-time="exerciseTime"
        @toggle-info-exercices="toggleInfoExercices"
        @toggle-scoreboard="toggleScoreboard"
      />

      <!-- 🔹 Main content -->
      <div class="flex-grow flex justify-end items-start p-4">
        <div class="flex flex-col space-y-4">
          <SessionInfo :current-exercise="currentExercise" />

          <transition name="slide-fade">
            <SessionExerciseInfo
              v-if="showInfoExercices"
              :current-exercise="currentExercise"
            />
          </transition>

          <transition name="slide-fade">
            <SessionScoreboard
              v-if="showScoreboard"
              :sorted-participants="sortedParticipants"
            />
          </transition>
        </div>
      </div>

      <transition name="slide-up">
        <SessionBottomBar
          v-if="showBottomBar"
          :cameras="cameras"
          @leave-session="leaveSession"
          @camera-selected="handleCameraSelected"
        />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useAppStore } from "@/stores/app";
import { calculateAngle, KEYPOINTS } from "@/components/Ai/analysis.js";
import PoseSkeleton from "@/components/Ai/PoseSkeleton.vue";

import SessionTopBar from "@/components/session/SessionTopBar.vue";
import SessionExerciseInfo from "@/components/session/SessionExerciseInfo.vue";
import SessionInfo from "@/components/session/SessionInfo.vue";
import SessionScoreboard from "@/components/session/SessionScoreboard.vue";
import SessionBottomBar from "@/components/session/SessionBottomBar.vue";

const route = useRoute();
const appStore = useAppStore();

const currentSession = computed(() => appStore.currentSession);
const repetitions = computed(
  () => appStore.currentSession?.state.repetitions || 0
);
const currentSerie = computed(
  () => appStore.currentSession?.state.currentSeries || 1
);

const exerciseState = ref("up"); // 'up' or 'down'
const exerciseTime = ref(0);

const showScoreboard = ref(true);
const showInfoExercices = ref(true);

const poseSkeletonRef = ref(null);
const cameras = ref([]);

const handleCameras = (cameraList) => {
  cameras.value = cameraList;
};
const handleCameraSelected = (deviceId) => {
  poseSkeletonRef.value.startCamera(deviceId);
};

const showBottomBar = ref(false);
let bottomBarTimeout = null;

const handleUserInteraction = (event) => {
  const isTouch = event.type === "touchstart";
  const isMouseAtBottom = !isTouch && event.clientY > window.innerHeight - 150;

  if (isTouch) {
    showBottomBar.value = !showBottomBar.value;
    if (bottomBarTimeout) {
      clearTimeout(bottomBarTimeout);
    }
    if (showBottomBar.value) {
      bottomBarTimeout = setTimeout(() => {
        showBottomBar.value = false;
      }, 10000); // 10 seconds timeout for mobile
    }
  } else if (isMouseAtBottom) {
    showBottomBar.value = true;
    if (bottomBarTimeout) {
      clearTimeout(bottomBarTimeout);
    }
    bottomBarTimeout = setTimeout(() => {
      showBottomBar.value = false;
    }, 3000);
  } else if (!isTouch) {
    if (showBottomBar.value) {
      clearTimeout(bottomBarTimeout);
      bottomBarTimeout = setTimeout(() => {
        showBottomBar.value = false;
      }, 500);
    }
  }
};

const exercises = computed(() => currentSession.value?.exercicis || []);
const currentExerciseIndex = computed(
  () => currentSession.value?.state.currentExerciseIndex || 0
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

const sortedParticipants = computed(() => {
  if (!currentSession.value || !currentSession.value.users) return [];
  return [...currentSession.value.users].sort((a, b) => b.puntos - a.puntos);
});

const currentExercise = computed(() => {
  if (currentExerciseIndex.value < exercises.value.length) {
    return exercises.value[currentExerciseIndex.value];
  }
  return null;
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

.bottom-bar {
  transform: translateX(-50%);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%) translateX(-50%);
}
</style>
