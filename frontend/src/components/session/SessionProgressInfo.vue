<template>
  <div
    class="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-2 sm:p-4 w-48 sm:w-72 text-center"
  >
    <div class="mt-2 sm:mt-4 text-base sm:text-lg">
      <p v-if="isResting" class="text-red-400 font-semibold">Descansando...</p>
      <p v-else class="text-green-400 font-semibold">¡A entrenar!</p>
      <p class="text-3xl sm:text-4xl font-bold mt-2">{{ formattedTime }}</p>
    </div>

    <div class="mt-2 sm:mt-4 text-base sm:text-lg">
      <p>Repeticiones: <span class="font-bold">{{ repetitions }}</span></p>
      <p>Serie: <span class="font-bold">{{ currentSerie }} / {{ totalSeries }}</span></p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  timer: {
    type: Number,
    required: true,
  },
  isResting: {
    type: Boolean,
    required: true,
  },
  currentTimerType: {
    type: String,
    required: true,
  },
  repetitions: {
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

const formattedTime = computed(() => {
  const minutes = Math.floor(props.timer / 60);
  const seconds = props.timer % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});
</script>