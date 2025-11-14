<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <NavBar />
    <div class="container mx-auto p-4 pb-20">
      <div v-if="loggedInUser" class="max-w-2xl mx-auto">
        <!-- Profile Header -->
        <div
          class="mb-6 rounded-xl border border-gray-700 bg-gray-800/50 p-4 shadow-lg backdrop-blur-sm text-center"
        >
          <div class="flex justify-center mb-4">
            <div
              class="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500"
            >
              <img
                :src="
                  loggedInUser.foto_perfil ||
                  'https://cdn-icons-png.flaticon.com/512/847/847969.png'
                "
                alt="Avatar"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
          <h2 class="text-3xl font-bold">{{ loggedInUser.username }}</h2>
          <p class="text-md text-gray-400">
            Nivell: {{ Math.floor(loggedInUser.nivel || 0) }}
          </p>
          <div
            class="w-full bg-gray-700 rounded-full h-2.5 mt-2 max-w-xs mx-auto"
          >
            <div
              class="bg-blue-500 h-2.5 rounded-full"
              :style="{ width: ((loggedInUser.nivel || 0) % 1) * 100 + '%' }"
            ></div>
          </div>
          <!-- Action Buttons -->
          <div class="mt-6 flex justify-center gap-4">
            <button
              v-if="isProfileComplete"
              @click="openEditDialog"
              class="border border-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Editar perfil
            </button>
            <button
              v-else
              @click="openEditDialog"
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Completa el teu perfil
            </button>
            <button
              @click="openLogoutDialog"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Tancar Sessió
            </button>
          </div>
        </div>

        <!-- User Biography -->
        <div
          class="mb-6 rounded-xl border border-gray-700 bg-gray-800/50 p-4 shadow-lg backdrop-blur-sm"
        >
          <h3 class="text-xl font-bold mb-4">Biografia</h3>
          <p class="text-gray-300">
            {{ loggedInUser.biografia || "No has afegit cap biografia." }}
          </p>
        </div>

        <!-- User Details -->
        <div
          class="mb-6 rounded-xl border border-gray-700 bg-gray-800/50 p-4 shadow-lg backdrop-blur-sm"
        >
          <h3 class="text-xl font-bold mb-4">Detalls</h3>
          <div class="space-y-4">
            <div class="flex items-center">
              <i class="mdi mdi-email-outline text-gray-400 w-6"></i>
              <span class="ml-3">{{ loggedInUser.email }}</span>
            </div>
            <div class="flex items-center">
              <i class="mdi mdi-calendar-clock text-gray-400 w-6"></i>
              <span class="ml-3">
                Membre des de
                {{ new Date(loggedInUser.date_created).toLocaleDateString() }}</span
              >
            </div>
            <div v-if="loggedInUser.pesoActual" class="flex items-center">
              <i class="mdi mdi-weight-kilogram text-gray-400 w-6"></i>
              <span class="ml-3">{{ loggedInUser.pesoActual }} kg</span>
            </div>
            <div v-if="loggedInUser.altura" class="flex items-center">
              <i class="mdi mdi-human-male-height text-gray-400 w-6"></i>
              <span class="ml-3">{{ loggedInUser.altura }} cm</span>
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

    <!-- Logout Confirmation Dialog -->
    <div
      v-if="isLogoutDialogOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
    >
      <div
        class="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-sm"
      >
        <h2 class="text-xl font-bold mb-4">Tancar Sessió</h2>
        <p>Estàs segur que vols tancar la sessió?</p>
        <div class="mt-6 flex justify-end space-x-4">
          <button
            @click="isLogoutDialogOpen = false"
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Cancel·lar
          </button>
          <button
            @click="handleLogout"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Confirmar
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
import { useUsersStore } from "@/stores/users";
import NavBar from "@/components/NavBar.vue";

const router = useRouter();
const appStore = useAppStore();
const usersStore = useUsersStore();

const loggedInUser = computed(() => usersStore.getUser(appStore.userId));
const isEditDialogOpen = ref(false);
const isLogoutDialogOpen = ref(false);
const editableUserData = reactive({
  username: null,
  email: null,
  pesoActual: null,
  altura: null,
  biografia: null,
  foto_perfil: null,
});

const isProfileComplete = computed(() => {
  if (!loggedInUser.value) return false;
  return (
    loggedInUser.value.pesoActual > 0 &&
    loggedInUser.value.altura > 0 &&
    !!loggedInUser.value.biografia
  );
});

onMounted(async () => {
  if (!appStore.isAuthenticated) {
    router.push("/");
  } else if (appStore.userId) {
    await usersStore.fetchUser(appStore.userId);
  }
});

const openEditDialog = () => {
  if (loggedInUser.value) {
    editableUserData.username = loggedInUser.value.username;
    editableUserData.email = loggedInUser.value.email;
    editableUserData.pesoActual = loggedInUser.value.pesoActual;
    editableUserData.altura = loggedInUser.value.altura;
    editableUserData.biografia = loggedInUser.value.biografia;
    editableUserData.foto_perfil = loggedInUser.value.foto_perfil;
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

const openLogoutDialog = () => {
  isLogoutDialogOpen.value = true;
};

const handleLogout = () => {
  appStore.setLoggedOut();
  isLogoutDialogOpen.value = false;
  router.push("/");
};
</script>

<style scoped></style>


