<template>
  <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
    <transition name="scale" mode="out-in">
      <div :key="count" class="text-9xl font-bold text-white" style="font-size: 20rem;">
        {{ count }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['countdown-finished']);

const count = ref(5);
let intervalId = null;

onMounted(() => {
  if (count.value > 0) {
    intervalId = setInterval(() => {
      count.value--;
      if (count.value === 0) {
        clearInterval(intervalId);
        // Add a small delay before finishing to allow the '1' to be seen
        setTimeout(() => emit('countdown-finished'), 500);
      }
    }, 1000);
  } else {
    emit('countdown-finished');
  }
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.5s ease;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(1.2);
}
</style>
