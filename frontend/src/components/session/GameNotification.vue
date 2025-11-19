<!-- Notificacions -->
<template>
  <transition
    appear
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-500 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      class="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-filter backdrop-blur-sm text-gray-900 dark:text-white text-center text-lg font-semibold p-3 rounded-lg shadow-lg flex items-center justify-center space-x-2"
    >
      <img v-if="gif" :src="gif" alt="notification gif" class="h-8 w-8" />
      <p>{{ text }}</p>
    </div>
  </transition>
</template>

<script setup>
import { onMounted } from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 4000,
  },
  gif: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["destroy"]);

onMounted(() => {
  setTimeout(() => {
    emit("destroy");
  }, props.duration);
});
</script>
