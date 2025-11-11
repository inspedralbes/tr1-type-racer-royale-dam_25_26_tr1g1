<template>
  <transition name="fade-zoom">
    <!-- Contador -->
    <div
      v-if="count > 0 && !showGo"
      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md z-50"
    >
      <div
        :key="count"
        class="font-extrabold select-none drop-shadow-[0_0_40px_rgba(255,255,255,0.8)] text-[clamp(6rem,20vw,18rem)] animate-pop-glow text-white"
      >
        {{ count }}
      </div>
    </div>

    <!-- GO! -->
    <div
      v-else-if="showGo"
      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md z-50"
    >
      <div
        class="text-white font-extrabold uppercase select-none animate-go-explode drop-shadow-[0_0_80px_rgba(255,255,255,0.9)]"
      >
        GO!
      </div>
    </div>
  </transition>
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

@keyframes go-explode {
  0% {
    transform: scale(0);
    opacity: 0;
    text-shadow: 0 0 0 rgba(255, 255, 255, 0);
  }
  40% {
    transform: scale(1.4);
    opacity: 1;
    text-shadow: 0 0 100px rgba(255, 255, 255, 0.9);
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
    text-shadow: 0 0 0 rgba(255, 255, 255, 0);
  }
}

.animate-go-explode {
  animation: go-explode 1s ease-out forwards;
}

.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.5s ease;
}

.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
