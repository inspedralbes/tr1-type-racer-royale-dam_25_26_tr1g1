 <!-- Compte enrere -->

<template>
  <div
    v-if="count > 0 && !showGo"
    class="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-black bg-opacity-80 dark:bg-opacity-80 z-50"
  >
    <div
      :key="count"
      class="font-extrabold select-none drop-shadow-[0_0_40px_rgba(255,255,255,0.8)] text-[clamp(6rem,20vw,18rem)] animate-pop-glow text-gray-900 dark:text-white"
    >
      {{ count }}
    </div>
  </div>

  <div v-else-if="showGo" class="fixed inset-0 bg-gray-100 dark:bg-black bg-opacity-80 dark:bg-opacity-80 z-50">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div
        class="text-gray-900 dark:text-white font-extrabold uppercase select-none drop-shadow-[0_0_80px_rgba(255,255,255,0.9)] text-[clamp(6rem,20vw,18rem)]"
      >
        GO!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const emit = defineEmits(["countdown-finished"]);
const count = ref(3);
const showGo = ref(false);
let intervalId = null;

onMounted(() => {
  intervalId = setInterval(() => {
    count.value--;
    if (count.value === 0) {
      clearInterval(intervalId);
      showGo.value = true;

      setTimeout(() => {
        showGo.value = false;
        emit("countdown-finished");
      }, 1000);
    }
  }, 1000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>

div.font-extrabold {
  font-size: clamp(6rem, 20vw, 18rem);
  line-height: 1;
}

@keyframes pop-glow {
  0% {
    transform: scale(0.5);
    opacity: 0;
    text-shadow: 0 0 40px rgba(255, 255, 255, 0.2);
  }
  40% {
    transform: scale(1.3);
    opacity: 1;
    text-shadow: 0 0 80px rgba(255, 255, 255, 0.8);
  }
  100% {
    transform: scale(1);
    opacity: 1;
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.6);
  }
}

.animate-pop-glow {
  animation: pop-glow 0.8s ease-out;
}
</style>
