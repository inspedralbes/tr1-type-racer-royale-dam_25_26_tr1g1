<template>
  <div
    class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-5 w-44 sm:w-64 text-center text-gray-900 dark:text-white transition-all duration-300"
  >
    <div class="flex justify-center mb-2 sm:mb-4">
      <div
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border"
        :class="
          isResting
            ? 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
            : 'bg-green-100 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
        "
      >
        <span
          class="w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse"
          :class="isResting ? 'bg-red-500' : 'bg-green-500'"
        ></span>
        {{ isResting ? "Descans" : "A Entrenar" }}
      </div>
    </div>

    <div class="mb-3 sm:mb-5">
      <p
        class="text-4xl sm:text-5xl font-bold tracking-tight tabular-nums leading-none"
      >
        {{ formattedTime }}
      </p>
    </div>

    <div
      class="grid grid-cols-2 gap-2 border-t border-gray-200 dark:border-gray-700 pt-2 sm:pt-3"
    >
      <div class="flex flex-col">
        <span
          class="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold"
          >Reps</span
        >
        <span class="text-base sm:text-lg font-bold leading-tight">{{
          repetitions
        }}</span>
      </div>

      <div class="flex flex-col border-l border-gray-200 dark:border-gray-700">
        <span
          class="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold"
          >Serie</span
        >
        <span class="text-base sm:text-lg font-bold leading-tight">
          {{ currentSerie
          }}<span class="text-gray-400 text-xs font-normal"
            >/{{ totalSeries }}</span
          >
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  timer: { type: Number, required: true },
  isResting: { type: Boolean, required: true },
  repetitions: { type: Number, required: true },
  currentSerie: { type: Number, required: true },
  totalSeries: { type: Number, required: true },
});

const formattedTime = computed(() => {
  const minutes = Math.floor(props.timer / 60);
  const seconds = props.timer % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
});
</script>
