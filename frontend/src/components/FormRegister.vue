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
    <v-btn type="submit" color="primary">Register</v-btn>
  </v-form>
</template>

<script setup>
import { ref } from "vue";
import { useAppStore } from "@/stores/app";

const username = ref("");
const email = ref("");
const password = ref("");

const appStore = useAppStore();

const register = async () => {
  const success = await appStore.register(
    username.value,
    email.value,
    password.value
  );
  if (success) {
    window.location.href = "/";
  }
};
</script>
