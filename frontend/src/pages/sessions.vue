<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <NavBar />
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold">Sessions Actives</h2>
        <button @click="showForm = true" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Crear Sessió</button>
      </div>

      <div v-if="showForm" class="fixed inset-0 bg-gray-900 z-50">
        <div class="bg-gray-900 h-full">
          <div class="flex items-center justify-between p-4 bg-blue-500 text-white">
            <h2 class="text-xl font-bold">Crear Nova Sessió</h2>
            <button @click="showForm = false">
              <i class="mdi mdi-close text-2xl"></i>
            </button>
          </div>
          <div class="p-4">
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
