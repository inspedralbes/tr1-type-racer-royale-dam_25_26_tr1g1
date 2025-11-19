<template>
  <div class="w-56 sm:w-80 md:w-96 transition-all duration-300">
    <div class="flex flex-col items-start space-y-1 sm:space-y-2">
      <transition-group
        tag="div"
        class="w-full flex flex-col items-start"
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 -translate-x-4"
        enter-to-class="opacity-100 translate-x-0"
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
          class="w-full origin-top-left transform scale-75 sm:scale-100 transition-transform"
        />
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useAppStore } from "@/stores/app";
import GameNotification from "./GameNotification.vue";

const appStore = useAppStore();
const notifications = ref([]);

const addNotification = (text, gif = null) => {
  const id = Date.now() + Math.random();
  notifications.value.unshift({ id, text, gif });
};

const removeNotification = (id) => {
  notifications.value = notifications.value.filter((n) => n.id !== id);
};

watch(
  () => appStore.lastGameEvent,
  (newEvent) => {
    if (newEvent && newEvent.text) {
      addNotification(newEvent.text, newEvent.gif);
    }
  },
  { deep: true }
);
</script>
