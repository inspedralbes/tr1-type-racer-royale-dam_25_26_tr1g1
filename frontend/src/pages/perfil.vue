<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <NavBar />
    <div class="container mx-auto p-4">
      <div class="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div v-if="userData">
          <div class="p-6">
            <div class="text-center mb-6">
              <v-avatar size="120" class="mb-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="Avatar"
                />
              </v-avatar>
              <h2 class="text-3xl font-bold">{{ userData.username }}</h2>
              <p class="text-md text-gray-400">
                Nivell: {{ Math.floor(userData.nivel) }}
              </p>
              <v-progress-linear
                :model-value="(userData.nivel % 1) * 100"
                color="primary"
                height="10"
                rounded
                class="mt-2"
              ></v-progress-linear>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div class="bg-gray-700 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-400">Email</h3>
                <p class="text-lg">{{ userData.email }}</p>
              </div>
              <div class="bg-gray-700 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-400">Membre des de</h3>
                <p class="text-lg">
                  {{ new Date(userData.date_created).toLocaleDateString() }}
                </p>
              </div>
              <div class="bg-gray-700 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-400">Pes actual</h3>
                <p class="text-lg">{{ userData.pesoActual || "-" }} kg</p>
              </div>
              <div class="bg-gray-700 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-400">Altura</h3>
                <p class="text-lg">{{ userData.altura || "-" }} cm</p>
              </div>
            </div>

            <div class="flex flex-col space-y-4">
              <v-btn @click="openEditDialog" color="primary" block
                >Editar perfil</v-btn
              >
              <v-btn @click="handleLogout" color="red" block>Tancar Sessió</v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- EDICIÓ PERFIL -->
    <v-dialog v-model="isEditDialogOpen" persistent max-width="600px">
      <v-card class="bg-gray-800 text-white">
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
                  dark
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Email"
                  v-model="editableUserData.email"
                  required
                  dark
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Pes (kg)"
                  v-model="editableUserData.pesoActual"
                  type="number"
                  required
                  dark
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Altura (cm)"
                  v-model="editableUserData.altura"
                  type="number"
                  required
                  dark
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="isEditDialogOpen = false">Cancel·lar</v-btn>
          <v-btn color="primary" text @click="handleUpdateProfile">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
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
