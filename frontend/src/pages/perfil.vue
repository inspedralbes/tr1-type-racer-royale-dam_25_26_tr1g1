<template>
  <NavBar />
  <!-- Diàleg per editar el perfil -->
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
              Nivell: {{ Math.floor(userData.nivel) }}
            </p>
            <v-progress-linear
              :model-value="(userData.nivel % 1) * 100"
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
            </v-row>
          </v-card-text>

          <v-card-actions class="pa-4">
            <v-btn @click="openEditDialog" color="primary" block variant="tonal"
              >Editar perfil</v-btn
            >
          </v-card-actions>

          <v-card-actions class="pa-4">
            <v-btn @click="handleLogout" color="red" block variant="tonal"
              >Tancar Sessió</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- EDICIÓ PERFIL -->
    <v-dialog v-model="isEditDialogOpen" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Editar Perfil</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Nom d'usuari"
                  v-model="editableUserData.username"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Email"
                  v-model="editableUserData.email"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Pes (kg)"
                  v-model="editableUserData.pesoActual"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Altura (cm)"
                  v-model="editableUserData.altura"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" text @click="isEditDialogOpen = false"
            >Cancel·lar</v-btn
          >
          <v-btn color="blue-darken-1" text @click="handleUpdateProfile"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import NavBar from "@/components/NavBar.vue";

const router = useRouter();
const appStore = useAppStore();

const userData = computed(() => appStore.user);
const isEditDialogOpen = ref(false);
const editableUserData = reactive({
  username: null,
  email: null,
  pesoActual: null,
  altura: null,
});

onMounted(() => {
  if (!appStore.isAuthenticated) {
    router.push("/");
  }
});

const openEditDialog = () => {
  if (userData.value) {
    editableUserData.username = userData.value.username;
    editableUserData.email = userData.value.email;
    editableUserData.pesoActual = userData.value.pesoActual;
    editableUserData.altura = userData.value.altura;
  }
  isEditDialogOpen.value = true;
};

const handleUpdateProfile = async () => {
  try {
    await appStore.updateUser(editableUserData);
    isEditDialogOpen.value = false;
  } catch (error) {
    console.error("Error en actualitzar el perfil:", error);
    // Aquí podries mostrar un missatge d'error a l'usuari
  }
};

const handleLogout = () => {
  appStore.setLoggedOut();
  router.push("/");
};
</script>

<style scoped></style>
