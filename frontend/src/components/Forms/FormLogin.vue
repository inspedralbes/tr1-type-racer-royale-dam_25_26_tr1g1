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

const appStore = useAppStore();
const router = useRouter();

const login = async () => {
  loading.value = true;
  const success = await appStore.login(username.value, password.value);
  if (success) {
    router.push("/sessions");
  }
  loading.value = false;
};
</script>
