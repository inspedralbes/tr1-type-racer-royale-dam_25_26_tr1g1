<template>
  <div class="container mx-auto">
    <!-- Controls -->
    <div
      class="mb-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 p-4 shadow-lg backdrop-blur-sm sm:flex-row"
    >
      <!-- Left side: Search -->
      <div class="relative w-full sm:w-auto sm:flex-grow md:max-w-xs">
        <span
          class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400"
        ></span>
        <input
          type="text"
          id="search"
          v-model="searchQuery"
          placeholder="Buscar per Nom, ID..."
          class="w-full rounded-lg border-transparent bg-gray-200/50 dark:bg-gray-700/50 py-2 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ring-2 ring-transparent transition focus:bg-gray-200 dark:focus:bg-gray-700 focus:outline-none focus:ring-blue-500"
        />
      </div>

      <!-- Right side: Action Buttons -->
      <div
        class="flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto"
      >
        <!-- Filter Button -->
        <div class="relative" ref="filterMenu">
          <button
            @click="toggleFilterMenu"
            class="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200/50 dark:bg-gray-700/50 font-semibold text-gray-900 dark:text-white transition hover:bg-gray-300 dark:hover:bg-gray-700"
            aria-label="Filtre"
          >
            <span class="mdi mdi-filter-variant text-xl"></span>
          </button>
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="showFilterMenu"
              class="absolute left-0 md:right-0 md:left-auto top-full mt-2 w-48 origin-top-left md:origin-top-right rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 py-1 shadow-2xl"
            >
              <ul>
                <li
                  @click="applyFilter('ALL')"
                  class="flex cursor-pointer items-center justify-between px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Tots
                  <span
                    v-if="selectedStatus === 'ALL'"
                    class="mdi mdi-check text-blue-500 dark:text-blue-400"
                  ></span>
                </li>
                <li
                  @click="applyFilter('WAITING')"
                  class="flex cursor-pointer items-center justify-between px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Esperant
                  <span
                    v-if="selectedStatus === 'WAITING'"
                    class="mdi mdi-check text-blue-500 dark:text-blue-400"
                  ></span>
                </li>
                <li
                  @click="applyFilter('IN_PROGRESS')"
                  class="flex cursor-pointer items-center justify-between px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  En Curs
                  <span
                    v-if="selectedStatus === 'IN_PROGRESS'"
                    class="mdi mdi-check text-blue-500 dark:text-blue-400"
                  ></span>
                </li>
              </ul>
            </div>
          </transition>
        </div>

        <!-- Create Button -->
        <button
          @click="openCreateModal"
          class="flex h-11 transform items-center justify-center gap-2 rounded-full bg-blue-500 px-4 font-bold text-white shadow-lg transition duration-300 ease-in-out hover:scale-105"
        >
          <span class="mdi mdi-plus text-xl"></span>
          <span class="hidden sm:inline">Crear Sessió</span>
        </button>
      </div>
    </div>

    <!-- Session List -->
    <ul class="space-y-4">
      <li
        v-for="session in paginatedSessions"
        :key="session.id"
        class="group cursor-pointer rounded-xl border border-gray-200 dark:border-transparent bg-white/50 dark:bg-gray-800/50 shadow-lg transition-all duration-300 ease-in-out hover:border-blue-500/50 hover:shadow-blue-500/10"
        @click="handleSessionClick(session)"
      >
        <div class="flex items-center p-4">
          <!-- Emoji -->
          <div
            class="mr-4 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gray-200/50 dark:bg-gray-700/50 text-3xl transition-transform duration-300 group-hover:scale-110"
          >
            <span>{{ getRoutineEmoji(session.type) }}</span>
          </div>

          <!-- Session Info -->
          <div class="flex-grow">
            <h3 class="font-bold text-gray-900 dark:text-white sm:text-lg">
              {{ session.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ session.type }} - ID: {{ session.id.substring(0, 8) }}
            </p>
          </div>

          <!-- Stats -->
          <div
            class="hidden flex-shrink-0 items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-300 sm:flex"
          >
            <div class="flex items-center" title="Jugadors">
              <span class="mdi mdi-account-group mr-1.5 text-lg"></span>
              <span>{{ session.users.length }} / {{ session.maxUsers }}</span>
            </div>
            <div class="flex items-center" title="Privacitat">
              <span
                class="mdi mr-1.5 text-lg"
                :class="
                  !session.password
                    ? 'mdi-earth text-green-400'
                    : 'mdi-lock text-red-400'
                "
              ></span>
              <span class="hidden md:inline">{{
                !session.password ? "Pública" : "Privada"
              }}</span>
            </div>
            <div class="flex items-center" title="Temps">
              <span class="mdi mdi-timer-sand mr-1.5 text-lg"></span>
              <span>{{ formatDuration(session.state.startTime) }}</span>
            </div>
          </div>

          <!-- Status & Join -->
          <div class="ml-4 flex flex-shrink-0 items-center gap-4">
            <span
              class="hidden rounded-full px-3 py-1 text-xs font-semibold sm:inline-block"
              :class="{
                'bg-green-500/20 text-green-300':
                  session.state.status === 'WAITING',
                'bg-yellow-500/20 text-yellow-300':
                  session.state.status === 'IN_PROGRESS',
              }"
            >
              {{ session.state.status === "WAITING" ? "Esperant" : "En Curs" }}
            </span>
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-colors duration-300 group-hover:bg-blue-500"
            >
              <span class="mdi mdi-play text-2xl"></span>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <!-- Pagination Controls -->
    <div
      v-if="totalPages > 1"
      class="mt-6 flex items-center justify-center space-x-2 sm:space-x-4"
    >
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="flex items-center rounded-lg bg-gray-200/50 dark:bg-gray-700/50 px-4 py-2 font-bold text-gray-900 dark:text-white transition hover:bg-gray-300 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span class="mdi mdi-chevron-left"></span>
      </button>
      <span class="font-medium text-gray-600 dark:text-gray-300">
        Pàgina {{ currentPage }} de {{ totalPages }}
      </span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="flex items-center rounded-lg bg-gray-200/50 dark:bg-gray-700/50 px-4 py-2 font-bold text-gray-900 dark:text-white transition hover:bg-gray-300 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span class="mdi mdi-chevron-right"></span>
      </button>
    </div>

    <!-- No Sessions Found -->
    <div v-if="filteredSessions.length === 0" class="py-10 text-center">
      <p class="text-lg text-gray-500 dark:text-gray-400">
        No s'han trobat sessions.
      </p>
    </div>

    <!-- Modal for Create Session -->
    <div
      v-if="showForm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
    >
      <div
        class="relative w-full max-w-lg rounded-lg bg-white dark:bg-gray-800 shadow-xl"
      >
        <button
          @click="closeCreateModal"
          class="absolute right-3 top-3 text-2xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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

    <!-- Password Dialog -->
    <div
      v-if="showPasswordDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <div
        class="w-full max-w-sm rounded-lg bg-white dark:bg-gray-800 p-6 text-gray-900 dark:text-white shadow-xl"
      >
        <h3 class="mb-4 text-xl font-semibold">Contrasenya requerida</h3>
        <input
          type="password"
          v-model="passwordInput"
          placeholder="Contrasenya"
          class="mb-4 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="confirmJoinSession"
        />
        <div class="flex justify-end space-x-4">
          <button
            @click="showPasswordDialog = false"
            class="rounded-md px-4 py-2 transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Cancel·lar
          </button>
          <button
            @click="confirmJoinSession"
            class="rounded-md bg-blue-600 px-4 py-2 transition duration-300 hover:bg-blue-700 text-white"
          >
            Entrar
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

const getRoutineEmoji = (type) => {
  if (!type) return "🏋🏽‍♂️";
  const typeLower = type.toLowerCase();
  if (typeLower.includes("fullbody")) {
    return "🏋🏽‍♂️";
  } else if (typeLower.includes("lower")) {
    return "🦵🏻";
  } else if (typeLower.includes("upper")) {
    return "💪🏻";
  } else if (typeLower.includes("prova")) {
    return "🏋🏽‍♂️";
  }
  return "🏋🏽‍♂️"; // Default emoji
};

const showPasswordDialog = ref(false);
const passwordInput = ref("");
const selectedSession = ref(null);

const handleSessionClick = (session) => {
  if (session.password) {
    selectedSession.value = session;
    passwordInput.value = "";
    showPasswordDialog.value = true;
  } else {
    joinSession(session.id, "");
  }
};

const confirmJoinSession = () => {
  if (selectedSession.value) {
    joinSession(selectedSession.value.id, passwordInput.value);
    showPasswordDialog.value = false;
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
