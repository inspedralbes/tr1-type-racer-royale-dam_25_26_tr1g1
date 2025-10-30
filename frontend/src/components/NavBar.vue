<template>
  <v-app-bar color="primary" density="compact" location="bottom"  floating>
    <!-- El primer v-spacer empuja el contenido hacia la derecha -->
    <v-spacer></v-spacer>

    <!-- Grupo de botones centrados -->
    <v-btn text>
      Social
    </v-btn>
    <v-btn text>
      Perfil
    </v-btn>
    <v-btn text>
      Buscar Sesión
    </v-btn>
    <v-btn text to="/crear-sesion">
      Crear Sesión
    </v-btn>

    <v-spacer></v-spacer>

    <v-divider vertical inset class="mx-2"></v-divider>

    <v-btn text @click="handleLogout" prepend-icon="mdi-logout">
      Cerrar Sesión
    </v-btn>


  </v-app-bar>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem('user-token');

  router.push('/login');
};
</script>