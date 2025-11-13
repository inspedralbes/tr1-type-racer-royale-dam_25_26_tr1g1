<template>
  <nav
    class="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md bg-gray-800 bg-opacity-80 backdrop-blur-md text-white rounded-xl shadow-lg z-50"
  >
    <div class="flex justify-around">
      <router-link
        to="/social"
        class="p-4 flex flex-col items-center"
        active-class="text-blue-400"
      >
        <i class="mdi mdi-account-group text-xl"></i>
        <span class="text-xs mt-1 hidden sm:block">Social</span>
      </router-link>

      <router-link
        to="/sessions"
        class="p-4 flex flex-col items-center"
        active-class="text-blue-400"
      >
        <i class="mdi mdi-dumbbell text-xl"></i>
        <span class="text-xs mt-1 hidden sm:block">Sessions</span>
      </router-link>

      <router-link
        to="/rutines"
        class="p-4 flex flex-col items-center"
        active-class="text-blue-400"
      >
        <i class="mdi mdi-run text-xl"></i>
        <span class="text-xs mt-1 hidden sm:block">Rutines</span>
      </router-link>

      <router-link
        to="/perfil"
        class="p-4 flex flex-col items-center"
        active-class="text-blue-400"
      >
        <i class="mdi mdi-account text-xl"></i>
        <span class="text-xs mt-1 hidden sm:block">Perfil</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup></script>