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
    <v-text-field
      v-model.number="pesoObjetivo"
      label="Peso objetivo (kg)"
      type="number"
      prepend-icon="mdi-target"
    ></v-text-field>
    <v-btn type="submit" color="primary">Register</v-btn>
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
const pesoObjetivo = ref(null);

const appStore = useAppStore();

const register = () => {
  appStore.register(
    username.value,
    email.value,
    password.value,
    pesoActual.value,
    altura.value,
    pesoObjetivo.value
  );
};
</script>
