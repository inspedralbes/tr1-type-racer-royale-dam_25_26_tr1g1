 <!-- Formulari per editar perfil -->
<template>
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg p-6 w-full max-w-lg">
    <h2 class="text-2xl font-bold mb-4">Editar Perfil</h2>

    <div class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-500 dark:text-gray-400"
          >Nom d'usuari</label
        >
        <input
          type="text"
          id="username"
          v-model="formData.username"
          required
          class="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-500 dark:text-gray-400"
          >Email</label
        >
        <input
          type="email"
          id="email"
          v-model="formData.email"
          required
          class="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="peso" class="block text-sm font-medium text-gray-500 dark:text-gray-400"
            >Pes (kg): {{ formData.pesoActual || 0 }} kg</label
          >
          <input
            type="range"
            id="peso"
            min="0"
            max="200"
            v-model="formData.pesoActual"
            class="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label for="altura" class="block text-sm font-medium text-gray-500 dark:text-gray-400"
            >Altura (cm): {{ formData.altura || 0 }} cm</label
          >
          <input
            type="range"
            id="altura"
            min="0"
            max="250"
            v-model="formData.altura"
            class="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      <div>
        <label for="biografia" class="block text-sm font-medium text-gray-500 dark:text-gray-400"
          >Biografia</label
        >
        <textarea
          id="biografia"
          v-model="formData.biografia"
          rows="3"
          class="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>
      <div>
        <label for="foto_perfil" class="block text-sm font-medium text-gray-500 dark:text-gray-400"
          >Foto de perfil (URL)</label
        >
        <input
          type="text"
          id="foto_perfil"
          v-model="formData.foto_perfil"
          class="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

    <div class="mt-6 flex justify-end space-x-4">
      <button
        @click="$emit('cancel')"
        class="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-2 px-4 rounded"
      >
        Cancel·lar
      </button>
      <button
        @click="handleSave"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Guardar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  initialData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["save", "cancel"]);

const formData = ref({ ...props.initialData });

watch(
  () => props.initialData,
  (newData) => {
    formData.value = { ...newData };
  },
  { immediate: true, deep: true }
);
//Funció per guardar les dades
const handleSave = () => {
  emit("save", formData.value);
};
</script>
