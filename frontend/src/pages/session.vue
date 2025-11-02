<template>
  <v-container fluid class="pa-4 bg-gradient-primary fill-height">
    <v-row class="justify-center align-center">
      <v-col cols="12" md="8">
        <v-card class="pa-6 mb-6 text-center" elevation="8" rounded="lg">
          <h1 class="text-h3 mb-4 text-primary">
            Sessió: {{ currentSession?.type }}
          </h1>
          <v-divider class="my-4"></v-divider>
          <div v-if="currentSession" class="mb-4">
            <h2 class="text-h4 font-weight-bold text-secondary">
              Temps Transcorregut:
            </h2>
            <p class="text-h2 font-weight-black text-primary">
              {{ formattedTime }}
            </p>
          </div>
        </v-card>

        <v-card class="pa-2" elevation="8" rounded="lg">
          <PoseSkeleton @features="onFeatures" />
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card elevation="8" rounded="lg">
          <v-card-title
            class="text-h5 bg-primary white--text py-3 d-flex justify-center align-center"
          >
            <v-icon left class="mr-2">mdi-trophy</v-icon>
            Marcador
          </v-card-title>
          <v-list dense>
            <v-list-item
              v-for="(participant, index) in sortedParticipants"
              :key="participant.id"
              :class="{
                'bg-light-blue-lighten-5': index === 0,
                'bg-white': index !== 0,
              }"
              class="my-2 rounded-lg mx-2"
            >
              <template v-slot:prepend>
                <v-avatar :color="index === 0 ? 'amber' : 'grey-lighten-1'">
                  <v-icon v-if="index === 0" color="white">mdi-crown</v-icon>
                  <v-icon v-else color="white">mdi-account-circle</v-icon>
                </v-avatar>
              </template>
              <v-list-item-content class="ml-2">
                <v-list-item-title class="font-weight-bold text-body-1">{{
                  participant.username
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip
                    :color="index === 0 ? 'amber' : 'primary'"
                    size="small"
                    class="font-weight-bold"
                  >
                    Punts: {{ participant.puntos }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
