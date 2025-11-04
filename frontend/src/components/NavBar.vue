<template>
  <nav class="fixed bottom-0 inset-x-0 bg-gray-800 text-white">
    <div class="flex justify-around">
      <router-link
        to="/social"
        class="p-4 flex flex-col items-center hover:bg-gray-700"
        active-class="text-blue-400"
      >
        <i class="mdi mdi-account-group text-xl"></i>
        <span class="text-xs mt-1">Social</span>
      </router-link>

      <router-link
        to="/sessions"
        class="p-4 flex flex-col items-center hover:bg-gray-700"
        active-class="text-blue-400"
      >
        <i class="mdi mdi-dumbbell text-xl"></i>
        <span class="text-xs mt-1">Sessions</span>
      </router-link>

      <router-link
        to="/perfil"
        class="p-4 flex flex-col items-center hover:bg-gray-700"
        active-class="text-blue-400"
      >
        <i class="mdi mdi-account text-xl"></i>
        <span class="text-xs mt-1">Perfil</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup></script>
