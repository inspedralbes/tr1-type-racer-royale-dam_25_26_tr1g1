<template>
  <div class="container mx-auto">
    <!-- Controls -->
    <div
      class="mb-6 rounded-xl border border-gray-700 bg-gray-800/50 p-4 shadow-lg backdrop-blur-sm"
    >
      <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
        <!-- Left side: Search -->
        <div class="relative w-full md:w-80">
          <span
            class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          ></span>
          <input
            type="text"
            id="search"
            v-model="searchQuery"
            placeholder="Buscar per Nom, ID..."
            class="w-full rounded-lg border-transparent bg-gray-700/50 py-2 pl-10 pr-4 text-white placeholder-gray-400 ring-2 ring-transparent transition focus:bg-gray-700 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <!-- Right side: Action Buttons (Filter and Create) -->
        <div
          class="flex w-full shrink-0 items-center justify-end gap-4 md:w-auto"
        >
          <!-- Filter Button and Dropdown -->
          <div class="relative z-40" ref="filterMenu">
            <button
              @click="toggleFilterMenu"
              class="flex items-center gap-2 rounded-full bg-gray-700/50 px-4 py-3 font-semibold text-white transition hover:bg-gray-700"
            >
              <span class="mdi mdi-filter-variant"></span>
              <span>Filtre</span>
              <span
                class="mdi mdi-chevron-down transition-transform"
                :class="{ 'rotate-180': showFilterMenu }"
              ></span>
            </button>
            <div
              v-if="showFilterMenu"
              class="absolute right-0 top-full z-50 mt-2 w-48 origin-top-right rounded-lg bg-gray-700 py-1 shadow-xl ring-1 ring-black ring-opacity-5"
            >
              <ul>
                <li
                  @click="applyFilter('ALL')"
                  class="flex cursor-pointer items-center justify-between px-4 py-2 text-sm hover:bg-gray-600"
                >
                  Tots
                  <span
                    v-if="selectedStatus === 'ALL'"
                    class="mdi mdi-check text-blue-400"
                  ></span>
                </li>
                <li
                  @click="applyFilter('WAITING')"
                  class="flex cursor-pointer items-center justify-between px-4 py-2 text-sm hover:bg-gray-600"
                >
                  Esperant
                  <span
                    v-if="selectedStatus === 'WAITING'"
                    class="mdi mdi-check text-blue-400"
                  ></span>
                </li>
                <li
                  @click="applyFilter('IN_PROGRESS')"
                  class="flex cursor-pointer items-center justify-between px-4 py-2 text-sm hover:bg-gray-600"
                >
                  En Curs
                  <span
                    v-if="selectedStatus === 'IN_PROGRESS'"
                    class="mdi mdi-check text-blue-400"
                  ></span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Create Button -->
          <button
            @click="openCreateModal"
            class="flex w-full transform items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-3 font-bold text-white shadow-lg transition duration-300 ease-in-out hover:scale-105 md:w-auto"
          >
            <span class="mdi mdi-plus-circle"></span>
            <span>Crear Sessió</span>
          </button>
        </div>
      </div>
    </div>

    <ul class="space-y-4">
      <li
        v-for="session in paginatedSessions"
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

    <!-- Pagination Controls -->
    <div
      v-if="totalPages > 1"
      class="mt-6 flex items-center justify-center space-x-4"
    >
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="flex items-center rounded-lg bg-blue-600 px-4 py-2 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span class="mdi mdi-chevron-left mr-1"></span>
        Anterior
      </button>
      <span class="text-lg font-medium text-gray-300">
        Pàgina {{ currentPage }} de {{ totalPages }}
      </span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="flex items-center rounded-lg bg-blue-600 px-4 py-2 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Següent
        <span class="mdi mdi-chevron-right ml-1"></span>
      </button>
    </div>
    <div v-if="filteredSessions.length === 0" class="text-center py-10">
      <p class="text-gray-400 text-lg">No s'han trobat sessions.</p>
    </div>

    <!-- Modal for Create Session -->
    <div
      v-if="showForm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
    >
      <div class="relative w-full max-w-lg rounded-lg bg-gray-800 shadow-xl">
        <button
          @click="closeCreateModal"
          class="absolute right-3 top-3 text-2xl text-gray-400 hover:text-white"
        >
          <i class="mdi mdi-close"></i>
        </button>
        <div>
          <FormSessio
            @session-created="onSessionCreated"
            @cancel="closeCreateModal"
          />
        </div>
      </div>
    </div>

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
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useWebSocketStore } from "@/stores/websocket";
import FormSessio from "@/components/Forms/FormSessio.vue"; // Import FormSessio

const websocketStore = useWebSocketStore();

const searchQuery = ref("");
const selectedStatus = ref("ALL");
const currentPage = ref(1);
const itemsPerPage = 5;
const showFilterMenu = ref(false);
const filterMenu = ref(null);

const allSessions = computed(() => websocketStore.sessions);

const filteredSessions = computed(() => {
  let sessions = allSessions.value;

  if (selectedStatus.value !== "ALL") {
    sessions = sessions.filter((s) => s.state.status === selectedStatus.value);
  }

  if (searchQuery.value) {
    const lowerQuery = searchQuery.value.toLowerCase();
    sessions = sessions.filter(
      (s) =>
        (s.name && s.name.toLowerCase().includes(lowerQuery)) ||
        (s.id && s.id.toLowerCase().includes(lowerQuery))
    );
  }

  return sessions;
});

const totalPages = computed(() => {
  return Math.ceil(filteredSessions.value.length / itemsPerPage);
});

const paginatedSessions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredSessions.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const toggleFilterMenu = () => {
  showFilterMenu.value = !showFilterMenu.value;
};

const applyFilter = (status) => {
  selectedStatus.value = status;
  showFilterMenu.value = false;
};

const handleClickOutside = (event) => {
  if (filterMenu.value && !filterMenu.value.contains(event.target)) {
    showFilterMenu.value = false;
  }
};

watch([searchQuery, selectedStatus], () => {
  currentPage.value = 1;
});

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
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  clearInterval(durationInterval);
  document.removeEventListener("click", handleClickOutside);
});

// Create Session Modal Logic
const showForm = ref(false);

const onSessionCreated = () => {
  showForm.value = false;
};

const openCreateModal = () => {
  showForm.value = true;
};

const closeCreateModal = () => {
  showForm.value = false;
};
</script>
