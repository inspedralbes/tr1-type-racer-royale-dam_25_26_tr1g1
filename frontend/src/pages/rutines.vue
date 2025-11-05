<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <NavBar />
    <div class="container mx-auto p-4 pb-20">
      <!-- Header Section -->
      <div class="relative bg-gradient-to-r from-purple-500 to-indigo-600 p-8 rounded-lg shadow-lg mb-6 text-center">
        <h2 class="text-4xl font-extrabold mb-2">Rutines d'Exercicis</h2>
        <p class="text-lg text-gray-200 mb-4">
          Explora les nostres rutines d'entrenament personalitzades
        </p>
      </div>
      
      <!-- Loading / Error -->
      <div v-if="loading" class="mt-6 p-4 bg-gray-800 rounded-lg text-center">
        <p class="text-gray-300">Carregant rutines...</p>
      </div>

      <div v-if="error" class="mt-6 p-4 bg-red-700 rounded-lg text-center">
        <p class="text-white">Error en carregar rutines: {{ error }}</p>
      </div>

      <!-- Routines Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Upper Body Routine -->
        <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div class="bg-blue-600 p-4">
            <h3 class="text-2xl font-bold">Tren Superior</h3>
            <p class="text-gray-200">Exercicis per a braços, pit i espatlles</p>
          </div>
          <div class="p-4">
            <ul class="space-y-4">
              <li v-for="exercise in routine.upper" :key="exercise.name" class="bg-gray-700 rounded-lg p-4">
                <h4 class="text-lg font-semibold text-blue-400">{{ exercise.name }}</h4>
                <p class="text-gray-300 mt-1">{{ exercise.description }}</p>
                <div class="mt-2 flex justify-between items-center text-sm">
                  <span class="text-gray-400">
                    <template v-if="exercise.repetitions">
                      {{ exercise.repetitions }} repeticions
                    </template>
                    <template v-else>
                      {{ exercise.duration_seconds }} segons
                    </template>
                  </span>
                  <span class="text-blue-300">
                    {{ exercise.keypoints_detected.join(', ') }}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Lower Body Routine -->
        <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div class="bg-green-600 p-4">
            <h3 class="text-2xl font-bold">Tren Inferior</h3>
            <p class="text-gray-200">Exercicis per a cames i glutis</p>
          </div>
          <div class="p-4">
            <ul class="space-y-4">
              <li v-for="exercise in routine.lower" :key="exercise.name" class="bg-gray-700 rounded-lg p-4">
                <h4 class="text-lg font-semibold text-green-400">{{ exercise.name }}</h4>
                <p class="text-gray-300 mt-1">{{ exercise.description }}</p>
                <div class="mt-2 flex justify-between items-center text-sm">
                  <span class="text-gray-400">
                    <template v-if="exercise.repetitions">
                      {{ exercise.repetitions }} repeticions
                    </template>
                    <template v-else>
                      {{ exercise.duration_seconds }} segons
                    </template>
                  </span>
                  <span class="text-green-300">
                    {{ exercise.keypoints_detected.join(', ') }}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Full Body Routine -->
        <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div class="bg-purple-600 p-4">
            <h3 class="text-2xl font-bold">Cos Complet</h3>
            <p class="text-gray-200">Exercicis per a tot el cos</p>
          </div>
          <div class="p-4">
            <ul class="space-y-4">
              <li v-for="exercise in routine.fullbody" :key="exercise.name" class="bg-gray-700 rounded-lg p-4">
                <h4 class="text-lg font-semibold text-purple-400">{{ exercise.name }}</h4>
                <p class="text-gray-300 mt-1">{{ exercise.description }}</p>
                <div class="mt-2 flex justify-between items-center text-sm">
                  <span class="text-gray-400">
                    <template v-if="exercise.repetitions">
                      {{ exercise.repetitions }} repeticions
                    </template>
                    <template v-else>
                      {{ exercise.duration_seconds }} segons
                    </template>
                  </span>
                  <span class="text-purple-300">
                    {{ exercise.keypoints_detected.join(', ') }}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NavBar from "@/components/NavBar.vue";

const routine = ref({ upper: [], lower: [], fullbody: [] });
const loading = ref(true);
const error = ref(null);

const fetchExercises = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch("http://localhost:5000/exercicis");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // backend file has a top-level `routine` object
    routine.value = data.routine || data;
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
