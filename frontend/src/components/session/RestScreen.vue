<template>
  <div
    class="fixed bottom-28 left-1/2 w-11/12 max-w-md border border-gray-200 dark:border-transparent bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-900 dark:text-white rounded-xl shadow-lg z-40 transform -translate-x-1/2 transition-all duration-300"
  >
    <div class="flex items-center justify-between p-4">
      <div class="flex items-center gap-4 overflow-hidden">
        <div class="flex-shrink-0">
          <img
            v-if="nextExercise?.gif"
            :src="nextExercise.gif"
            loading="lazy"
            :alt="nextExercise.name"
            class="h-16 w-16 object-cover rounded-lg shadow-sm bg-gray-100 dark:bg-gray-700"
          />
          <div
            v-else
            class="h-16 w-16 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-400"
          >
            <i class="mdi mdi-dumbbell text-2xl"></i>
          </div>
        </div>

        <div class="min-w-0">
          <p
            class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
          >
            Següent exercici
          </p>
          <h3
            class="text-lg font-bold text-gray-900 dark:text-white truncate leading-tight"
          >
            {{ nextExercise?.name || "" }}
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  nextExercise: {
    type: Object,
    default: () => ({ name: "", gif: "" }),
  },
});
</script>
