<template>
  <div class="container mx-auto">
    <ul class="space-y-4">
      <li
        v-for="session in sessions"
        :key="session.id"
        class="relative rounded-lg shadow-lg cursor-pointer transition-all duration-300 ease-in-out overflow-hidden bg-cover bg-center hover:shadow-xl"
        :style="{
          backgroundImage: `linear-gradient(rgba(40, 91, 137, 0.9), rgba(18, 16, 50, 1))`,
        }"
        @click="handleSessionClick(session)"
      >
        <div class="p-4">
          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between text-white"
          >
            <div class="flex items-center mb-4 md:mb-0">
              <div
                class="w-14 h-14 bg-blue-500/80 rounded-full flex items-center justify-center mr-4"
              >
                <span class="mdi mdi-dumbbell text-white text-3xl"></span>
              </div>
              <div>
                <h3 class="text-xl font-bold">{{ session.name }}</h3>
                <p class="text-sm text-gray-200">
                  {{ session.type }} - ID: {{ session.id.substring(0, 8) }}
                </p>
              </div>
            </div>

            <div
              class="flex flex-wrap items-center justify-start md:justify-end gap-x-4 gap-y-2 text-lg"
            >
              <div class="flex items-center">
                <span class="mdi mdi-account-group text-gray-300 mr-2"></span>
                <span>{{ session.users.length }} / {{ session.maxUsers }}</span>
              </div>
              <div class="flex items-center">
                <span
                  class="mdi mr-2"
                  :class="
                    !session.password
                      ? 'mdi-earth text-green-400'
                      : 'mdi-lock text-red-400'
                  "
                ></span>
                <span class="hidden sm:inline">{{
                  !session.password ? "Public" : "Private"
                }}</span>
              </div>
              <div class="flex items-center">
                <span
                  class="px-3 py-1 rounded-full text-sm font-semibold"
                  :class="{
                    'bg-green-500/80 text-white':
                      session.state.status === 'WAITING',
                    'bg-yellow-500/80 text-white':
                      session.state.status === 'IN_PROGRESS',
                  }"
                >
                  {{
                    session.state.status === "WAITING" ? "Esperant" : "En Curs"
                  }}
                </span>
              </div>
              <div class="flex items-center">
                <span class="mdi mdi-timer-sand text-gray-300 mr-2"></span>
                <span>{{ formatDuration(session.state.startTime) }}</span>
              </div>
              <button
                class="hidden md:block px-6 py-2 rounded-lg font-bold transition duration-300 ease-in-out bg-blue-600 hover:bg-blue-700 text-white"
                @click.stop="handleSessionClick(session)"
              >
                <span class="mdi mdi-play-circle-outline mr-2"></span>
                <span class="hidden sm:inline">Join</span>
              </button>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <div
      v-if="showPasswordDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm text-white"
      >
        <h3 class="text-xl font-semibold mb-4">Enter Password</h3>
        <input
          type="password"
          v-model="passwordInput"
          placeholder="Password"
          class="w-full px-4 py-2 mb-4 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div class="flex justify-end space-x-4">
          <button
            @click="showPasswordDialog = false"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition duration-300"
          >
            Cancel
          </button>
          <button
            @click="confirmJoinSession"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition duration-300"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useWebSocketStore } from "@/stores/websocket";

const websocketStore = useWebSocketStore();
const sessions = computed(() => websocketStore.sessions);

// En un futuro ya se verá si se usa...
const getBackgroundImage = (type) => {
  if (!type) return "";
  const typeLower = type.toLowerCase();
  if (typeLower.includes("fullbody")) {
    return "/Cos_complet.png";
  } else if (typeLower.includes("lower")) {
    return "/Tren_inferior.png";
  } else if (typeLower.includes("upper")) {
    return "/Tren_superior.png";
  }
  return "";
};

const showPasswordDialog = ref(false);
const passwordInput = ref("");
const selectedSession = ref(null);

const handleSessionClick = (session) => {
  if (session.password) {
    selectedSession.value = session;
    showPasswordDialog.value = true;
  } else {
    joinSession(session.id, "");
  }
};

const confirmJoinSession = () => {
  if (selectedSession.value) {
    joinSession(selectedSession.value.id, passwordInput.value);
    showPasswordDialog.value = false;
    passwordInput.value = "";
  }
};

const joinSession = (sessionId, password) => {
  websocketStore.sendMessage({
    type: "JOIN_SESSION",
    payload: { sessionId, password },
  });
};

const now = ref(Date.now());
const formatDuration = (startTime) => {
  const duration = Math.floor((now.value - new Date(startTime)) / 1000);

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

let durationInterval = null;
onMounted(() => {
  durationInterval = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(durationInterval);
});
</script>
