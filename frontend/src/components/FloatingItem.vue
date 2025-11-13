<template>
  <div
    class="floating-item"
    :style="itemStyle"
    @animationend="onAnimationEnd"
  >
    {{ content }}
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: '2.5rem',
  },
  color: {
    type: String,
    default: '#ffc107', // Default to golden color
  },
  duration: {
    type: String,
    default: '1.5s',
  },
  translateY: {
    type: String,
    default: '-120px',
  },
});

const emit = defineEmits(['animation-end']);

const position = ref({
  top: `${Math.random() * 70 + 15}%`,
  left: `${Math.random() * 70 + 15}%`,
});

const itemStyle = computed(() => ({
  ...position.value,
  fontSize: props.size,
  color: props.color,
  animationDuration: props.duration,
  '--translate-y': props.translateY,
}));

function onAnimationEnd() {
  emit('animation-end', props.id);
}
</script>

<style scoped>
.floating-item {
  position: absolute;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  animation: float-up ease-out forwards;
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
    transform: translateY(var(--translate-y)) scale(0.8);
  }
}
</style>
