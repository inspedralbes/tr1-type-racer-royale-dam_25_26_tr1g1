<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <NavBar />
    <div class="container mx-auto p-4 pb-20">
      <div class="max-w-4xl mx-auto">
        <!-- Banner Area -->
        <div
          v-if="userData"
          class="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg"
        >
          <!-- Profile Picture -->
          <div class="absolute -bottom-16 left-6">
            <div
              class="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-900"
            >
              <img
                :src="
                  userData.foto_perfil ||
                  'https://cdn-icons-png.flaticon.com/512/847/847969.png'
                "
                alt="Avatar"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          v-if="userData"
          class="flex justify-end p-4 border-b border-gray-700"
        >
          <button
            @click="openEditDialog"
            class="border border-gray-500 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-full mr-2"
          >
            Editar perfil
          </button>
          <button
            @click="handleLogout"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Tancar Sessió
          </button>
        </div>

        <div v-if="userData" class="p-6 pt-8">
          <!-- User Info -->
          <div class="mb-6">
            <h2 class="text-3xl font-bold">{{ userData.username }}</h2>
            <p class="text-md text-gray-400">
              Nivell: {{ Math.floor(userData.nivel) }}
            </p>
            <div class="w-full bg-gray-700 rounded-full h-2.5 mt-2 max-w-xs">
              <div
                class="bg-blue-500 h-2.5 rounded-full"
                :style="{ width: (userData.nivel % 1) * 100 + '%' }"
              ></div>
            </div>
          </div>

          <!-- User Biography -->
          <div class="mb-6">
            <p class="text-gray-300">
              {{ userData.biografia || "No has afegit cap biografia." }}
            </p>
          </div>

          <!-- User Details -->
          <div class="flex flex-wrap gap-x-6 gap-y-2 text-gray-400">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                ></path>
                <path
                  d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                ></path>
              </svg>
              <span>{{ userData.email }}</span>
            </div>
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span
                >Membre des de
                {{ new Date(userData.date_created).toLocaleDateString() }}</span
              >
            </div>
            <div v-if="userData.pesoActual" class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                ></path>
              </svg>
              <span>{{ userData.pesoActual }} kg</span>
            </div>
            <div v-if="userData.altura" class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                ></path>
              </svg>
              <span>{{ userData.altura }} cm</span>
            </div>
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
                class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label
              for="biografia"
              class="block text-sm font-medium text-gray-400"
              >Biografia</label
            >
            <textarea
              id="biografia"
              v-model="editableUserData.biografia"
              rows="3"
              class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div>
            <label
              for="foto_perfil"
              class="block text-sm font-medium text-gray-400"
              >Foto de perfil (URL)</label
            >
            <input
              type="text"
              id="foto_perfil"
              v-model="editableUserData.foto_perfil"
              class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
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
  foto_perfil: null,
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
    editableUserData.foto_perfil = userData.value.foto_perfil;
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
