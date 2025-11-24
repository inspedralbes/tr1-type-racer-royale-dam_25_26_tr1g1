 <!-- Formulari de registre -->
<template>
  <div class="w-full">
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white">Registra't</h2>
    <form @submit.prevent="register" class="space-y-6 mt-4">
      
     <!-- PAS 1: Credencials bàsiques de registre -->
      <div v-if="step === 1" class="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Nom d'usuari"
            class="w-full px-4 py-2 mt-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="username"
            required
          />
          <span v-if="usernameError" class="text-red-500 text-sm">{{ usernameError }}</span>
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            class="w-full px-4 py-2 mt-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="email"
            required
          />
          <span v-if="emailError" class="text-red-500 text-sm">{{ emailError }}</span>
        </div>
        <div>
          <input
            type="password"
            placeholder="Contrasenya"
            class="w-full px-4 py-2 mt-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="password"
            required
          />
          <span v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</span>
        </div>
      </div>

     <!-- PAS 2: Informació opcional del perfil -->
      <div v-if="step === 2" class="space-y-4">
        <div>
          <input
            type="text"
            placeholder="URL de la teva foto de perfil"
            class="w-full px-4 py-2 mt-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="foto_perfil"
          />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              for="pesoActual"
              >Pes actual (kg): {{ pesoActual || 0 }} kg</label
            >
            <input
              type="range"
              id="pesoActual"
              min="0"
              max="200"
              v-model="pesoActual"
              class="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="altura"
              >Altura (cm): {{ altura || 0 }} cm</label
            >
            <input
              type="range"
              id="altura"
              min="0"
              max="250"
              v-model="altura"
              class="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

       <!-- Botons de navegació -->
      <div class="flex justify-between mt-4">
        <button
          type="button"
          v-if="step > 1"
          @click="prevStep"
          class="px-6 py-2 text-gray-900 dark:text-white bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700"
        >
          Anterior
        </button>
        <button
          type="button"
          v-if="step < 2"
          @click="nextStep"
          class="px-6 py-2 ml-auto text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Següent
        </button>
        <button
          type="submit"
          v-if="step === 2"
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
import { ref, defineEmits } from "vue";
import { useAppStore } from "@/stores/app";

const emit = defineEmits(["registration-successful"]);

const step = ref(1);
const username = ref("");
const email = ref("");
const password = ref("");
const pesoActual = ref(0);
const altura = ref(0);
const foto_perfil = ref("");
const loading = ref(false);

const usernameError = ref("");
const emailError = ref("");
const passwordError = ref("");

const appStore = useAppStore();

const validateUsername = () => {
  usernameError.value = "";
  if (!username.value) {
    usernameError.value = "El nom d'usuari és obligatori.";
    return false;
  }
  if (username.value.length > 20) {
    usernameError.value = "El nom d'usuari no pot tenir més de 20 caràcters.";
    return false;
  }
  const specialChars = /[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (specialChars.test(username.value)) {
    usernameError.value = "El nom d'usuari no pot contenir caràcters especials.";
    return false;
  }
  return true;
};

const validateEmail = () => {
  emailError.value = "";
  if (!email.value) {
    emailError.value = "L'email és obligatori.";
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    emailError.value = "El format de l'email no és vàlid.";
    return false;
  }
  return true;
};

const validatePassword = () => {
  passwordError.value = "";
  if (!password.value) {
    passwordError.value = "La contrasenya és obligatòria.";
    return false;
  }
  if (password.value.length < 8) {
    passwordError.value = "La contrasenya ha de tenir almenys 8 caràcters.";
    return false;
  }
  if (!/[A-Z]/.test(password.value)) {
    passwordError.value = "La contrasenya ha de contenir almenys una lletra majúscula.";
    return false;
  }
  if (!/\d/.test(password.value)) {
    passwordError.value = "La contrasenya ha de contenir almenys un número.";
    return false;
  }
  return true;
};

// Funció per avançar al següent pas
const nextStep = () => {
  if (step.value === 1) {
    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    if (isUsernameValid && isEmailValid && isPasswordValid) {
      step.value++;
    }
  } else if (step.value < 2) {
    step.value++;
  }
};
// Funció per tornar a l'anterior pas
const prevStep = () => {
  if (step.value > 1) {
    step.value--;
  }
};
// Funció per registrar l'usuari
const register = async () => {
  loading.value = true;
  const weight = Number(pesoActual.value);
  const height = Number(altura.value);

  const success = await appStore.register(
    username.value,
    email.value,
    password.value,
    weight,
    height,
    null, // No hi ha biografia
    foto_perfil.value
  );
  loading.value = false;
  if (success) {
    emit("registration-successful", {
      username: username.value,
      password: password.value,
    });
  }
};
</script>
