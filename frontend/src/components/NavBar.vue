<!-- Barra de navegació fixa inferior -->
<template>
  <nav
    class="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md border border-gray-200 dark:border-transparent bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-900 dark:text-white rounded-xl shadow-lg z-10"
  >
    <div class="flex justify-around">
      <router-link
        to="/social"
        class="p-4 flex flex-col items-center"
        active-class="text-blue-500 dark:text-blue-400"
      >
        <i class="mdi mdi-account-group text-xl"></i>
        <span class="text-xs mt-1 hidden sm:block">Social</span>
      </router-link>

      <!-- Enllaç a la pàgina Sessions -->
      <router-link
        to="/sessions"
        class="p-4 flex flex-col items-center"
        active-class="text-blue-500 dark:text-blue-400"
      >
        <i class="mdi mdi-dumbbell text-xl"></i>
        <span class="text-xs mt-1 hidden sm:block">Sessions</span>
      </router-link>

       <!-- Enllaç a la pàgina Rutines -->
      <router-link
        to="/rutines"
        class="p-4 flex flex-col items-center"
        active-class="text-blue-500 dark:text-blue-400"
      >
        <i class="mdi mdi-run text-xl"></i>
        <span class="text-xs mt-1 hidden sm:block">Rutines</span>
      </router-link>

       <!-- Enllaç a la pàgina Perfil -->
      <router-link
        to="/perfil"
        class="p-4 flex flex-col items-center"
        active-class="text-blue-500 dark:text-blue-400"
      >
        <i class="mdi mdi-account text-xl"></i>
        <span class="text-xs mt-1 hidden sm:block">Perfil</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup></script>
