<template>
  <div>
    <NavBar />
    <div class="min-h-screen bg-gray-900 text-white">
      <div class="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 class="text-4xl font-bold text-center mb-2 text-white">Rutines d'Exercicis</h1>
        <p class="text-center text-gray-400 mb-10">Selecciona una rutina per veure els exercicis.</p>

        <div v-if="loading" class="text-center">
          <p class="text-gray-300">Carregant rutines...</p>
        </div>
        <div v-if="error" class="text-center text-red-500">
          <p>Error en carregar les rutines: {{ error }}</p>
        </div>

        <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Card Tren Superior -->
          <div @click="openModal('upper')" class="routine-card" style="background-image: url('/Tren_superior.png');">
            <div class="routine-card-overlay">
              <h3 class="text-2xl font-bold">Tren Superior</h3>
              <p class="text-sm">Exercicis per a braços, pit i espatlles</p>
            </div>
          </div>

          <!-- Card Tren Inferior -->
          <div @click="openModal('lower')" class="routine-card" style="background-image: url('/Tren_inferior.png');">
            <div class="routine-card-overlay">
              <h3 class="text-2xl font-bold">Tren Inferior</h3>
              <p class="text-sm">Exercicis per a cames i glutis</p>
            </div>
          </div>

          <!-- Card Cos Complet -->
          <div @click="openModal('fullbody')" class="routine-card" style="background-image: url('/Cos_complet.png');">
            <div class="routine-card-overlay">
              <h3 class="text-2xl font-bold">Cos Complet</h3>
              <p class="text-sm">Una combinació d'exercicis per a tot el cos</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal per als Exercicis -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
      <div class="bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div class="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 class="text-2xl font-bold text-white">{{ selectedRoutine.title }}</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-white">&times;</button>
        </div>
        <div class="overflow-y-auto p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="exercise in selectedRoutine.exercises" :key="exercise.name" class="bg-gray-700 rounded-lg p-4 flex flex-col">
              <img :src="exercise.gif" loading="lazy" :alt="exercise.name + ' gif'" class="w-full rounded-md mb-4">
              <h4 class="text-lg font-semibold text-blue-400">{{ exercise.name }}</h4>
              <p class="text-gray-300 mt-1 text-sm flex-grow">{{ exercise.description }}</p>
              <div class="mt-3 text-xs text-gray-400">
                <span v-if="exercise.repetitions">{{ exercise.repetitions }} repeticions</span>
                <span v-else>{{ exercise.duration_seconds }} segons</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NavBar from "@/components/NavBar.vue";

const routines = ref({ upper: [], lower: [], fullbody: [] });
const loading = ref(true);
const error = ref(null);

const isModalOpen = ref(false);
const selectedRoutine = ref(null);

const routineDetails = {
  upper: { title: "Rutina de Tren Superior", exercises: [] },
  lower: { title: "Rutina de Tren Inferior", exercises: [] },
  fullbody: { title: "Rutina de Cos Complet", exercises: [] },
};

const openModal = (routineType) => {
  selectedRoutine.value = {
    title: routineDetails[routineType].title,
    exercises: routines.value[routineType],
  };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedRoutine.value = null;
};

const fetchExercises = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/exercicis`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    routines.value = data.routine || data;
  } catch (err) {
    console.error("Failed to fetch exercises:", err);
    error.value = err.message || String(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchExercises();
});
</script>

<style scoped>
.routine-card {
  @apply h-64 rounded-lg shadow-lg bg-cover bg-center cursor-pointer transform transition-transform duration-300 hover:scale-105 overflow-hidden relative;
}

.routine-card-overlay {
  @apply absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6 text-white;
  transition: background-opacity 0.3s ease;
}

.routine-card:hover .routine-card-overlay {
  @apply bg-opacity-60;
}

.routine-card h3 {
  @apply text-shadow-lg;
}

.routine-card p {
  @apply text-shadow;
}

.text-shadow {
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}
.text-shadow-lg {
  text-shadow: 2px 2px 5px rgba(0,0,0,0.6);
}
</style>