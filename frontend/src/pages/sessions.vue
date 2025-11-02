<template>
  <NavBar />
  <v-container>
    <v-btn @click="showForm = !showForm" color="primary" class="mb-4">
      {{ showForm ? 'Cancelar' : 'Crear Sessió' }}
    </v-btn>
    <FormCrearSessio v-if="showForm" @session-created="onSessionCreated" />
    <ListSessions :key="componentKey" />
  </v-container>
</template>

<script>
import FormCrearSessio from '@/components/Forms/FormCrearSessio.vue';

export default {
  components: {
    FormCrearSessio,
  },
  data() {
    return {
      showForm: false,
      componentKey: 0,
    };
  },
  methods: {
    onSessionCreated() {
      this.showForm = false; // Ocultar el formulario
      this.componentKey += 1; // Forzar la recarga de ListSessions
    },
  },
};
</script>

