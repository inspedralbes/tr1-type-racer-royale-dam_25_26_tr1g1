<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <NavBar />
    <div class="container mx-auto p-4 pb-20">
      <!-- Controls -->
      <div
        class="mb-6 rounded-xl border border-gray-700 bg-gray-800/50 p-4 shadow-lg backdrop-blur-sm"
      >
        <div
          class="flex flex-col items-center justify-between gap-4 md:flex-row"
        >
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

          <!-- Right side: Action Buttons -->
          <div
            class="flex w-full shrink-0 items-center justify-end gap-4 md:w-auto"
          >
            <!-- Filter Button and Dropdown -->
            <div class="relative" ref="filterMenu">
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
                class="absolute left-0 right-0 mx-auto top-full z-20 mt-2 max-w-xs origin-top-right rounded-lg bg-gray-700 py-1 shadow-lg ring-1 ring-black ring-opacity-5 md:right-0 md:left-auto md:mx-0 md:w-48"
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

      <!-- Session List -->
      <ListSessions :sessions="paginatedSessions" />

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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import FormSessio from "@/components/Forms/FormSessio.vue";
import ListSessions from "@/components/ListSessions.vue";
import NavBar from "@/components/NavBar.vue";
import { useWebSocketStore } from "@/stores/websocket";

const websocketStore = useWebSocketStore();

const showForm = ref(false);

// --- Search, Filter, and Pagination State ---
const searchQuery = ref("");
const selectedStatus = ref("ALL"); // 'ALL', 'WAITING', 'IN_PROGRESS'
const currentPage = ref(1);
const itemsPerPage = 5;
const showFilterMenu = ref(false);
const filterMenu = ref(null);

// --- Computed Properties ---
const allSessions = computed(() => websocketStore.sessions);

const filteredSessions = computed(() => {
  let sessions = allSessions.value;

  // Filter by status
  if (selectedStatus.value !== "ALL") {
    sessions = sessions.filter((s) => s.state.status === selectedStatus.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const lowerQuery = searchQuery.value.toLowerCase();
    sessions = sessions.filter(
      (s) =>
        (s.type && s.type.toLowerCase().includes(lowerQuery)) ||
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

// --- Methods ---
const onSessionCreated = () => {
  showForm.value = false;
};

const openCreateModal = () => {
  showForm.value = true;
};

const closeCreateModal = () => {
  showForm.value = false;
};

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

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Watch for changes that could affect pagination
watch([searchQuery, selectedStatus], () => {
  currentPage.value = 1;
});
</script>
