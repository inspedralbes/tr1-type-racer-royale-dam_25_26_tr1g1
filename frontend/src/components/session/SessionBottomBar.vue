<template>
  <nav
    class="fixed bottom-4 left-1/2 w-11/12 max-w-md bg-gray-800 bg-opacity-80 backdrop-blur-md text-white rounded-xl shadow-lg z-50 bottom-bar transform -translate-x-1/2"
  >
    <div v-if="showCameras" class="p-2 flex flex-col items-center">
      <h3 class="text-lg font-semibold mb-2">Selecciona una càmera</h3>
      <ul>
        <li v-for="camera in cameras" :key="camera.deviceId">
          <button
            @touchstart.stop.prevent="selectCamera(camera.deviceId)"
            @click.stop="selectCamera(camera.deviceId)"
            class="w-full text-left p-2 hover:bg-gray-700"
          >
            {{ camera.label || `Càmera ${camera.deviceId.substring(0, 6)}` }}
          </button>
        </li>
      </ul>
    </div>

    <div v-else-if="showEmojis" class="p-4 flex justify-around">
      <button
        v-for="emoji in emojis"
        :key="emoji"
        @touchstart.stop.prevent="sendReaction(emoji)"
        @click.stop="sendReaction(emoji)"
        class="text-3xl transform hover:scale-125 transition-transform"
      >
        {{ emoji }}
      </button>
    </div>

    <div v-else class="flex justify-around">
      <button
        @touchstart.stop.prevent="openLeaveDialog"
        @click.stop="openLeaveDialog"
        class="p-4 flex flex-col items-center"
      >
        <i class="mdi mdi-exit-to-app text-xl"></i>
        <span class="text-xs mt-1 hidden sm:block">Sortir</span>
      </button>

      <button
        @touchstart.stop.prevent="showCameras = true"
        @click.stop="showCameras = true"
        class="p-4 flex flex-col items-center"
      >
        <i class="mdi mdi-camera-flip text-xl"></i>
        <span class="text-xs mt-1 hidden sm:block">Càmera</span>
      </button>

      <button
        @touchstart.stop.prevent="$emit('toggle-info')"
        @click.stop="$emit('toggle-info')"
        class="p-4 flex flex-col items-center"
      >
        <i class="mdi mdi-gymnastics text-xl"></i>
        <span class="text-xs mt-1 hidden sm:block">Detalles</span>
      </button>

      <button
        @touchstart.stop.prevent="showEmojis = true"
        @click.stop="showEmojis = true"
        class="p-4 flex flex-col items-center"
      >
        <i class="mdi mdi-emoticon-happy text-xl"></i>
        <span class="text-xs mt-1 hidden sm:block">Emojis</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  cameras: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  "leave-session",
  "send-reaction",
  "camera-selected",
  "toggle-info",
  "toggleScoreboard",
]);

const showCameras = ref(false);
const showEmojis = ref(false);
const emojis = ["👍", "❤️", "🎉", "😂", "🔥"];
const isLeaveDialogOpen = ref(false);

const selectCamera = (deviceId) => {
  emit("camera-selected", deviceId);
  showCameras.value = false;
};

const sendReaction = (emoji) => {
  emit("send-reaction", emoji);
  showEmojis.value = false;
};

const openLeaveDialog = () => {
  isLeaveDialogOpen.value = true;
};

const confirmLeave = () => {
  emit("leave-session");
  isLeaveDialogOpen.value = false;
};
</script>

<style scoped>
nav {
  transform: translateX(-50%);
}
</style>