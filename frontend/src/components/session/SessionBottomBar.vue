<template>
  <nav
    class="fixed bottom-4 left-1/2 w-11/12 max-w-md bg-gray-800 bg-opacity-80 backdrop-blur-md text-white rounded-xl shadow-lg z-50 bottom-bar"
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
    <div v-else class="flex justify-around">
      <button @click="$emit('leave-session')" class="p-4 flex flex-col items-center">
        <i class="mdi mdi-exit-to-app text-xl"></i>
        <span class="text-xs mt-1 hidden sm:block">Sortir</span>
      </button>

      <button @click="showCameras = true" class="p-4 flex flex-col items-center">
        <i class="mdi mdi-camera-flip text-xl"></i>
        <span class="text-xs mt-1 hidden sm:block">Càmera</span>
      </button>

      <button @click="$emit('show-emojis')" class="p-4 flex flex-col items-center">
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

const emit = defineEmits(["leave-session", "show-emojis", "camera-selected"]);

const showCameras = ref(false);

const selectCamera = (deviceId) => {
  emit("camera-selected", deviceId);
  showCameras.value = false;
};
</script>
