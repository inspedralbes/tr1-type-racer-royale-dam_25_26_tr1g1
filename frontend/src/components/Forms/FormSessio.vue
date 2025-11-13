<template>
  <div class="p-8 bg-gray-800 shadow-lg rounded-lg text-white">
    <!-- SelectRoutine part -->
    <div v-if="!session.type">
      <div class="p-4 flex-shrink-0">
        <h2 class="text-2xl font-bold mb-2">Què vols entrenar?</h2>
        <p class="text-gray-300 mb-6">
          Tria una rutina per començar a configurar la sessió.
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-6 p-4 flex-grow">
        <button
          @click="selectedRoutine = 'fullbody'"
          :class="[
            'relative rounded-lg bg-gray-700 text-left transition transform hover:scale-105 h-full overflow-hidden',
            selectedRoutine === 'fullbody'
              ? 'border-4 border-green-500'
              : 'border border-gray-600',
          ]"
        >
          <img
            src="/Cos_complet.png"
            alt="Cos Complet"
            class="w-full h-40 sm:h-48 md:h-64 object-cover rounded-md"
          />
          <div
            class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-3 text-center"
          >
            <span class="text-xl font-semibold text-white">Cos Complet</span>
          </div>
        </button>

        <button
          @click="selectedRoutine = 'upper'"
          :class="[
            'relative rounded-lg bg-gray-700 text-left transition transform hover:scale-105 h-full overflow-hidden',
            selectedRoutine === 'upper'
              ? 'border-4 border-green-500'
              : 'border border-gray-600',
          ]"
        >
          <img
            src="/Tren_superior.png"
            alt="Tren Superior"
            class="w-full h-40 sm:h-48 md:h-64 object-cover rounded-md"
          />
          <div
            class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-3 text-center"
          >
            <span class="text-xl font-semibold text-white">Tren Superior</span>
          </div>
        </button>

        <button
          @click="selectedRoutine = 'lower'"
          :class="[
            'relative rounded-lg bg-gray-700 text-left transition transform hover:scale-105 h-full overflow-hidden',
            selectedRoutine === 'lower'
              ? 'border-4 border-green-500'
              : 'border border-gray-600',
          ]"
        >
          <img
            src="/Tren_inferior.png"
            alt="Tren Inferior"
            class="w-full h-40 sm:h-48 md:h-64 object-cover rounded-md"
          />
          <div
            class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-3 text-center"
          >
            <span class="text-xl font-semibold text-white">Tren Inferior</span>
          </div>
        </button>
      </div>

      <div class="mt-auto flex justify-end p-4 gap-4 flex-shrink-0">
        <button
          @click="emit('cancel')"
          class="rounded-lg border border-gray-600 px-4 py-2 text-gray-300 hover:bg-gray-700"
        >
          Tornar enrere
        </button>
        <button
          @click="handleRoutineSelected"
          :disabled="!selectedRoutine"
          class="rounded-lg px-4 py-2 text-white font-semibold transition"
          :class="{
            'bg-green-600 hover:bg-green-700': selectedRoutine,
            'bg-gray-500 cursor-not-allowed': !selectedRoutine,
          }"
        >
          Acceptar
        </button>
      </div>
    </div>

    <!-- FormSessio part -->
    <div v-else>
      <h2 class="text-2xl font-bold mb-6">Crear Nova Sessió</h2>
      <form @submit.prevent="submitForm" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-300"
            >Nom de la sessió</label
          >
          <input
            type="text"
            id="name"
            v-model="session.name"
            class="w-full px-4 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label for="duration" class="block text-sm font-medium text-gray-300"
            >Duración</label
          >
          <select
            id="duration"
            v-model="session.duration"
            class="w-full px-4 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Ràpida">Ràpida</option>
            <option value="Intermitja">Intermitja</option>
            <option value="Extensa">Extensa</option>
          </select>
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-300"
            >Contrasenya (deixar buit per a sessió pública)</label
          >
          <input
            type="password"
            id="password"
            v-model="session.password"
            class="w-full px-4 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label for="maxUsers" class="block text-sm font-medium text-gray-300"
            >Màxim d'usuaris</label
          >
          <input
            type="number"
            id="maxUsers"
            v-model.number="session.maxUsers"
            class="w-full px-4 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="session.type = null"
            class="px-6 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 transition-colors duration-300"
          >
            Tornar enrere
          </button>
          <button
            type="submit"
            class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors duration-300"
          >
            Crear Sessió
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { useWebSocketStore } from "@/stores/websocket";
import { useAppStore } from "@/stores/app";

const emit = defineEmits(["session-created", "cancel"]);

const websocketStore = useWebSocketStore();
const appStore = useAppStore();

const selectedRoutine = ref(null);

const session = ref({
  name: `Sessió de ${appStore.user?.username || "convidat"}`,
  type: null,
  duration: "Ràpida",
  password: "",
  maxUsers: 5,
});

const handleRoutineSelected = () => {
  if (selectedRoutine.value) {
    session.value.type = selectedRoutine.value;
  }
};

const submitForm = () => {
  websocketStore.sendMessage({
    type: "CREATE_SESSION",
    payload: session.value,
  });
  console.log("CREATE_SESSION message sent with payload:", session.value);
  emit("session-created");
};
</script>
