<template>
  <div
    class="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-2 sm:p-4 w-48 sm:w-72 text-center"
  >
    <div class="mt-2 sm:mt-4 text-base sm:text-lg">
      <p class="text-xl sm:text-2xl font-bold text-amber-400">
        {{ currentExercise?.name }}
      </p>
    </div>

    <div v-if="currentExercise?.gif" class="my-2 sm:my-4">
      <img
        :src="currentExercise.gif"
        loading="lazy"
        :alt="currentExercise.name + ' GIF'"
        class="w-full max-w-xs mx-auto rounded shadow-lg"
      />
    </div>
    <p class="text-xs sm:text-sm text-gray-300 mt-2">
      {{ currentExercise?.description }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  currentExercise: {
    type: Object,
    default: () => ({ name: "", description: "" }),
  },
});
</script>
