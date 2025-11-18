<template>
  <div class="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg text-gray-900 dark:text-white">
    <h2 class="text-2xl font-bold mb-6 text-center">Crear Nova Sessió</h2>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Routine Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2"
          >Què vols entrenar?</label
        >
        <div class="grid grid-cols-3 gap-3">
          <button
            type="button"
            v-for="routine in routines"
            :key="routine.type"
            @click="selectRoutine(routine.type)"
            :class="[
              'flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-200 border-2',
              session.type === routine.type
                ? 'bg-blue-500 dark:bg-blue-600 border-blue-500 shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500',
            ]"
          >
            <span class="text-3xl">{{ routine.emoji }}</span>
            <span class="mt-2 text-sm font-semibold">{{ routine.name }}</span>
          </button>
        </div>
      </div>

      <!-- Session Name -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-600 dark:text-gray-300"
          >Nom de la sessió</label
        >
        <div class="relative mt-2">
          <span
            class="mdi mdi-format-text absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          ></span>
          <input
            type="text"
            id="name"
            v-model="session.name"
            class="w-full rounded-lg border-transparent bg-gray-100 dark:bg-gray-700/50 py-2 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ring-2 ring-transparent transition focus:bg-gray-200 dark:focus:bg-gray-700 focus:outline-none focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <!-- Duration & Max Users -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            for="duration"
            class="block text-sm font-medium text-gray-600 dark:text-gray-300"
            >Duració</label
          >
          <div class="relative mt-2">
            <span
              class="mdi mdi-clock-outline absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            ></span>
            <select
              id="duration"
              v-model="session.duration"
              class="w-full appearance-none rounded-lg border-transparent bg-gray-100 dark:bg-gray-700/50 py-2 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ring-2 ring-transparent transition focus:bg-gray-200 dark:focus:bg-gray-700 focus:outline-none focus:ring-blue-500"
              required
            >
              <option value="Ràpida">Ràpida (10 min)</option>
              <option value="Intermitja">Intermitja (20 min)</option>
              <option value="Extensa">Extensa (30 min)</option>
            </select>
          </div>
        </div>
        <div>
          <label
            for="maxUsers"
            class="block text-sm font-medium text-gray-600 dark:text-gray-300"
            >Màxim d'usuaris</label
          >
          <div class="relative mt-2">
            <span
              class="mdi mdi-account-group absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            ></span>
            <input
              type="number"
              id="maxUsers"
              v-model.number="session.maxUsers"
              min="1"
              max="10"
              class="w-full rounded-lg border-transparent bg-gray-100 dark:bg-gray-700/50 py-2 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ring-2 ring-transparent transition focus:bg-gray-200 dark:focus:bg-gray-700 focus:outline-none focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-600 dark:text-gray-300"
          >Contrasenya (opcional)</label
        >
        <div class="relative mt-2">
          <span
            class="mdi mdi-lock-outline absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          ></span>
          <input
            type="password"
            id="password"
            v-model="session.password"
            placeholder="Deixar buit per a sessió pública"
            class="w-full rounded-lg border-transparent bg-gray-100 dark:bg-gray-700/50 py-2 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ring-2 ring-transparent transition focus:bg-gray-200 dark:focus:bg-gray-700 focus:outline-none focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-4 pt-4">
        <button
          type="button"
          @click="emit('cancel')"
          class="rounded-lg px-6 py-2 font-semibold text-gray-600 dark:text-gray-300 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Cancel·lar
        </button>
        <button
          type="submit"
          :disabled="!isFormValid"
          class="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-500"
        >
          Crear Sessió
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from "vue";
import { useWebSocketStore } from "@/stores/websocket";
import { useAppStore } from "@/stores/app";
import { useUsersStore } from "@/stores/users";

const emit = defineEmits(["session-created", "cancel"]);

const websocketStore = useWebSocketStore();
const appStore = useAppStore();
const usersStore = useUsersStore();

const loggedInUser = computed(() => usersStore.getUser(appStore.userId));

const routines = [
  { type: "fullbody", name: "Cos Complet", emoji: "🏋🏽‍♂️" },
  { type: "upper", name: "Tren Superior", emoji: "💪🏻" },
  { type: "lower", name: "Tren Inferior", emoji: "🦵🏻" },
];

const session = ref({
  name: "",
  type: null,
  duration: "Ràpida",
  password: "",
  maxUsers: 5,
});

const selectRoutine = (type) => {
  session.value.type = type;
  session.value.name = `Sessió de ${
    loggedInUser.value?.username || "convidat"
  }`;
};

const isFormValid = computed(() => {
  return session.value.type && session.value.name && session.value.maxUsers > 0;
});

const submitForm = () => {
  if (!isFormValid.value) return;
  websocketStore.sendMessage({
    type: "CREATE_SESSION",
    payload: session.value,
  });
  emit("session-created");
};
</script>
