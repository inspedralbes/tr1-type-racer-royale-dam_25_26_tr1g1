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
          <div class="absolute -bottom-12 left-4 md:-bottom-16 md:left-6">
            <div
              class="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-gray-900"
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
          class="flex flex-col sm:flex-row justify-end p-4 border-b border-gray-700 mt-12 md:mt-16"
        >
          <button
            v-if="isProfileComplete"
            @click="openEditDialog"
            class="border border-gray-500 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-full mb-2 sm:mb-0 sm:mr-2"
          >
            Editar perfil
          </button>
          <button
            v-else
            @click="openEditDialog"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mb-2 sm:mb-0 sm:mr-2"
          >
            Completa tu perfil
          </button>
          <button
            @click="handleLogout"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Tancar Sessió
          </button>
        </div>

        <div v-if="userData" class="p-6">
          <!-- User Info -->
          <div class="mb-6">
            <h2 class="text-2xl sm:text-3xl font-bold">
              {{ userData.username }}
            </h2>
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
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
    >
      <FormEditarPerfil
        :initial-data="editableUserData"
        @save="handleUpdateProfile"
        @cancel="isEditDialogOpen = false"
      />
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import NavBar from "@/components/NavBar.vue";
import FormEditarPerfil from "@/components/Forms/FormEditarPerfil.vue";

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

const isProfileComplete = computed(() => {
  if (!userData.value) return false;
  return (
    userData.value.pesoActual > 0 &&
    userData.value.altura > 0 &&
    !!userData.value.biografia
  );
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

const handleUpdateProfile = async (updatedData) => {
  try {
    await appStore.updateUser(updatedData);
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
