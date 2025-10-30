<template>
  <NavBar />

  <v-card class="text-center">
    <v-card-text>
      <v-avatar size="120" class="mb-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
          alt="Avatar"
        />
      </v-avatar>
      <h2 class="text-h5 font-weight-bold">{{ appStore.username }}</h2>
      <p class="text-subtitle-1 text-grey-darken-1">PUNTS: {{ puntos }}</p>

      <v-divider class="my-4"></v-divider>

      <v-row>
        <v-col>
          <p class="text-subtitle-2 text-grey">PES ACTUAL</p>
          <p class="text-h6">{{ pesoActual }} kg</p>
        </v-col>
        <v-col>
          <p class="text-subtitle-2 text-grey">ALTURA</p>
          <p class="text-h6">{{ altura }} cm</p>
        </v-col>
        <v-col>
          <p class="text-subtitle-2 text-grey">META PES</p>
          <p class="text-h6">{{ pesoMeta }} kg</p>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="d-flex flex-column ga-2 pa-4">
      <v-btn @click="verHistorial" block variant="outlined"
        >Historial d'Entrenaments</v-btn
      >
      <v-btn @click="handleLogout" color="red" block variant="outlined"
        >Tancar Sessió</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
const appStore = useAppStore();
</script>
