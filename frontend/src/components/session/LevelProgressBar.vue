 <!-- Barra de progrés -->
<template>
  <div class="w-full max-w-md p-4 rounded-lg shadow-lg bg-gray-800 text-white">
    <div class="flex items-center justify-between mb-2">
      <span class="font-bold text-xl text-yellow-400"
        >Nivell {{ displayLevel }}</span
      >
      <span
        v-if="leveledUp"
        class="text-lg font-bold text-green-400 animate-pulse"
        >NIVELL PUJAT!</span
      >
      <span class="font-bold text-xl text-yellow-400"
        >Nivell {{ displayLevel + 1 }}</span
      >
    </div>

    <div
      class="relative w-full h-6 bg-gray-700 rounded-full overflow-hidden border-2 border-gray-600"
    >
      <div
        class="absolute top-0 left-0 h-full bg-yellow-500 rounded-full transition-all duration-1000 ease-out"
        :style="{ width: progressWidth + '%' }"
      ></div>
      <span
        class="absolute inset-0 flex items-center justify-center text-sm font-bold text-black mix-blend-lighten"
        >{{ Math.round(progressWidth) }}%</span
      >
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  oldLevel: {
    type: Number,
    required: true,
  },
  newLevel: {
    type: Number,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
});

const displayLevel = ref(Math.floor(props.oldLevel));
const progressWidth = ref((props.oldLevel % 1) * 100);
const leveledUp = ref(false);

// Funció per animar la barra de progrés 
const animateProgressBar = () => {
  const startProgress = (props.oldLevel % 1) * 100;
  const endProgress = (props.newLevel % 1) * 100;
  const startLevel = Math.floor(props.oldLevel);
  const endLevel = Math.floor(props.newLevel);

  progressWidth.value = startProgress;
  leveledUp.value = false;

  setTimeout(() => {
    if (startLevel < endLevel) {
      //Animació quan es puja de nivell
      progressWidth.value = 100; // Omple la barra
      setTimeout(() => {
        leveledUp.value = true;
        displayLevel.value = startLevel + 1;
        progressWidth.value = 0; // Reinicia la barra
        setTimeout(() => {
          progressWidth.value = endProgress;
        }, 500);
      }, 1000); //Temps per omplir la barra
    } else {
      // Animació del progrés
      progressWidth.value = endProgress;
    }
  }, 100); // Retard per assegurar que l'estat inicial es renderitza
};

onMounted(() => {
  animateProgressBar();
});

watch(
  () => props.newLevel,
  () => {
    animateProgressBar();
  }
);
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}
</style>
