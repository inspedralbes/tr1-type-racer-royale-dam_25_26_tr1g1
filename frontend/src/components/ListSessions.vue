<template>
  <div class="container mx-auto p-4">
    <ul class="space-y-4">
      <li
        v-for="session in sessions"
        :key="session.id"
        class="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-lg shadow-lg p-4 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105"
        @click="handleSessionClick(session)"
      >
        <div class="flex flex-wrap items-center justify-between text-white">
          <div class="flex items-center">
            <div
              class="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mr-4"
            >
              <span class="mdi mdi-dumbbell text-white text-3xl"></span>
            </div>
            <div>
              <h3 class="text-xl font-bold">{{ session.type }}</h3>
              <p class="text-sm text-gray-300">
                ID: {{ session.id.substring(0, 8) }}
              </p>
            </div>
          </div>

          <div class="flex items-center text-lg mt-4 md:mt-0">
            <div class="flex items-center mr-4">
              <span class="mdi mdi-account-group text-gray-400 mr-2"></span>
              <span>{{ session.users.length }} / {{ session.maxUsers }}</span>
            </div>
            <div class="flex items-center mr-4">
              <span
                cl1ass="mdi mr-2"
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
            <div class="flex items-center mr-4">
              <span
                class="px-3 py-1 rounded-full text-sm font-semibold"
                :class="{
                  'bg-green-500 text-white': session.state.status === 'WAITING',
                  'bg-yellow-500 text-white':
                    session.state.status === 'IN_PROGRESS',
                }"
              >
                {{
                  session.state.status === "WAITING" ? "Esperant" : "En Curs"
                }}
              </span>
            </div>
            <div class="flex items-center mr-4">
              <span class="mdi mdi-timer-sand text-gray-400 mr-2"></span>
              <span>{{ formatDuration(session.state.startTime) }}</span>
            </div>
            <button
              class="px-6 py-2 rounded-lg font-bold transition duration-300 ease-in-out bg-blue-600 hover:bg-blue-700 text-white"
              @click.stop="handleSessionClick(session)"
            >
              <span class="mdi mdi-play-circle-outline mr-2"></span>
              <span class="hidden sm:inline">Join</span>
            </button>
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
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useWebSocketStore } from "@/stores/websocket";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const websocketStore = useWebSocketStore();
const userId = appStore.user.id;

const sessions = computed(() => websocketStore.sessions);

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
  const duration = Math.floor((now.value - startTime) / 1000); // duration in seconds

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

// Update duration every second
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
