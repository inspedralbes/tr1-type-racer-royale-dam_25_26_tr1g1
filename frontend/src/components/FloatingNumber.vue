<template>
  <div class="floating-number" :style="position" @animationend="onAnimationEnd">
    {{ value }}
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  value: {
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
.floating-number {
  position: absolute;
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffc107; /* A nice golden color */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  animation: float-up 1.5s ease-out forwards;
  pointer-events: none;
  user-select: none;
  z-index: 10;
}

@keyframes float-up {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-120px) scale(0.8);
  }
}
</style>
