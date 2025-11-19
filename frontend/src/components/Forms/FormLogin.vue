 <!-- Formulari per iniciar sessió -->
<template>
  <div class="w-full">
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white">Inici de sessió</h2>
    <form @submit.prevent="login" class="space-y-4 mt-6">
      <div>
        <input
          type="text"
          placeholder="Nom d'usuari"
          class="w-full px-4 py-2 mt-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          v-model="username"
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Contrasenya"
          class="w-full px-4 py-2 mt-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          v-model="password"
          required
        />
      </div>
      <div>
        <button
          type="submit"
          class="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors duration-300"
          :disabled="loading"
        >
          {{ loading ? "Iniciant sessió..." : "Login" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { useAppStore } from "@/stores/app";
import { useRouter } from "vue-router";

const props = defineProps({
  initialUsername: {
    type: String,
    default: "",
  },
  initialPassword: {
    type: String,
    default: "",
  },
});

const username = ref(props.initialUsername);
const password = ref(props.initialPassword);
const loading = ref(false);

const appStore = useAppStore();
const router = useRouter();

//Funció per iniciar sessió
const login = async () => {
  loading.value = true;
  const success = await appStore.login(username.value, password.value);
  if (success) {
    router.push("/sessions");
  }
  loading.value = false;
};
</script>
