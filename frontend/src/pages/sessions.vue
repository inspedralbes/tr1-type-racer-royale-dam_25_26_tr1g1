<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <NavBar />
    <div class="container mx-auto p-4 pb-20"> <!-- Added pb-20 for navbar spacing -->
      <div class="relative bg-gradient-to-r from-green-400 to-blue-500 p-8 rounded-lg shadow-lg mb-6 text-center">
        <h2 class="text-4xl font-extrabold mb-2">Explora Sessions Actives</h2>
        <p class="text-lg text-gray-200 mb-4">Uneix-te a una sessió o crea la teva pròpia!</p>
        <button
          @click="showForm = true"
          class="bg-white text-blue-600 hover:bg-blue-100 font-bold py-3 px-8 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Crear Nova Sessió
        </button>
      </div>

      <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
        <div class="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg relative">
          <button @click="showForm = false" class="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl">
            <i class="mdi mdi-close"></i>
          </button>
          <div class="p-6">
            <h3 class="text-2xl font-bold mb-4 text-white">Crear Nova Sessió</h3>
            <FormCrearSessio @session-created="onSessionCreated" />
          </div>
        </div>
      </div>
      <ListSessions :key="componentKey" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import FormCrearSessio from "@/components/Forms/FormCrearSessio.vue";
import ListSessions from "@/components/ListSessions.vue";
import NavBar from "@/components/NavBar.vue";

const showForm = ref(false);
const componentKey = ref(0);

const onSessionCreated = () => {
  showForm.value = false; // Ocultar el formulario
  componentKey.value += 1; // Forzar la recarga de ListSessions
};
</script>
