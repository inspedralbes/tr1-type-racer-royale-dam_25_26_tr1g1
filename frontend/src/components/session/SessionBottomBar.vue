  <!-- Barra de navegació -->
<template>
  <nav
    class="fixed bottom-4 left-1/2 w-11/12 max-w-md border border-gray-200 dark:border-transparent bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-900 dark:text-white rounded-xl shadow-lg z-50 bottom-bar transform -translate-x-1/2"
  >
   <!-- Llista de càmeres disponibles -->
    <div v-if="showCameras" class="p-2 flex flex-col items-center">
      <h3 class="text-lg font-semibold mb-2">Selecciona una càmera</h3>
      <ul>
        <li v-for="camera in cameras" :key="camera.deviceId">
          <button
            @touchstart.stop.prevent="selectCamera(camera.deviceId)"
            @click.stop="selectCamera(camera.deviceId)"
            class="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {{ camera.label || `Càmera ${camera.deviceId.substring(0, 6)}` }}
          </button>
        </li>
      </ul>
    </div>
  <!-- Emojis per enviar reaccions -->
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
       <!-- Botó per sortir de la sessió -->
      <button
        @touchstart.stop.prevent="openLeaveDialog"
        @click.stop="openLeaveDialog"
        class="p-4 flex flex-col items-center"
      >
        <i class="mdi mdi-exit-to-app text-xl"></i>
        <span class="text-xs mt-1 hidden sm:block">Sortir</span>
      </button>
     <!-- Botó per mostrar càmeres disponibles -->
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
  <!-- Diàleg de confirmació per sortir de la sessió -->
  <div
    v-if="isLeaveDialogOpen"
    class="fixed inset-0 bg-gray-100 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50"
    @click.self="isLeaveDialogOpen = false"
  >
    <div
      class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-lg shadow-2xl max-w-sm w-full mx-4"
    >
      <h3 class="text-xl font-bold mb-4">Segur que vols sortir?</h3>
      <p class="mb-6">Aquesta acció finalitzarà la teva sessió actual.</p>
      <div class="flex justify-end space-x-3">
        <button
          @click="isLeaveDialogOpen = false"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-150"
        >
          Cancel·lar
        </button>
        <button
          @click="confirmLeave"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150"
        >
          Sortir
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

// Funció seleccionar una càmera
const selectCamera = (deviceId) => {
  emit("camera-selected", deviceId);
  showCameras.value = false;
};
// Funció per enviar una reacció
const sendReaction = (emoji) => {
  emit("send-reaction", emoji);
  showEmojis.value = false;
};
// Funció per confirmació de sortida
const openLeaveDialog = () => {
  isLeaveDialogOpen.value = true;
};
// Funció per confirmar sortida
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
