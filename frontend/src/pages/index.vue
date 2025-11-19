<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
  >
    <div
      class="relative z-10 flex items-center justify-center min-h-screen p-4"
    >
      <div class="w-full max-w-6xl mx-auto">
        <div class="grid items-center gap-8 md:grid-cols-2">
          
          <!-- Logo i títol -->
          <div class="text-center md:text-left">
            <img
              src="@/assets/logo.png"
              alt="Logo"
              class="w-32 h-32 mx-auto md:mx-0 mb-4"
            />
            <h1
              class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl"
            >
              MUVV
            </h1>
          </div>

          <!-- Secció dreta: Formulari de login o registre -->
          <div class="w-full max-w-md mx-auto">
            <div
              v-if="appStore.notification.message"
              :class="[
                'p-4 mb-4 rounded-lg shadow-md text-white',
                appStore.notification.type === 'success'
                  ? 'bg-green-500/80'
                  : 'bg-red-500/80',
              ]"
            >
              {{ appStore.notification.message }}
              <button
                @click="appStore.clearNotification()"
                class="float-right font-bold"
              >
                &times;
              </button>
            </div>
            <div
              class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-8 shadow-2xl backdrop-blur-lg"
            >
              <!-- Formulari de login -->
              <div v-if="tab === 'login'">
                <FormLogin
                  :initialUsername="loginUsername"
                  :initialPassword="loginPassword"
                />
              </div>
              <!-- Formulari de registre -->
              <div v-if="tab === 'register'">
                <FormRegister @registration-successful="handleRegistration" />
              </div>
            </div>
            <!-- Botó per alternar entre Login i Registre -->
            <div class="text-center mt-6">
              <button
                @click="tab = tab === 'login' ? 'register' : 'login'"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition duration-300"
              >
                {{
                  tab === "login"
                    ? "¿No tens compte? Registra't"
                    : "¿Ja tens compte? Inicia sessió"
                }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAppStore } from "@/stores/app";

import FormLogin from "@/components/Forms/FormLogin.vue";
import FormRegister from "@/components/Forms/FormRegister.vue";

const appStore = useAppStore();

const tab = ref("login");
const loginUsername = ref("");
const loginPassword = ref("");

// Funció que s'executa quan el registre és exitós
const handleRegistration = (credentials) => {
  loginUsername.value = credentials.username;
  loginPassword.value = credentials.password;
  tab.value = "login";
};
</script>
