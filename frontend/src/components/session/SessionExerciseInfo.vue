<template>
  <div
    class="bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-70 rounded-lg shadow-xl p-2 sm:p-4 w-48 sm:w-72 text-center text-gray-900 dark:text-white"
  >
    <div class="mt-2 sm:mt-4 text-base sm:text-lg flex items-center justify-center">
      <p class="text-xl sm:text-2xl font-bold text-amber-500 dark:text-amber-400 mr-2">
        {{ currentExercise?.name }}
      </p>
      <button
        v-if="currentExercise?.gif"
        @click="showGif = !showGif"
        class="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm flex items-center justify-center"
      >
        <i :class="['mdi', showGif ? 'mdi-eye-off' : 'mdi-eye']"></i>
      </button>
    </div>

    <div v-if="currentExercise?.gif && showGif" class="my-2 sm:my-4">
      <img
        :src="currentExercise.gif"
        loading="lazy"
        :alt="currentExercise.name + ' GIF'"
        class="w-full max-w-xs mx-auto rounded shadow-lg"
      />
    </div>
    <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2">
      {{ currentExercise?.description }}
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  currentExercise: {
    type: Object,
    default: () => ({ name: "", description: "" }),
  },
});

const showGif = ref(false);
</script>
