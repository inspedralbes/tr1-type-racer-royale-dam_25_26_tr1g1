<template>
  <v-card>
    <v-card-title>{{ session.workout }}</v-card-title>
    <v-card-text>
      <p>Jugadors: {{ session.users.length }}</p>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="joinSession">Unir-se</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  session: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const joinSession = () => {
  console.log("Joining session:", props.session.id);
  router.push("/game");
};
</script>
