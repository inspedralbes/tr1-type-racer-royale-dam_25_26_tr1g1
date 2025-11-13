<template>
  <div
    class="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-2 sm:p-4 w-48 sm:w-72 text-center"
  >
    <h2
      class="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center justify-center"
    >
      <span
        class="mdi mdi-trophy text-amber-400 text-xl sm:text-2xl mr-2"
      ></span>
      Marcador
    </h2>
    <ul class="space-y-2">
      <li
        v-for="(participant, index) in sortedParticipants"
        :key="participant.id"
        class="flex items-center py-1 px-2 rounded-md"
        :class="{
          'bg-gray-700': index % 2 === 0,
          'bg-gray-600': index % 2 !== 0,
        }"
      >
        <div
          class="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 sm:mr-3 overflow-hidden"
          :class="index === 0 ? 'bg-amber-400' : 'bg-gray-400'"
        >
          <img
            v-if="participant.foto_perfil"
            :src="participant.foto_perfil"
            alt="Avatar"
            class="w-full h-full object-cover"
          />
          <span
            v-else
            class="mdi mdi-crown text-white text-base sm:text-lg"
          ></span>
        </div>
        <span class="font-medium text-xs sm:text-sm flex-grow">{{
          participant.username
        }}</span>
        <span
          class="px-2 py-1 sm:px-3 rounded-full text-xs font-bold"
          :class="
            index === 0
              ? 'bg-amber-400 text-gray-900'
              : 'bg-blue-500 text-white'
          "
        >
          {{ participant.puntos }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  sortedParticipants: {
    type: Array,
    required: true,
  },
});
</script>
