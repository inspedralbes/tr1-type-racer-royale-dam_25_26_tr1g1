<template>
  <v-bottom-navigation v-model="value" color="primary" grow location="bottom">
    <v-btn @click="router.push('/social')">
      <v-icon>mdi-account-group</v-icon>
      Social
    </v-btn>

    <v-btn @click="router.push('/sessions')">
      <v-icon>mdi-dumbbell</v-icon>
      Sessions
    </v-btn>

    <v-btn @click="router.push('/perfil')">
      <v-icon>mdi-account</v-icon>
      Perfil
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
// El script es exactamente el mismo
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const value = ref(1);
</script>
