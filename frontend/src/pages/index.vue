<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-black p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <img src="@/assets/logo.png" alt="Logo" class="h-20 mx-auto" />
      </div>

      <div
        v-if="appStore.notification.message"
        :class="[
          'p-4 mb-4 rounded-lg shadow-md text-white',
          appStore.notification.type === 'success' ? 'bg-green-500' : 'bg-red-500',
        ]"
      >
        {{ appStore.notification.message }}
        <button @click="appStore.clearNotification()" class="float-right font-bold">
          &times;
        </button>
      </div>

      <div class="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden p-6">
        <div v-if="tab === 'login'">
          <FormLogin />
        </div>

        <div v-if="tab === 'register'">
          <FormRegister />
        </div>

        <div class="flex justify-center py-4">
          <button
            v-if="!appStore.isAuthenticated"
            @click="tab = tab === 'login' ? 'register' : 'login'"
            class="text-white hover:text-blue-400 transition duration-300"
          >
            {{
              tab === "login"
                ? "¿No tens compte? Registrat"
                : "¿Ja tens compte? Inicia sessió"
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAppStore } from "@/stores/app";

import FormLogin from "@/components/Forms/FormLogin.vue";
import FormRegister from "@/components/Forms/FormRegister.vue";

const appStore = useAppStore();

onMounted(() => {
  appStore.clearUser();
});

const tab = ref("login");
</script>
