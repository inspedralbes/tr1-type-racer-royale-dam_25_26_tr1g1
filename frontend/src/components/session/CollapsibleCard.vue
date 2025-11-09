<template>
  <div class="relative">
    <transition name="slide-fade">
      <div v-if="isOpen" class="card-content">
        <slot></slot>
      </div>
    </transition>
    <button
      @click="toggle"
      class="absolute top-0 left-0 -translate-x-full p-2 bg-gray-700 rounded-l-lg"
    >
      <i
        class="mdi"
        :class="isOpen ? 'mdi-chevron-right' : 'mdi-chevron-left'"
      ></i>
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isOpen = ref(true);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
