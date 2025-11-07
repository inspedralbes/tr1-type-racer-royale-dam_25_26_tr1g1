<template>
  <div class="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-lg shadow-lg p-6 text-white">
    <h2 class="text-2xl font-bold mb-4">Sala d'Espera</h2>
    <ul class="space-y-2">
      <li v-for="user in users" :key="user.id" class="flex items-center justify-between">
        <div class="flex items-center">
          <img :src="user.foto_perfil" alt="" class="w-10 h-10 rounded-full mr-4">
          <span>{{ user.username }}</span>
        </div>
        <span :class="user.ready ? 'text-green-400' : 'text-yellow-400'">
          {{ user.ready ? 'Llest' : 'Esperant...' }}
        </span>
      </li>
    </ul>
    <button
      @click="$emit('ready')"
      :disabled="isReady"
      class="mt-6 w-full py-3 px-4 rounded-lg font-bold transition duration-300 ease-in-out"
      :class="isReady ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'"
    >
      {{ isReady ? 'Esperant a la resta...' : 'Estic Llest!' }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAppStore } from '@/stores/app';

const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
});

defineEmits(['ready']);

const appStore = useAppStore();
const userId = appStore.user.id;

const isReady = computed(() => {
  const currentUser = props.users.find(user => user.id === userId);
  return currentUser ? currentUser.ready : false;
});
</script>
