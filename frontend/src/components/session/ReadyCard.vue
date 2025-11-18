<template>
  <div class="p-4 w-full max-w-md mx-auto">
    <div
      class="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-xl shadow-2xl p-4 md:p-6 text-gray-900 dark:text-white"
    >
      <h2 class="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
        Sala d'Espera
      </h2>
      <ul class="space-y-2 md:space-y-3">
        <li
          v-for="user in users"
          :key="user.userId"
          class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 p-2 md:p-3 rounded-lg"
        >
          <div class="flex items-center">
            <img
              :src="
                user.foto_perfil ||
                'https://cdn-icons-png.flaticon.com/512/847/847969.png'
              "
              alt="Foto de perfil"
              class="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 md:mr-4 border-2 border-gray-300 dark:border-gray-600"
            />
            <span class="font-medium text-sm md:text-base">{{
              user.username
            }}</span>
          </div>
          <span
            class="font-bold text-xs md:text-sm py-1 px-2 md:px-3 rounded-full"
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
        class="mt-6 md:mt-8 w-full py-2 md:py-3 px-4 rounded-lg font-bold text-base md:text-lg transition duration-300 ease-in-out transform hover:scale-105"
        :class="
          isReady
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-gray-700 dark:text-white'
            : 'bg-green-500 hover:bg-green-600 text-white'
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
const userId = appStore.userId;

const isReady = computed(() => {
  const currentUser = props.users.find((user) => user.userId === userId);
  return currentUser ? currentUser.ready : false;
});
</script>
