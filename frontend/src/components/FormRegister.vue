<template>
  <v-card class="pa-4">
    <v-card-title>Register</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="register">
        <v-text-field
          v-model="username"
          label="Username"
          required
        ></v-text-field>
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          required
        ></v-text-field>
        <v-btn type="submit" color="primary">Register</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
import { useAppStore } from "@/stores/app";

const username = ref("");
const email = ref("");
const password = ref("");

const appStore = useAppStore();

const register = () => {
  appStore.register(username.value, email.value, password.value);
};
</script>
