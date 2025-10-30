<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Iniciar Sesión</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="username"
                label="Usuario"
                name="login"
                prepend-icon="mdi-account"
                type="text"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Contraseña"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                required
              ></v-text-field>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" color="primary">Entrar</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = () => {
  // Aquí iría la lógica de autenticación real.
  // Por ahora, simplemente navegamos a la página principal.
  console.log('Iniciando sesión con:', username.value);
  // Simulamos que el login es correcto guardando un token falso.
  localStorage.setItem('user-token', '12345');
  router.push('/');
};
</script>