<template>
  <NavBar />
  <v-main>
    <v-container>
      <h1>Bienvenido a Type Racer Royale</h1>
      <p>Usa la barra de navegación para moverte por las secciones.</p>
      <!-- Aquí podrías volver a poner el componente <Sessions /> si quieres que aparezca en la página principal -->
    </v-container>
  </v-main>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
</script>
