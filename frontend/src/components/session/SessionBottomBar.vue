<template>
  <nav
    v-if="!isLeaveDialogOpen"
    class="fixed bottom-4 left-1/2 w-11/12 max-w-md bg-gray-800 bg-opacity-80 backdrop-blur-md text-white rounded-xl shadow-lg z-50"
  >
    <div v-if="showCameras" class="p-2 flex flex-col items-center">
      <h3 class="text-lg font-semibold mb-2">Selecciona una càmera</h3>
      <ul>
        <li v-for="camera in cameras" :key="camera.deviceId">
          <button @click="selectCamera(camera.deviceId)" class="w-full text-left p-2 hover:bg-gray-700">
            {{ camera.label || `Càmera ${camera.deviceId.substring(0, 6)}` }}
          </button>
        </li>
      </ul>
    </div>
    <div v-else-if="showEmojis" class="p-4 flex justify-around">
      <button v-for="emoji in emojis" :key="emoji" @click="sendReaction(emoji)" class="text-3xl transform hover:scale-125 transition-transform">
        {{ emoji }}
      </button>
    </div>
    <div v-else class="flex justify-around">
      <button @click="openLeaveDialog" class="p-4 flex flex-col items-center">
        <i class="mdi mdi-exit-to-app text-xl"></i>
        <span class="text-xs mt-1 hidden sm:block">Sortir</span>
      </button>

      <button @click="showCameras = true" class="p-4 flex flex-col items-center">
        <i class="mdi mdi-camera-flip text-xl"></i>
        <span class="text-xs mt-1 hidden sm:block">Càmera</span>
      </button>

      <button @click="showEmojis = true" class="p-4 flex flex-col items-center">
        <i class="mdi mdi-emoticon-happy text-xl"></i>
        <span class="text-xs mt-1 hidden sm:block">Emojis</span>
      </button>
    </div>
  </nav>
  <!-- Leave Session Confirmation Dialog -->
  <div
    v-if="isLeaveDialogOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
  >
    <div
      class="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-sm"
    >
      <h2 class="text-xl font-bold mb-4">Sortir de la Sessió</h2>
      <p>Estàs segur que vols sortir de la sessió?</p>
      <div class="mt-6 flex justify-end space-x-4">
        <button
          @click="isLeaveDialogOpen = false"
          class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Cancel·lar
        </button>
        <button
          @click="confirmLeave"
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  cameras: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["leave-session", "send-reaction", "camera-selected"]);

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
