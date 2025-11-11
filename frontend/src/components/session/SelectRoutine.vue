<template>
  <div v-if="!currentRoutine" class="w-full h-full max-w-full">
    <div
      class="bg-gray-800 rounded-lg text-white w-full h-full mx-auto flex flex-col overflow-y-auto"
    >
      <!-- Títol i descripció -->
      <div class="p-4 flex-shrink-0">
        <h2 class="text-2xl font-bold mb-2">Què vols entrenar?</h2>
        <p class="text-gray-300 mb-6">Tria una rutina per començar a configurar la sessió.</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-6 p-4 flex-grow">
        <button
          @click="selectedRoutine = 'fullbody'"
          :class="[
            'relative rounded-lg bg-gray-700 text-left transition transform hover:scale-105 h-full overflow-hidden',
            selectedRoutine === 'fullbody' ? 'border-4 border-green-500' : 'border border-gray-600'
          ]"
        >
          <img src="/Cos_complet.png" alt="Cos Complet" class="w-full h-40 sm:h-48 md:h-64 object-cover rounded-md" />
          <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-3 text-center">
            <span class="text-xl font-semibold text-white">Cos Complet</span>
          </div>
        </button>

        <button
          @click="selectedRoutine = 'upper'"
          :class="[
            'relative rounded-lg bg-gray-700 text-left transition transform hover:scale-105 h-full overflow-hidden',
            selectedRoutine === 'upper' ? 'border-4 border-green-500' : 'border border-gray-600'
          ]"
        >
          <img src="/Tren_superior.png" alt="Tren Superior" class="w-full h-40 sm:h-48 md:h-64 object-cover rounded-md" />
          <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-3 text-center">
            <span class="text-xl font-semibold text-white">Tren Superior</span>
          </div>
        </button>

        <button
          @click="selectedRoutine = 'lower'"
          :class="[
            'relative rounded-lg bg-gray-700 text-left transition transform hover:scale-105 h-full overflow-hidden',
            selectedRoutine === 'lower' ? 'border-4 border-green-500' : 'border border-gray-600'
          ]"
        >
          <img src="/Tren_inferior.png" alt="Tren Inferior" class="w-full h-40 sm:h-48 md:h-64 object-cover rounded-md" />
          <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-3 text-center">
            <span class="text-xl font-semibold text-white">Tren Inferior</span>
          </div>
        </button>
      </div>

      <!-- Botons d'acció -->
      <div class="mt-auto flex justify-end p-4 gap-4 flex-shrink-0">
        <button
          @click="emit('cancel')"
          class="rounded-lg border border-gray-600 px-4 py-2 text-gray-300 hover:bg-gray-700"
        >
          Tornar enrere
        </button>
        <button
          @click="acceptSelection"
          :disabled="!selectedRoutine"
          class="rounded-lg px-4 py-2 text-white font-semibold transition"
          :class="{
            'bg-green-600 hover:bg-green-700': selectedRoutine,
            'bg-gray-500 cursor-not-allowed': !selectedRoutine
          }"
        >
          Acceptar
        </button>
      </div>
    </div>
  </div>
  <div v-else class="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
    <div class="text-center">
      <p class="text-2xl font-bold text-white">Ja has seleccionat una rutina.</p>
      <p class="text-lg text-gray-300 mt-2">Redirigint...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  currentRoutine: {
    type: String,
    default: null
  }
});

const selectedRoutine = ref(null);

const emit = defineEmits({
  selected: (routine) => ['fullbody', 'upper', 'lower'].includes(routine),
  cancel: null,
});

onMounted(() => {
  if (props.currentRoutine) {
    emit('selected', props.currentRoutine);
  }
});

const acceptSelection = () => {
  if (selectedRoutine.value) {
    emit('selected', selectedRoutine.value);
  }
};
</script>

<style scoped>
/* small scoped styles if needed */
</style>
