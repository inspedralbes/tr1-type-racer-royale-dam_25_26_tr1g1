<template>
  <div class="p-8 bg-gray-800 shadow-lg rounded-lg text-white">
    <h2 class="text-2xl font-bold mb-6">Crear Nova Sessió</h2>
    <form @submit.prevent="submitForm" class="space-y-6">
      <div>
        <label for="type" class="block text-sm font-medium text-gray-300"
          >Tipus d'exercici</label
        >
        <input
          type="text"
          id="type"
          v-model="session.type"
          class="w-full px-4 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label for="time" class="block text-sm font-medium text-gray-300"
          >Temps (minuts)</label
        >
        <input
          type="number"
          id="time"
          v-model.number="session.time"
          class="w-full px-4 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
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
      <div class="flex justify-end">
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
import { ref, defineEmits } from "vue";
import { useWebSocketStore } from "@/stores/websocket";

const emit = defineEmits(["session-created"]);

const websocketStore = useWebSocketStore();

const session = ref({
  type: "Full Body",
  time: 30,
  password: "", // Changed from isPublic
  maxUsers: 8,
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