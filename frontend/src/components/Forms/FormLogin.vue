<template>
  <div class="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-center text-white">Inici de sessió</h2>
    <form @submit.prevent="login" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-300" for="username"
          >Username</label
        >
        <input
          type="text"
          placeholder="Username"
          class="w-full px-4 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          v-model="username"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-300" for="password"
          >Password</label
        >
        <input
          type="password"
          placeholder="Password"
          class="w-full px-4 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          v-model="password"
          required
        />
      </div>
      <div>
        <button
          type="submit"
          class="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors duration-300"
          :disabled="loading"
        >
          {{ loading ? "Iniciant sessió..." : "Login" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAppStore } from "@/stores/app";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const loading = ref(false);

const appStore = useAppStore();
const router = useRouter();

const login = async () => {
  loading.value = true;
  const success = await appStore.login(username.value, password.value);
  if (success) {
    router.push("/sessions");
  }
  loading.value = false;
};
</script>
