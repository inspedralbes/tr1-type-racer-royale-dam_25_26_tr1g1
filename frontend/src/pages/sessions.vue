<template>
  <NavBar />
  <v-container>
    <v-dialog v-model="showForm" fullscreen :scrim="false" transition="dialog-bottom-transition">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props">
          Crear Sessió
        </v-btn>
      </template>

      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="showForm = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Crear Nova Sessió</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <FormCrearSessio @session-created="onSessionCreated" />
      </v-card>
    </v-dialog>
    <ListSessions :key="componentKey" />
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
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
