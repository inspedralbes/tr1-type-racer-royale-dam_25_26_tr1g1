<template>
  <v-bottom-navigation v-model="value" color="primary" grow location="bottom">
    <v-btn value="/social">
      <v-icon>mdi-account-group</v-icon>
      Social
    </v-btn>

    <v-btn value="/sessions">
      <v-icon>mdi-dumbbell</v-icon>
      Sessions
    </v-btn>

    <v-btn value="/perfil">
      <v-icon>mdi-account</v-icon>
      Perfil
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();

const value = computed({
  get() {
    return route.path;
  },
  set(val) {
    router.push(val);
  },
});
</script>
