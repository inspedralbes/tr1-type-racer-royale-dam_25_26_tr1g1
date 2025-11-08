<template>
  <div class="floating-emoji" :style="position" @animationend="onAnimationEnd">
    {{ emoji }}
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  emoji: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  }
});

const emit = defineEmits(['animation-end']);

const position = ref({
  top: `${Math.random() * 70 + 15}%`,
  left: `${Math.random() * 70 + 15}%`,
});

function onAnimationEnd() {
  emit('animation-end', props.id);
}
</script>

<style scoped>
.floating-emoji {
  position: absolute;
  font-size: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  animation: float-up 2s ease-out forwards;
  pointer-events: none;
  user-select: none;
  z-index: 100;
}

@keyframes float-up {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-150px) scale(0.8);
  }
}
</style>
