<template>
  <div
    class="w-full bg-gray-800 bg-opacity-70 p-4 shadow-lg flex justify-between items-center"
  >
    <h1 class="text-xl font-bold">{{ currentSession?.name }}</h1>
    <div class="flex items-center space-x-4">
      <div class="text-center">
        <p class="text-xs text-gray-400">Temps total</p>
        <p class="text-3xl font-extrabold text-blue-400">
          {{ formattedTime }}
        </p>
      </div>
      <button
        @click="$emit('toggleInfoExercices')"
        class="p-2 rounded-full bg-blue-500 text-white self-center"
      >
        <i class="mdi mdi-gymnastics text-2xl"></i>
      </button>
      <button
        @click="$emit('toggleScoreboard')"
        class="p-2 rounded-full bg-blue-500 text-white self-center"
      >
        <i class="mdi mdi-trophy text-2xl"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  currentSession: {
    type: Object,
    default: () => ({}),
  },
});

defineEmits(["toggleInfoExercices", "toggleScoreboard"]);

const now = ref(Date.now());
let timerInterval = null;

const formattedTime = computed(() => {
  if (!props.currentSession?.state?.startTime) {
    return "00:00";
  }
  const duration = Math.floor(
    (now.value - props.currentSession.state.startTime) / 1000
  );
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
});

onMounted(() => {
  timerInterval = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>
