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

        <!-- Controls: Open/Close All -->
        <div class="flex justify-end mb-4">
          <!-- Subtle / ghost-style button: lower contrast, smaller, with gentle hover -->
          <button
            @click="toggleAll"
            :aria-pressed="allOpen"
            aria-label="Obrir o tancar totes les rutines"
            class="inline-flex items-center px-3 py-1 text-sm text-indigo-200 bg-transparent border border-indigo-500/10 hover:bg-indigo-600/10 hover:text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
          >
            <span v-if="allOpen">Tancar totes</span>
            <span v-else>Obrir totes</span>
          </button>
        </div>

      <!-- Loading / Error -->
      <div v-if="loading" class="mt-6 p-4 bg-gray-800 rounded-lg text-center">
        <p class="text-gray-300">Carregant rutines...</p>
      </div>
      <div v-if="error" class="mt-6 p-4 bg-red-700 rounded-lg text-center">
        <p class="text-white">Error en carregar rutines: {{ error }}</p>
      </div>

      <!-- Rutines Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Rutina Upper Body -->
        <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <button @click="upperOpen = !upperOpen" class="w-full flex items-center justify-between bg-blue-600 p-4 focus:outline-none">
            <div>
              <h3 class="text-2xl font-bold">Tren Superior</h3>
              <p class="text-gray-200">Exercicis per a braços, pit i espatlles</p>
            </div>
            <svg :class="{'transform rotate-180': upperOpen}" class="w-6 h-6 text-white transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div v-show="upperOpen" class="p-4">
              <ul class="space-y-4">
                <li v-for="exercise in routine.upper" :key="exercise.name" class="bg-gray-700 rounded-lg p-4">
                  <img v-if="upperOpen && exercise.gif" :src="exercise.gif" loading="lazy" :alt="exercise.name + ' gif'" width="480" height="270" class="w-full max-w-xs mx-auto rounded mb-2" />
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
          </transition>
        </div>

        <!-- Rutina Lower Body -->
        <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <button @click="lowerOpen = !lowerOpen" class="w-full flex items-center justify-between bg-blue-600 p-4 focus:outline-none">
            <div>
              <h3 class="text-2xl font-bold">Tren Inferior</h3>
              <p class="text-gray-200">Exercicis per a cames i glutis</p>
            </div>
            <svg :class="{'transform rotate-180': lowerOpen}" class="w-6 h-6 text-white transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div v-show="lowerOpen" class="p-4">
              <ul class="space-y-4">
                <li v-for="exercise in routine.lower" :key="exercise.name" class="bg-gray-700 rounded-lg p-4">
                  <img v-if="lowerOpen && exercise.gif" :src="exercise.gif" loading="lazy" :alt="exercise.name + ' gif'" width="480" height="270" class="w-full max-w-xs mx-auto rounded mb-2" />
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
          </transition>
        </div>

        <!-- Rutina Full Body -->
        <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <button @click="fullOpen = !fullOpen" class="w-full flex items-center justify-between bg-blue-600 p-4 focus:outline-none">
            <div>
              <h3 class="text-2xl font-bold">Cos Complet</h3>
              <p class="text-gray-200">Exercicis per a tot el cos</p>
            </div>
            <svg :class="{'transform rotate-180': fullOpen}" class="w-6 h-6 text-white transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div v-show="fullOpen" class="p-4">
              <ul class="space-y-4">
                <li v-for="exercise in routine.fullbody" :key="exercise.name" class="bg-gray-700 rounded-lg p-4">
                  <img v-if="fullOpen && exercise.gif" :src="exercise.gif" loading="lazy" :alt="exercise.name + ' gif'" width="480" height="270" class="w-full max-w-xs mx-auto rounded mb-2" />
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
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import NavBar from "@/components/NavBar.vue";

const routine = ref({ upper: [], lower: [], fullbody: [] });
const loading = ref(true);
const error = ref(null);

// collapse / expand state for routines (default: closed)
const upperOpen = ref(false);
const lowerOpen = ref(false);
const fullOpen = ref(false);

// computed and helpers for toggling all panels
const allOpen = computed(() => upperOpen.value && lowerOpen.value && fullOpen.value);
const setAll = (val) => {
  upperOpen.value = val;
  lowerOpen.value = val;
  fullOpen.value = val;
};
const toggleAll = () => setAll(!allOpen.value);

const fetchExercises = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/exercicis`);
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
