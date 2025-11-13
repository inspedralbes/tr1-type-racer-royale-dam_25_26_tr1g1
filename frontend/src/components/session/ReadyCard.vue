<template>
  <div class="p-4 w-full max-w-md mx-auto">
    <div
      class="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-xl shadow-2xl p-6 text-white"
    >
      <h2 class="text-3xl font-bold mb-6 text-center">Sala d'Espera</h2>
      <ul class="space-y-3">
        <li
          v-for="user in users"
          :key="user.id"
          class="flex items-center justify-between bg-gray-700 bg-opacity-50 p-3 rounded-lg"
        >
          <div class="flex items-center">
            <img
              :src="user.foto_perfil"
              alt="Foto de perfil"
              class="w-12 h-12 rounded-full mr-4 border-2 border-gray-600"
            />
            <span class="font-medium">{{ user.username }}</span>
          </div>
          <span
            class="font-bold text-sm py-1 px-3 rounded-full"
            :class="{
              'bg-green-500 text-white': user.ready,
              'bg-yellow-500 text-gray-800': !user.ready,
            }"
          >
            {{ user.ready ? "Llest" : "Esperant" }}
          </span>
        </li>
      </ul>
      <button
        @click="$emit('ready')"
        :disabled="isReady"
        class="mt-8 w-full py-3 px-4 rounded-lg font-bold text-lg transition duration-300 ease-in-out transform hover:scale-105"
        :class="
          isReady
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600'
        "
      >
        {{ isReady ? "Esperant a la resta..." : "Estic Llest!" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAppStore } from "@/stores/app";

const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
});

defineEmits(["ready"]);

const appStore = useAppStore();
const userId = appStore.user.id;

const isReady = computed(() => {
  const currentUser = props.users.find((user) => user.id === userId);
  return currentUser ? currentUser.ready : false;
});
</script>
