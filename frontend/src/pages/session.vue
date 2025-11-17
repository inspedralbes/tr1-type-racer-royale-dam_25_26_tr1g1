<template>
  <div class="relative min-h-screen bg-gray-900 text-white flex flex-col">
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

    <!-- Floating Items -->
    <FloatingItem
      v-for="item in floatingItems"
      :key="item.id"
      :id="item.id"
      :content="item.content"
      :size="item.size"
      :color="item.color"
      :duration="item.duration"
      :translateY="item.translateY"
      @animation-end="onFloatingItemAnimationEnd"
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
    <div v-if="!showEndScreen && !isAiLoading" class="relative z-10 flex flex-col flex-grow">
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
      <SessionBottomBar
        :cameras="cameras"
        @leave-session="leaveSession"
        @send-reaction="sendReaction"
        @camera-selected="handleCameraSelected"
        @toggle-info="toggleInfo"
      />

      <!-- Ready Card -->
      <div
        v-if="currentSession && currentSession.state.status === 'WAITING'"
        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <ReadyCard :users="participantsWithDetails" @ready="setReady" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useAppStore } from "@/stores/app";
import { useWebSocketStore } from "@/stores/websocket";
import { useUsersStore } from "@/stores/users";
import { useRoute, useRouter } from "vue-router";
import PoseSkeleton from "@/components/Ai/PoseSkeleton.vue";
import FloatingItem from "@/components/FloatingItem.vue";
import LoadingScreen from "@/components/Ai/LoadingScreen.vue";
import CountdownTimer from "@/components/session/CountdownTimer.vue";
import SessionEndScreen from "@/components/session/SessionEndScreen.vue";
import SessionBottomBar from "@/components/session/SessionBottomBar.vue";

import SessionExerciseInfo from "@/components/session/SessionExerciseInfo.vue";
import SessionScoreboard from "@/components/session/SessionScoreboard.vue";
import SessionProgressInfo from "@/components/session/ProgressInfo.vue";
import ReadyCard from "@/components/session/ReadyCard.vue";

const appStore = useAppStore();
const websocketStore = useWebSocketStore();
const usersStore = useUsersStore();
const router = useRouter();
const route = useRoute();

const isAiLoading = ref(true);
const showCountdown = ref(false);
const showEndScreen = ref(false);
const currentSession = computed(() => appStore.currentSession);

const repetitions = computed(() => {
  if (!appStore.currentSession || !appStore.userId) return 0;
  const currentUser = appStore.currentSession.users.find(
    (u) => u.userId === appStore.userId
  );
  if (!currentUser) return 0;
  // POINTS_PER_REP is 10
  return Math.floor(currentUser.puntos / 10);
});

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
  if (currentSession.value?.state.status === "FINISHED") {
    router.push("/sessions");
    return;
  }

  if (currentSession.value) {
    websocketStore.sendMessage({
      type: "LEAVE_SESSION",
      payload: { sessionId: currentSession.value.id },
    });
    router.push("/sessions");
  } else {
    router.push("/sessions");
  }
};

onMounted(() => {
  const sessionId = route.params.id;
  if (sessionId) {
    websocketStore.sendMessage({
      type: "JOIN_SESSION",
      payload: { sessionId },
    });
  }
});

onUnmounted(() => {
  if (currentSession.value) {
    websocketStore.sendMessage({
      type: "LEAVE_SESSION",
      payload: { sessionId: currentSession.value.id },
    });
  }
});

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

const toggleInfo = () => {
  showScoreboard.value = !showScoreboard.value;
  showInfoExercices.value = !showInfoExercices.value;
};

const participantsWithDetails = computed(() => {
  if (!currentSession.value || !currentSession.value.users) return [];
  return currentSession.value.users.map((user) => {
    const details = usersStore.getUser(user.userId);
    return {
      ...user,
      username: details?.username || "...",
      foto_perfil: details?.foto_perfil || "",
    };
  });
});

const sortedParticipants = computed(() => {
  return [...participantsWithDetails.value].sort((a, b) => b.puntos - a.puntos);
});

watch(
  () => currentSession.value?.users,
  (newUsers) => {
    if (newUsers) {
      newUsers.forEach((user) => {
        usersStore.fetchUser(user.userId);
      });
    }
  },
  { deep: true, immediate: true }
);


const floatingItems = ref([]);

watch(
  () => currentSession.value?.latestReaction,
  (newReaction) => {
    if (newReaction) {
      floatingItems.value.push({
        id: newReaction.id,
        content: newReaction.emoji,
        size: "3rem",
        color: "white",
        duration: "2s",
        translateY: "-150px",
      });
    }
  }
);

const sendReaction = (emoji) => {
  websocketStore.sendMessage({
    type: "SEND_EMOJI_REACTION",
    payload: { emoji },
  });
};

const onFloatingItemAnimationEnd = (id) => {
  floatingItems.value = floatingItems.value.filter((item) => item.id !== id);
};

const currentUserScore = computed(() => {
  const user = currentSession.value?.users.find(
    (u) => u.userId === appStore.userId
  );
  return user ? user.puntos : 0;
});

watch(currentUserScore, (newScore, oldScore) => {
  if (newScore > oldScore) {
    const scoreDiff = newScore - oldScore;
    floatingItems.value.push({
      id: Date.now(),
      content: `+${scoreDiff}`,
      size: "2.5rem",
      color: "#ffc107",
      duration: "1.5s",
      translateY: "-120px",
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

