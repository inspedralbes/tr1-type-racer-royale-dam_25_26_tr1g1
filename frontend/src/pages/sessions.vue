<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <NavBar />
    <div class="container mx-auto p-4 pb-40">
      <!-- Session List -->
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
