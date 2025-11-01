<template>
  <div>
    <NavBar />
    <v-container>
      <v-row class="mb-4">
        <v-col>
          <h1 class="text-h4">Sessions</h1>
        </v-col>
        <v-col class="text-right">
          <v-btn color="primary" @click="dialog = true"> Crear Sessió </v-btn>
        </v-col>
      </v-row>

      <ListSessions :sessions="sessions" @join="handleJoinSession" />
    </v-container>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <FormCrearSessio @close="dialog = false" @submit="handleCreateSession" />
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useWebSocketStore } from "@/stores/websocket";
import { useAppStore } from "@/stores/app";
import NavBar from "@/components/NavBar.vue";
import ListSessions from "@/components/ListSessions.vue";
import FormCrearSessio from "@/components/Forms/FormCrearSessio.vue";

const dialog = ref(false);
const wsStore = useWebSocketStore();
const appStore = useAppStore();

const sessions = computed(() => wsStore.sessions);
const userId = computed(() => appStore.user?.id);

const handleCreateSession = (options) => {
  if (!userId.value) {
    console.error("Usuari no autenticat!");
    return;
  }
  wsStore.createSession({ ...options, hostId: userId.value });
  dialog.value = false;
};

const handleJoinSession = (sessionId) => {
  if (!userId.value) {
    console.error("Usuari no autenticat!");
    return;
  }
  wsStore.joinSession(sessionId, userId.value);
};
</script>
