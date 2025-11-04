<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <NavBar />
    <div class="container mx-auto p-4">
      <v-dialog
        v-model="showForm"
        fullscreen
        :scrim="false"
        transition="dialog-bottom-transition"
      >
        <template v-slot:activator="{ props }">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-3xl font-bold">Sessions Actives</h2>
            <v-btn color="primary" v-bind="props"> Crear Sessió</v-btn>
          </div>
        </template>

        <div class="bg-gray-900 h-full">
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="showForm = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Crear Nova Sessió</v-toolbar-title>
          </v-toolbar>
          <div class="p-4">
            <FormCrearSessio @session-created="onSessionCreated" />
          </div>
        </div>
      </v-dialog>
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
