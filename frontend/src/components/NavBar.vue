<template>
  <v-app-bar color="primary" density="compact" location="bottom" floating>
    <v-btn @click="router.push('/social')"> Social </v-btn>
    <v-btn @click="router.push('/sessions')"> Sesions </v-btn>
    <v-btn @click="router.push('/perfil')"> Perfil </v-btn>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>
