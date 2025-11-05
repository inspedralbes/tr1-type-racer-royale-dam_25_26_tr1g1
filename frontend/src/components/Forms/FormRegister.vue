<template>
  <div class="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-center text-white">Registra't</h2>
    <form @submit.prevent="register" class="space-y-6">
      <!-- Step 1: Username and Email -->
      <div v-if="step === 1" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-300" for="username"
            >Nom d'usuari</label
          >
          <input
            type="text"
            placeholder="Nom d'usuari"
            class="w-full px-4 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="username"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300" for="email"
            >Email</label
          >
          <input
            type="email"
            placeholder="Email"
            class="w-full px-4 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="email"
            required
          />
        </div>
      </div>

      <!-- Step 2: Password -->
      <div v-if="step === 2" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-300" for="password"
            >Contrasenya</label
          >
          <input
            type="password"
            placeholder="Contrasenya"
            class="w-full px-4 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="password"
            required
          />
        </div>
      </div>

      <!-- Step 3: Weight and Height -->
      <div v-if="step === 3" class="space-y-4">
        <div>
          <label
            class="block text-sm font-medium text-gray-300"
            for="pesoActual"
            >Pes actual (kg)</label
          >
          <input
            type="number"
            placeholder="Pes actual (kg)"
            class="w-full px-4 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model.number="pesoActual"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300" for="altura"
            >Altura (cm)</label
          >
          <input
            type="number"
            placeholder="Altura (cm)"
            class="w-full px-4 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model.number="altura"
          />
        </div>
      </div>

      <!-- Step 4: Profile Picture -->
      <div v-if="step === 4" class="space-y-4">
        <div>
          <label
            class="block text-sm font-medium text-gray-300"
            for="foto_perfil"
            >Foto de perfil (URL)</label
          >
          <input
            type="text"
            placeholder="URL de la teva foto de perfil"
            class="w-full px-4 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="foto_perfil"
          />
        </div>
      </div>

      <!-- Navigation and Submit Buttons -->
      <div class="flex justify-between mt-4">
        <button
          type="button"
          v-if="step > 1"
          @click="prevStep"
          class="px-6 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
        >
          Anterior
        </button>
        <button
          type="button"
          v-if="step < 4"
          @click="nextStep"
          class="px-6 py-2 ml-auto text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Següent
        </button>
        <button
          type="submit"
          v-if="step === 4"
          class="px-6 py-2 ml-auto text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          :disabled="loading"
        >
          {{ loading ? "Registrant..." : "Registar" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAppStore } from "@/stores/app";

const step = ref(1);
const username = ref("");
const email = ref("");
const password = ref("");
const pesoActual = ref(null);
const altura = ref(null);
const foto_perfil = ref("");
const loading = ref(false);

const appStore = useAppStore();

const nextStep = () => {
  if (step.value < 4) {
    step.value++;
  }
};

const prevStep = () => {
  if (step.value > 1) {
    step.value--;
  }
};

const register = async () => {
  loading.value = true;
  await appStore.register(
    username.value,
    email.value,
    password.value,
    pesoActual.value,
    altura.value,
    null,
    foto_perfil.value
  );
  loading.value = false;
};
</script>
