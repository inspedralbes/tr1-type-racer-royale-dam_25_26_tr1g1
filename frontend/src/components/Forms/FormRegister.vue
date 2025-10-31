<template>
  <h2 class="py-4">Registrat</h2>
  <v-form @submit.prevent="register">
    <v-text-field
      v-model="username"
      label="Username"
      prepend-icon="mdi-account"
      required
    ></v-text-field>
    <v-text-field
      v-model="email"
      label="Email"
      type="email"
      prepend-icon="mdi-email"
      required
    ></v-text-field>
    <v-text-field
      v-model="password"
      label="Password"
      type="password"
      prepend-icon="mdi-lock"
      required
    ></v-text-field>
    <v-text-field
      v-model.number="pesoActual"
      label="Peso actual (kg)"
      type="number"
      prepend-icon="mdi-weight-kilogram"
    ></v-text-field>
    <v-text-field
      v-model.number="altura"
      label="Altura (cm)"
      type="number"
      prepend-icon="mdi-human-male-height"
    ></v-text-field>
    <v-btn type="submit" color="primary" :loading="loading" :disabled="loading">Register</v-btn>
  </v-form>
</template>

<script setup>
import { ref } from "vue";
import { useAppStore } from "@/stores/app";

const username = ref("");
const email = ref("");
const password = ref("");
const pesoActual = ref(null);
const altura = ref(null);
const loading = ref(false);

const appStore = useAppStore();

const register = async () => {
  loading.value = true;
  await appStore.register(
    username.value,
    email.value,
    password.value,
    pesoActual.value,
    altura.value
  );
  loading.value = false;
};
</script>
