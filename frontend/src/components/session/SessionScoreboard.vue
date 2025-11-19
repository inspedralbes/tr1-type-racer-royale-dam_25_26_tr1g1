<template>
  <div
    class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 w-44 sm:w-64 text-gray-900 dark:text-white transition-all duration-300"
  >
    <h2
      class="text-sm sm:text-lg font-bold mb-3 flex items-center justify-center text-gray-800 dark:text-gray-100"
    >
      <i class="mdi mdi-trophy text-amber-500 mr-1.5 text-lg sm:text-xl"></i>
      Marcador
    </h2>

    <ul class="space-y-1.5">
      <li
        v-for="(participant, index) in sortedParticipants"
        :key="participant.userId"
        class="flex items-center justify-between p-1.5 rounded-lg transition-colors"
        :class="
          index === 0
            ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30'
            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
        "
      >
        <div class="flex items-center min-w-0 gap-2">
          <div
            class="relative flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center overflow-hidden shadow-sm"
            :class="
              index === 0
                ? 'bg-amber-100 ring-1 ring-amber-300'
                : 'bg-gray-200 dark:bg-gray-600'
            "
          >
            <img
              v-if="participant.foto_perfil"
              :src="participant.foto_perfil"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
          </div>

          <span
            class="text-xs sm:text-sm font-medium truncate max-w-[80px] sm:max-w-[120px]"
          >
            {{ participant.username }}
          </span>
        </div>

        <span
          class="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold shadow-sm"
          :class="
            index === 0
              ? 'bg-amber-400 text-white dark:text-gray-900'
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
