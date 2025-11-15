<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <NavBar />
    <div class="container mx-auto p-4 pb-20">
      <!-- Controls -->
      <div
        class="mb-6 rounded-xl border border-gray-700 bg-gray-800/50 p-4 shadow-lg backdrop-blur-sm relative z-30"
      >
        <div class="flex items-center justify-end">
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
      <div class="relative z-10">
        <ListSessions />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import FormSessio from "@/components/Forms/FormSessio.vue";
import ListSessions from "@/components/ListSessions.vue";
import NavBar from "@/components/NavBar.vue";

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