<template>
  <div
    class="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-black bg-opacity-90 dark:bg-opacity-90 backdrop-blur-lg p-4"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 text-center text-gray-900 dark:text-white max-w-md w-full"
    >
      <h2
        class="text-4xl sm:text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-4"
      >
        ¡Prepárate!
      </h2>

      <div class="mb-6">
        <p class="text-2xl sm:text-3xl font-bold mb-2">
          Siguiente ejercicio: {{ nextExercise?.name }}
        </p>
        <img
          v-if="nextExercise?.gif"
          :src="nextExercise.gif"
          loading="lazy"
          :alt="nextExercise.name + ' GIF'"
          class="w-full max-w-xs mx-auto rounded shadow-lg mt-4"
        />
      </div>

      <p class="text-xl sm:text-2xl font-semibold mb-2">
        Tiempo restante:
        <span class="text-blue-500 dark:text-blue-300">{{
          formattedRestTime
        }}</span>
      </p>
      <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
        Serie {{ currentSerie }} de {{ totalSeries }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  nextExercise: {
    type: Object,
    default: () => ({ name: "", description: "", gif: "" }),
  },
  remainingRestTime: {
    type: Number,
    required: true,
  },
  currentSerie: {
    type: Number,
    required: true,
  },
  totalSeries: {
    type: Number,
    required: true,
  },
});

const formattedRestTime = computed(() => {
  const minutes = Math.floor(props.remainingRestTime / 60);
  const seconds = props.remainingRestTime % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
});
</script>

<style scoped>
/* Add any specific styles for the card or centering if needed */
</style>
