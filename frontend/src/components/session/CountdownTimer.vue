<template>
  <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
    <div class="text-9xl font-bold text-white">
      {{ count }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['countdown-finished']);

const count = ref(5);
let intervalId = null;

onMounted(() => {
  intervalId = setInterval(() => {
    count.value--;
    if (count.value === 0) {
      clearInterval(intervalId);
      emit('countdown-finished');
    }
  }, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>
