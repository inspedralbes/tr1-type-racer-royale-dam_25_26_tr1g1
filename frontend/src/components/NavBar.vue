<template>
  <v-app-bar color="primary" density="compact" location="bottom" floating>
    <v-btn text> Social </v-btn>
    <v-btn text to="/perfil"> Perfil </v-btn>
    <v-btn to="/sessions"> Sesions </v-btn>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>
