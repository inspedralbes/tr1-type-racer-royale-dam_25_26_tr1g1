<template>
  <v-container>
    <h1>Sessions disponibles</h1>
    <v-row>
      <v-col v-for="session in sessions" :key="session.id" cols="12" md="4">
        <ItemSessio :session="session" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, computed, watch } from "vue";
import { useWebSocketStore } from "@/stores/websocket";
import ItemSessio from "@/components/Items/ItemSessio.vue";

const websocketStore = useWebSocketStore();

const sessions = computed(() => websocketStore.sessions);

onMounted(() => {
  if (websocketStore.isConnected) {
    websocketStore.getSessions();
  } else {
    const unwatch = watch(
      () => websocketStore.isConnected,
      (isConnected) => {
        if (isConnected) {
          websocketStore.getSessions();
          unwatch();
        }
      }
    );
  }
});
</script>
