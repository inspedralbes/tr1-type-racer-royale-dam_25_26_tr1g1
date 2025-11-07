<template>
  <div
    class="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-4 w-72 text-center"
  >
    <p class="text-2xl font-bold text-amber-400">
      {{ currentExercise?.name }}
    </p>
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

