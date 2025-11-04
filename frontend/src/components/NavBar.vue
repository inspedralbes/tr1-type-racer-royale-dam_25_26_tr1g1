<template>
  <v-bottom-navigation
    v-model="value"
    color="primary"
    grow
    location="bottom"
    class="bg-gray-800 text-white"
  >
    <v-btn value="/social" class="text-white">
      <v-icon>mdi-account-group</v-icon>
      Social
    </v-btn>

    <v-btn value="/sessions" class="text-white">
      <v-icon>mdi-dumbbell</v-icon>
      Sessions
    </v-btn>

    <v-btn value="/perfil" class="text-white">
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
