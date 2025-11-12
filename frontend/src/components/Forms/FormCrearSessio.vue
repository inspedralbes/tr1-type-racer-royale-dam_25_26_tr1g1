<template>
  <div class="p-8 bg-gray-800 shadow-lg rounded-lg text-white">
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
          @click="emit('cancel')"
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
</template>

<script setup>
import { ref, defineEmits, defineProps } from "vue";
import { useWebSocketStore } from "@/stores/websocket";
import { useAppStore } from "@/stores/app";

const emit = defineEmits(["session-created", "cancel"]);

const props = defineProps({
  initialType: { type: String, default: "fullbody" },
});

const websocketStore = useWebSocketStore();
const appStore = useAppStore();

// Use the provided initialType to prefill the form's type
const session = ref({
  name: `Sessió de ${appStore.user?.username || "convidat"}`,
  type: props.initialType || "fullbody",
  duration: "Ràpida",
  password: "", // Changed from isPublic
  maxUsers: 5,
});

const submitForm = () => {
  websocketStore.sendMessage({
    type: "CREATE_SESSION",
    payload: session.value,
  });
  console.log("CREATE_SESSION message sent with payload:", session.value);
  emit("session-created");
};
</script>
