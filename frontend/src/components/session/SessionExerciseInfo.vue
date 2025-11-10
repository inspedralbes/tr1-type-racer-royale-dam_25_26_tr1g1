<template>
  <div
    class="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-4 w-72 text-center"
  >
    <p class="text-2xl font-bold text-amber-400">
      {{ currentExercise?.name }}
    </p>

    <div v-if="currentExercise?.gif" class="my-4">
      <img
        :src="currentExercise.gif"
        loading="lazy"
        :alt="currentExercise.name + ' GIF'"
        width="480"
        height="270"
        class="w-full max-w-xs mx-auto rounded shadow-lg"
      />
    </div>
    <p class="text-sm text-gray-300 mt-2">
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

