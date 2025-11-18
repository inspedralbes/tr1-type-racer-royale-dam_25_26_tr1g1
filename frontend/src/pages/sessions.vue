<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
  >
    <NavBar />
    <div class="container mx-auto p-4 pb-40">
      <div class="relative z-10">
        <ListSessions />
      </div>
    </div>
  </div>
</template>

<script setup>
import ListSessions from "@/components/ListSessions.vue";
import NavBar from "@/components/NavBar.vue";
</script>
