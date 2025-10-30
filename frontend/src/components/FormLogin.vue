<template>
  <v-card class="pa-4">
    <v-card-title>Login</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="login">
        <v-text-field
          v-model="username"
          label="Username"
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          required
        ></v-text-field>
        <v-btn type="submit" color="primary">Login</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
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
