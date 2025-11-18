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
          :text="notification.id"
          :gif="notification.gif"
          @destroy="removeNotification(notification.id)"
          class="w-full"
        />
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useWebSocketStore } from '@/stores/websocket';
import GameNotification from './GameNotification.vue';

const websocketStore = useWebSocketStore();
const notifications = ref([]);

const addNotification = (text, gif = null) => {
  const id = Date.now() + Math.random();
  notifications.value.unshift({ id, text, gif });
};

const removeNotification = (id) => {
  notifications.value = notifications.value.filter((n) => n.id !== id);
};

watch(
  () => websocketStore.lastMessage,
  (newMessage) => {
    if (newMessage && newMessage.type === 'GAME_EVENT' && newMessage.payload.text) {
      addNotification(newMessage.payload.text, newMessage.payload.gif);
    }
  },
  { deep: true }
);
</script>
