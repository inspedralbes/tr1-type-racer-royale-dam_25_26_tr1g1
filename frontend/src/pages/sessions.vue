<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <NavBar />
    <div class="container mx-auto p-4 pb-20">
      <!-- Controls -->
      <div class="mb-6 rounded-lg bg-gray-800 p-4 shadow-lg">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <!-- Search Input -->
          <div class="sm:col-span-1">
            <label
              for="search"
              class="mb-2 block text-sm font-medium text-gray-300"
              >Buscar Sessió</label
            >
            <input
              type="text"
              id="search"
              v-model="searchQuery"
              placeholder="Nom, ID..."
              class="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <!-- Filter Select -->
          <div class="sm:col-span-1">
            <label
              for="status-filter"
              class="mb-2 block text-sm font-medium text-gray-300"
              >Filtrar per Estat</label
            >
            <select
              id="status-filter"
              v-model="selectedStatus"
              class="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="ALL">Tots</option>
              <option value="WAITING">Esperant</option>
              <option value="IN_PROGRESS">En Curs</option>
            </select>
          </div>

          <div class="flex items-end sm:col-span-1">
            <button
              @click="openCreateModal"
              class="w-full transform rounded-full bg-white px-8 py-3 font-bold text-blue-600 shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-100"
            >
              Crear Nova Sessió
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
            <template v-if="selectionStep">
              <SelectRoutine @selected="onRoutineSelected" @cancel="closeCreateModal" />
            </template>
            <template v-else>
              <FormCrearSessio
                :initialType="selectedRoutine"
                @session-created="onSessionCreated"
                @cancel="backToSelection"
              />
            </template>
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
import { ref, computed, watch } from "vue";
import FormCrearSessio from "@/components/Forms/FormCrearSessio.vue";
import SelectRoutine from "@/components/session/SelectRoutine.vue";
import ListSessions from "@/components/ListSessions.vue";
import NavBar from "@/components/NavBar.vue";
import { useWebSocketStore } from "@/stores/websocket";

const websocketStore = useWebSocketStore();

const showForm = ref(false);
const selectionStep = ref(true); // true: show selector first
const selectedRoutine = ref("fullbody");

// --- Search, Filter, and Pagination State ---
const searchQuery = ref("");
const selectedStatus = ref("ALL"); // 'ALL', 'WAITING', 'IN_PROGRESS'
const currentPage = ref(1);
const itemsPerPage = 5;

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
  selectionStep.value = true;
  // No need to force reload, computed properties will update automatically
};

const openCreateModal = () => {
  selectedRoutine.value = "fullbody";
  selectionStep.value = true;
  showForm.value = true;
};

const onRoutineSelected = (routine) => {
  selectedRoutine.value = routine;
  selectionStep.value = false;
};

const backToSelection = () => {
  selectionStep.value = true;
};

const closeCreateModal = () => {
  showForm.value = false;
  selectionStep.value = true;
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

// Watch for changes that could affect pagination
watch([searchQuery, selectedStatus], () => {
  currentPage.value = 1;
});
</script>
