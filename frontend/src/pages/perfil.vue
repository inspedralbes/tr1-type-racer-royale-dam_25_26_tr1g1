<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <NavBar />
    <div class="container mx-auto p-4 pb-20">
      <div
        class="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        <!-- Banner Area -->
        <div class="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
          <!-- Profile Picture (positioned absolutely to overlap) -->
          <div class="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div
              class="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-800"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                alt="Avatar"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div v-if="userData" class="pt-20 p-6">
          <!-- pt-20 to account for overlapping avatar -->
          <div class="text-center mb-6">
            <h2 class="text-3xl font-bold">{{ userData.username }}</h2>
            <p class="text-md text-gray-400">
              Nivell: {{ Math.floor(userData.nivel) }}
            </p>
            <div
              class="w-full bg-gray-700 rounded-full h-2.5 mt-2 max-w-xs mx-auto"
            >
              <div
                class="bg-blue-500 h-2.5 rounded-full"
                :style="{ width: (userData.nivel % 1) * 100 + '%' }"
              ></div>
            </div>
          </div>

          <!-- User Details (Email, Member Since, Weight, Height) - styled as stats -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-center"
          >
            <div class="bg-gray-700 p-4 rounded-lg">
              <h3 class="text-sm font-medium text-gray-400">Email</h3>
              <p class="text-lg truncate">{{ userData.email }}</p>
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

          <!-- User Biography -->
          <div class="mt-6 text-center">
            <h3 class="text-lg font-medium text-gray-400">Biografía</h3>
            <p class="mt-2 text-gray-300">{{ userData.biografia || "No has afegit cap biografia." }}</p>
          </div>

          <div
            class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <button
              @click="openEditDialog"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Editar perfil
            </button>
            <button
              @click="handleLogout"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Tancar Sessió
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- EDICIÓ PERFIL -->
    <div
      v-if="isEditDialogOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
    >
      <div
        class="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-lg"
      >
        <h2 class="text-2xl font-bold mb-4">Editar Perfil</h2>

        <div class="space-y-4">
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-gray-400"
              >Nom d'usuari</label
            >
            <input
              type="text"
              id="username"
              v-model="editableUserData.username"
              required
              class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-400"
              >Email</label
            >
            <input
              type="email"
              id="email"
              v-model="editableUserData.email"
              required
              class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="peso" class="block text-sm font-medium text-gray-400"
                >Pes (kg)</label
              >
              <input
                type="number"
                id="peso"
                v-model="editableUserData.pesoActual"
                required
                class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                for="altura"
                class="block text-sm font-medium text-gray-400"
                >Altura (cm)</label
              >
              <input
                type="number"
                id="altura"
                v-model="editableUserData.altura"
                required
              />
            </div>
          </div>
          <div>
            <label for="biografia" class="block text-sm font-medium text-gray-400">Biografia</label>
            <textarea id="biografia" v-model="editableUserData.biografia" rows="3" class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-4">
          <button
            @click="isEditDialogOpen = false"
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel·lar
          </button>
          <button
            @click="handleUpdateProfile"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
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
  biografia: null,
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
    editableUserData.biografia = userData.value.biografia;
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
