<template>
  <div
    class="relative min-h-screen bg-gray-900 text-white flex flex-col"
    @mousemove="handleUserInteraction"
    @touchstart="handleUserInteraction"
  >
    <!-- Session End Screen -->
    <SessionEndScreen
      v-if="showEndScreen"
      :sorted-participants="sortedParticipants"
      @exit-session="leaveSession"
    />

    <!-- AI Loading Overlay -->
    <LoadingScreen v-if="isAiLoading && !showEndScreen" />

    <!-- Countdown Timer -->
    <CountdownTimer
      v-if="showCountdown && !showEndScreen"
      @countdown-finished="handleCountdownFinished"
    />

    <!-- Floating Emojis -->
    <FloatingEmoji
      v-for="reaction in activeReactions"
      :key="reaction.id"
      :emoji="reaction.emoji"
      :id="reaction.id"
      @animation-end="onReactionAnimationEnd"
    />

    <!-- Floating Numbers -->
    <FloatingNumber
      v-for="num in floatingNumbers"
      :key="num.id"
      :id="num.id"
      :value="num.value"
      @animation-end="onFloatingNumberAnimationEnd"
    />

    <!-- PoseSkeleton -->
    <PoseSkeleton
      ref="poseSkeletonRef"
      :current-exercise="currentExercise"
      @rep="handleRep"
      @cameras="handleCameras"
      @in-pose="handleInPose"
      @loading-model="isAiLoading = true"
      @model-loaded="isAiLoading = false"
      class="absolute inset-0 w-full h-full object-cover z-0"
    />

    <!-- Overlay content -->
    <div
      v-if="!showEndScreen"
      class="relative z-10 flex flex-col flex-grow"
    >
      <SessionTopBar
        :current-session="currentSession"
        @toggle-info-exercices="toggleInfoExercices"
        @toggle-scoreboard="toggleScoreboard"
      />

      <div class="flex-grow flex justify-end items-start p-4">
        <div class="flex flex-col space-y-4">
          <SessionProgressInfo
            v-if="
              currentExercise &&
              currentSession.state.status !== 'WAITING' &&
              !showCountdown
            "
            :timer="timer"
            :is-resting="isResting"
            :current-timer-type="currentTimerType"
            :repetitions="repetitions"
            :current-serie="currentSerie"
            :total-series="totalSeries"
          />

          <transition name="slide-fade">
            <SessionExerciseInfo
              v-if="
                showInfoExercices &&
                currentExercise &&
                currentSession.state.status !== 'WAITING' &&
                !showCountdown
              "
              :current-exercise="currentExercise"
            />
          </transition>

          <transition name="slide-fade">
            <SessionScoreboard
              v-if="
                showScoreboard &&
                currentSession.state.status !== 'WAITING' &&
                !showCountdown
              "
              :sorted-participants="sortedParticipants"
            />
          </transition>
        </div>
      </div>

      <!-- Bottom bar -->
      <transition name="slide-up">
        <SessionBottomBar
          v-if="showBottomBar"
          :cameras="cameras"
          @leave-session="leaveSession"
          @camera-selected="handleCameraSelected"
          @send-reaction="sendReaction"
        />
      </transition>

      <!-- Ready Card -->
      <div
        v-if="currentSession && currentSession.state.status === 'WAITING'"
        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <ReadyCard :users="currentSession.users" @ready="setReady" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useAppStore } from "@/stores/app";
import { useWebSocketStore } from "@/stores/websocket";
import { useRoute, useRouter } from "vue-router";
import PoseSkeleton from "@/components/Ai/PoseSkeleton.vue";
import FloatingEmoji from "@/components/FloatingEmoji.vue";
import FloatingNumber from "@/components/FloatingNumber.vue";
import LoadingScreen from "@/components/Ai/LoadingScreen.vue";
import CountdownTimer from "@/components/session/CountdownTimer.vue";
import SessionEndScreen from "@/components/session/SessionEndScreen.vue";

import SessionTopBar from "@/components/session/SessionTopBar.vue";
import SessionExerciseInfo from "@/components/session/SessionExerciseInfo.vue";
import SessionScoreboard from "@/components/session/SessionScoreboard.vue";
import SessionBottomBar from "@/components/session/SessionBottomBar.vue";
import SessionProgressInfo from "@/components/session/SessionProgressInfo.vue";
import ReadyCard from "@/components/session/ReadyCard.vue";

const appStore = useAppStore();
const websocketStore = useWebSocketStore();
const router = useRouter();
const route = useRoute();

const isAiLoading = ref(true);
const showCountdown = ref(false);
const showEndScreen = ref(false);
const currentSession = computed(() => appStore.currentSession);

const repetitions = computed(
  () => appStore.currentSession?.state.repetitions || 0
);

const currentSerie = computed(
  () => appStore.currentSession?.state.currentSeries || 1
);
const totalSeries = computed(() => currentExercise.value?.series);

const currentExerciseIndex = computed(
  () => appStore.currentSession?.state.currentExercise || 0
);
const currentExercise = computed(
  () => currentSession.value?.exercicis[currentExerciseIndex.value]
);

const timer = computed(() => appStore.currentSession?.state.timer || 0);
const isResting = computed(
  () => appStore.currentSession?.state.isResting || false
);
const currentTimerType = computed(() =>
  isResting.value ? "descans" : "exercici"
);

const handleRep = () => {
  if (currentSession.value.state.status === "IN_PROGRESS") {
    websocketStore.sendMessage({
      type: "UPDATE_SCORE",
    });
  }
};

const setReady = () => {
  websocketStore.sendMessage({ type: "SET_READY" });
};

const handleInPose = () => {
  // Logic for when the user is in pose
};

const leaveSession = () => {
  if (currentSession.value) {
    websocketStore.sendMessage({
      type: "LEAVE_SESSION",
      payload: { sessionId: currentSession.value.id },
    });
    router.push("/sessions");
  }
};

onMounted(() => {
  const sessionId = route.params.id;
  if (sessionId) {
    const currentUser = appStore.user;
    const sessionUsers = currentSession.value?.users;

    let shouldJoin = true;

    if (currentUser && sessionUsers) {
      const isUserInSession = sessionUsers.some(
        (user) => user.id === currentUser.id
      );
      if (isUserInSession) {
        shouldJoin = false;
      }
    }

    if (shouldJoin) {
      websocketStore.sendMessage({
        type: "JOIN_SESSION",
        payload: { sessionId },
      });
    }
  }
});

onUnmounted(() => {});

const showScoreboard = ref(true);
const showInfoExercices = ref(true);
const showBottomBar = ref(false);

const poseSkeletonRef = ref(null);
const cameras = ref([]);
let bottomBarTimeout = null;

const handleCameras = (cameraList) => {
  cameras.value = cameraList;
};
const handleCameraSelected = (deviceId) => {
  poseSkeletonRef.value.startCamera(deviceId);
};

const handleUserInteraction = (event) => {
  if (showEndScreen.value) return;
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
      }, 10000);
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

// Emoji Reactions
const activeReactions = ref([]);
watch(
  () => websocketStore.latestReaction,
  (newReaction) => {
    if (newReaction) {
      activeReactions.value.push(newReaction);
    }
  }
);

const sendReaction = (emoji) => {
  websocketStore.sendMessage({
    type: "SEND_EMOJI_REACTION",
    payload: { emoji },
  });
};

const onReactionAnimationEnd = (id) => {
  activeReactions.value = activeReactions.value.filter(
    (reaction) => reaction.id !== id
  );
};

// Floating Numbers
const floatingNumbers = ref([]);
const onFloatingNumberAnimationEnd = (id) => {
  floatingNumbers.value = floatingNumbers.value.filter((num) => num.id !== id);
};

const currentUserScore = computed(() => {
  const user = currentSession.value?.users.find(
    (u) => u.id === appStore.user.id
  );
  return user ? user.puntos : 0;
});

watch(currentUserScore, (newScore, oldScore) => {
  if (newScore > oldScore) {
    const scoreDiff = newScore - oldScore;
    floatingNumbers.value.push({
      id: Date.now(),
      value: `+${scoreDiff}`,
    });
  }
});

const handleCountdownFinished = () => {
  showCountdown.value = false;
};

watch(
  () => currentSession.value?.state.status,
  (newStatus, oldStatus) => {
    if (oldStatus === "WAITING" && newStatus === "IN_PROGRESS") {
      showCountdown.value = true;
    }
    if (newStatus === "FINISHED") {
      showEndScreen.value = true;
    }
  }
);
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

/* Classic Spinner CSS */
.loader {
  border-top-color: #3498db; /* Blue color for the spinner */
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
