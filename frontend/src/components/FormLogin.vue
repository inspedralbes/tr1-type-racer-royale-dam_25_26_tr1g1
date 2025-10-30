<template>
  <h2 class="py-4">Inici de sessió</h2>
  <v-form @submit.prevent="login">
    <v-text-field
      v-model="username"
      label="Username"
      prepend-icon="mdi-account"
      required
    ></v-text-field>
    <v-text-field
      v-model="password"
      label="Password"
      type="password"
      prepend-icon="mdi-lock"
      required
    ></v-text-field>
    <v-btn type="submit" color="primary">Login</v-btn>
  </v-form>
</template>

<script setup>
import { ref } from "vue";
import { useAppStore } from "@/stores/app";

const username = ref("");
const password = ref("");

const appStore = useAppStore();

const login = () => {
  appStore.login(username.value, password.value);
};
</script>
