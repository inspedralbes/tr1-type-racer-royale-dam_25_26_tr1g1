<template>
  <h2 class="py-4">Inici de sessió</h2>
  <v-form @submit.prevent="login">
    <v-alert v-if="error" type="error" dense class="mb-4">{{ error }}</v-alert>
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
    <v-btn type="submit" color="primary" :loading="loading" :disabled="loading"
      >Login</v-btn
    >
  </v-form>
</template>

<script setup>
import { ref } from "vue";
import { useAppStore } from "@/stores/app";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref(null);

const appStore = useAppStore();
const router = useRouter();

const login = async () => {
  loading.value = true;
  error.value = null;
  try {
    const success = await appStore.login(username.value, password.value);
    if (success) {
      router.push("/sessions");
    } else {
      error.value = "Usuari o contrasenya incorrectes.";
    }
  } catch (e) {
    error.value = "Error en l'inici de sessió. Si us plau, intenta-ho de nou.";
  } finally {
    loading.value = false;
  }
};
</script>
