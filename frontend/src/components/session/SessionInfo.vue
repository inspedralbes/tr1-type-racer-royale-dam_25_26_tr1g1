<template>
  <div
    v-if="currentExercise"
    class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-4 shadow-lg text-center"
  >
    <h3 class="text-lg font-bold text-white mb-2">Objectiu</h3>
    <div v-if="target" class="flex items-center justify-center space-x-2">
      <span class="text-3xl font-bold text-yellow-400">{{ target.value }}</span>
      <span class="text-lg text-gray-300">{{ target.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentExercise: {
    type: Object,
    default: null,
  },
});

const target = computed(() => {
  if (!props.currentExercise) return null;
  if (props.currentExercise.repetitions) {
    return {
      value: props.currentExercise.repetitions,
      label: "repeticions",
    };
  } else if (props.currentExercise.duration_seconds) {
    return {
      value: props.currentExercise.duration_seconds,
      label: "segons",
    };
  }
  return null;
});
</script>