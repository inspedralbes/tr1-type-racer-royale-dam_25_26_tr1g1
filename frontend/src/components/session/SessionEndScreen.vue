<template>
  <transition name="fade-zoom">
    <div
      class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-100 dark:bg-black bg-opacity-90 dark:bg-opacity-90 backdrop-blur-lg p-4"
    >
      <div class="text-center mb-8">
        <h1
          class="text-5xl sm:text-7xl mb-6 font-extrabold text-gray-900 dark:text-white drop-shadow-lg"
        >
          Sessió Finalitzada!
        </h1>
      </div>

      <!-- Podium Section -->
      <div class="flex items-end justify-center gap-4 mb-8 w-full max-w-4xl">
        <!-- Second Place -->
        <div
          v-if="secondPlace"
          class="flex flex-col items-center text-gray-900 dark:text-white relative"
        >
          <div
            class="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-300 dark:bg-gray-500 flex items-center justify-center mb-2 border-4 border-gray-400 dark:border-gray-400 shadow-lg"
          >
            <img
              v-if="secondPlace.foto_perfil"
              :src="secondPlace.foto_perfil"
              alt="2nd Place"
              class="w-full h-full object-cover rounded-full"
            />
            <span v-else class="mdi mdi-medal text-6xl text-gray-700 dark:text-white"></span>
          </div>
          <span class="text-lg font-semibold">{{ secondPlace.username }}</span>
          <span class="text-xl font-bold text-gray-600 dark:text-gray-200">{{
            secondPlace.puntos
          }}</span>
          <div
            class="bg-gray-300 dark:bg-gray-500 h-24 w-32 sm:h-32 sm:w-40 rounded-t-lg absolute -bottom-2 left-1/2 -translate-x-1/2 z-[-1] border-t-4 border-x-4 border-gray-400 dark:border-gray-400"
          ></div>
          <span
            class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-extrabold text-gray-500 dark:text-gray-300 drop-shadow-lg"
            >2</span
          >
        </div>

        <!-- First Place -->
        <div
          v-if="firstPlace"
          class="flex flex-col items-center text-gray-900 dark:text-white relative z-10"
        >
          <div
            class="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-amber-300 dark:bg-amber-400 flex items-center justify-center mb-2 border-4 border-amber-200 dark:border-amber-300 shadow-lg"
          >
            <img
              v-if="firstPlace.foto_perfil"
              :src="firstPlace.foto_perfil"
              alt="1st Place"
              class="w-full h-full object-cover rounded-full"
            />
            <span v-else class="mdi mdi-crown text-7xl text-gray-700 dark:text-white"></span>
          </div>
          <span class="text-xl font-bold">{{ firstPlace.username }}</span>
          <span class="text-2xl font-extrabold text-amber-500 dark:text-amber-200">{{
            firstPlace.puntos
          }}</span>
          <div
            class="bg-amber-300 dark:bg-amber-400 h-32 w-40 sm:h-40 sm:w-52 rounded-t-lg absolute -bottom-2 left-1/2 -translate-x-1/2 z-[-1] border-t-4 border-x-4 border-amber-200 dark:border-amber-300"
          ></div>
          <span
            class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-extrabold text-amber-500 dark:text-amber-200 drop-shadow-lg"
            >1</span
          >
        </div>

        <!-- Third Place -->
        <div
          v-if="thirdPlace"
          class="flex flex-col items-center text-gray-900 dark:text-white relative"
        >
          <div
            class="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-yellow-600 dark:bg-yellow-700 flex items-center justify-center mb-2 border-4 border-yellow-500 dark:border-yellow-600 shadow-lg"
          >
            <img
              v-if="thirdPlace.foto_perfil"
              :src="thirdPlace.foto_perfil"
              alt="3rd Place"
              class="w-full h-full object-cover rounded-full"
            />
            <span v-else class="mdi mdi-medal text-5xl text-gray-700 dark:text-white"></span>
          </div>
          <span class="text-md font-medium">{{ thirdPlace.username }}</span>
          <span class="text-lg font-bold text-yellow-400 dark:text-yellow-300">{{
            thirdPlace.puntos
          }}</span>
          <div
            class="bg-yellow-600 dark:bg-yellow-700 h-16 w-28 sm:h-24 sm:w-36 rounded-t-lg absolute -bottom-2 left-1/2 -translate-x-1/2 z-[-1] border-t-4 border-x-4 border-yellow-500 dark:border-yellow-600"
          ></div>
          <span
            class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-extrabold text-yellow-500 dark:text-yellow-400 drop-shadow-lg"
            >3</span
          >
        </div>
      </div>

      <!-- Remaining Participants Scoreboard -->
      <div v-if="remainingParticipants.length > 0" class="w-full max-w-md mt-4">
        <SessionScoreboard :sorted-participants="remainingParticipants" />
      </div>

      <!-- Level Progression -->
      <div v-if="currentUserProgression" class="w-full max-w-md mt-8">
        <LevelProgressBar
          :old-level="currentUserProgression.oldLevel"
          :new-level="currentUserProgression.newLevel"
          :points="currentUserProgression.points"
        />
      </div>

      <button
        @click="$emit('exit-session')"
        class="mt-12 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-105"
      >
        <i class="mdi mdi-exit-to-app mr-2"></i>
        Sortir de la Sessió
      </button>
    </div>
  </transition>
</template>

<script setup>
import { computed, onMounted } from "vue";
import SessionScoreboard from "@/components/session/SessionScoreboard.vue";
import LevelProgressBar from "@/components/session/LevelProgressBar.vue";
import { useAppStore } from "@/stores/app";
import { useUsersStore } from "@/stores/users";

const props = defineProps({
  sortedParticipants: {
    type: Array,
    required: true,
  },
});

defineEmits(["exit-session"]);

const appStore = useAppStore();
const usersStore = useUsersStore();
const currentUserId = computed(() => appStore.userId);

const firstPlace = computed(() => props.sortedParticipants[0]);
const secondPlace = computed(() => props.sortedParticipants[1]);
const thirdPlace = computed(() => props.sortedParticipants[2]);
const remainingParticipants = computed(() => props.sortedParticipants.slice(3));

const currentUserProgression = computed(() => {
  const currentUser = props.sortedParticipants.find(
    (p) => p.userId === currentUserId.value
  );
  return currentUser?.levelProgression;
});

onMounted(() => {
  if (appStore.userId) {
    usersStore.fetchUser(appStore.userId, true);
  }
});
</script>

<style scoped>
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.5s ease;
}

.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
