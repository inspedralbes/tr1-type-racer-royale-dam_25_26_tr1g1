<template>
  <div class="session-wrapper">
    <PoseSkeleton @features="onFeatures" class="pose-skeleton-background" />
    <v-container fluid class="overlay-content pa-4">
      <v-row class="justify-center">
        <v-col cols="12" md="auto">
          <div class="pa-2 text-center">
            <h1 class="text-h5 mb-2 text-white">
              Sessió: {{ currentSession?.type }}
            </h1>
            <p class="text-h4 font-weight-black text-white">
              {{ formattedTime }}
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <div class="scoreboard-wrapper">
      <v-card elevation="8" rounded="lg" color="rgba(0, 0, 0, 0.5)">
        <v-card-title
          class="text-h6 text-white py-2 d-flex justify-center align-center"
        >
          <v-icon left class="mr-2">mdi-trophy</v-icon>
          Marcador
        </v-card-title>
        <v-list dense bg-color="transparent">
          <v-list-item
            v-for="(participant, index) in sortedParticipants"
            :key="participant.id"
            class="py-1"
          >
            <template v-slot:prepend>
              <v-avatar
                size="32"
                :color="index === 0 ? 'amber' : 'grey-lighten-1'"
              >
                <v-icon v-if="index === 0" color="white" size="small"
                  >mdi-crown</v-icon
                >
                <v-icon v-else color="white" size="small"
                  >mdi-account-circle</v-icon
                >
              </v-avatar>
            </template>
            <v-list-item-content class="ml-2">
              <v-list-item-title
                class="font-weight-bold text-body-2 text-white"
                >{{ participant.username }}</v-list-item-title
              >
            </v-list-item-content>
            <template v-slot:append>
              <v-chip
                :color="index === 0 ? 'amber' : 'primary'"
                size="small"
                class="font-weight-bold"
              >
                {{ participant.puntos }}
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
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
.pose-skeleton-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.overlay-content {
  position: relative;
  z-index: 2;
  background: transparent;
}

.scoreboard-wrapper {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 3;
}
</style>
