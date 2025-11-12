<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <div
      class="relative z-10 flex items-center justify-center min-h-screen p-4"
    >
      <div class="w-full max-w-6xl mx-auto">
        <div class="grid items-center gap-8 md:grid-cols-2">
          <!-- Left Column: Branding -->
          <div class="text-center md:text-left">
            <img
              src="@/assets/logo.png"
              alt="Logo"
              class="w-32 h-32 mx-auto md:mx-0 mb-4"
            />
            <h1
              class="text-4xl font-bold tracking-tight text-white sm:text-5xl"
            >
              MUVV
            </h1>
          </div>

          <!-- Right Column: Form Card -->
          <div class="w-full max-w-md mx-auto">
            <div
              class="rounded-xl border border-gray-700 bg-gray-800/50 p-8 shadow-2xl backdrop-blur-lg"
            >
              <!-- Notification -->
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

              <!-- Form Components -->
              <div v-if="tab === 'login'">
                <FormLogin />
              </div>
              <div v-if="tab === 'register'">
                <FormRegister />
              </div>
            </div>
            <!-- Toggle Button -->
            <div class="text-center mt-6">
              <button
                @click="tab = tab === 'login' ? 'register' : 'login'"
                class="text-blue-400 hover:text-blue-300 transition duration-300"
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
</script>
