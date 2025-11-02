<template>
  <NavBar />
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card v-if="userData">
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Perfil d'Usuari</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="text-center">
            <v-avatar size="120" class="my-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                alt="Avatar"
              />
            </v-avatar>
            <h2 class="text-h5 font-weight-bold">{{ userData.username }}</h2>
            <p class="text-subtitle-1 text-grey-darken-1">
              Nivell: {{ Math.floor(userData.puntos) }}
            </p>
            <v-progress-linear
              :model-value="(userData.puntos % 1) * 100"
              color="primary"
              height="10"
              rounded
              class="mt-2"
            ></v-progress-linear>
          </v-card-text>

          <v-list lines="two">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon>mdi-email</v-icon>
              </template>
              <v-list-item-title>{{ userData.email }}</v-list-item-title>
              <v-list-item-subtitle>Email</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon>mdi-calendar</v-icon>
              </template>
              <v-list-item-title>{{
                new Date(userData.date_created).toLocaleDateString()
              }}</v-list-item-title>
              <v-list-item-subtitle>Membre des de</v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-card-text>
            <v-row>
              <v-col class="text-center">
                <p class="text-subtitle-2 text-grey">PES ACTUAL</p>
                <p class="text-h6">{{ userData.pesoActual || "-" }} kg</p>
              </v-col>
              <v-col class="text-center">
                <p class="text-subtitle-2 text-grey">ALTURA</p>
                <p class="text-h6">{{ userData.altura || "-" }} cm</p>
              </v-col>
              <v-col class="text-center">
                <p class="text-subtitle-2 text-grey">PES OBJECTIU</p>
                <p class="text-h6">{{ userData.pesoMeta || "-" }} kg</p>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions class="pa-4">
            <v-btn @click="handleLogout" color="red" block variant="tonal"
              >Tancar Sessió</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import NavBar from "@/components/NavBar.vue";

const router = useRouter();
const appStore = useAppStore();

const userData = computed(() => appStore.user);

onMounted(() => {
  if (!appStore.isAuthenticated) {
    router.push("/");
  }
});

const handleLogout = () => {
  appStore.setLoggedOut();
  router.push("/");
};
</script>

<style scoped></style>
