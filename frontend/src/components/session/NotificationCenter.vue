<!-- Contenidor de les notificacions -->
<template>
  <div
    class="fixed top-10 left-4 w-11/12 sm:w-full max-w-md p-2 sm:p-4 z-5 pointer-events-none"
  >
    <div class="flex flex-col items-center space-y-3">
      <transition-group
        tag="div"
        class="w-full"
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-500 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        move-class="transition-transform duration-500"
      >
        <GameNotification
          v-for="notification in notifications"
          :key="notification.id"
          :text="notification.text"
          :gif="notification.gif"
          @destroy="removeNotification(notification.id)"
          class="w-full"
        />
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useWebSocketStore } from "@/stores/websocket";
import GameNotification from "./GameNotification.vue";

const websocketStore = useWebSocketStore();
const notifications = ref([]);

// // Funció per afegir una nova notificació
const addNotification = (text, gif = null) => {
  const id = Date.now() + Math.random();
  notifications.value.unshift({ id, text, gif });
  console.log("Notifications array:", notifications.value);
};
// Funció per eliminar una notificació
const removeNotification = (id) => {
  notifications.value = notifications.value.filter((n) => n.id !== id);
};

const handleGameEvent = (payload) => {
  console.log("Game event received in NotificationCenter:", payload);
  if (payload.text) {
    addNotification(payload.text, payload.gif);
  }
};

onMounted(() => {
  websocketStore.on("GAME_EVENT", handleGameEvent);
});

onUnmounted(() => {
  websocketStore.off("GAME_EVENT", handleGameEvent);
});
</script>
