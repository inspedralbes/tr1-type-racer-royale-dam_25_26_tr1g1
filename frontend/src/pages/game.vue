<template>
  <div>
    <h1>Game Session</h1>
    <p>Session ID: {{ sessionId }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const sessionId = ref('');
const route = useRoute();

onMounted(() => {
  sessionId.value = route.params.id;
});
</script>

<style scoped>
/* Add any specific styles for the game component here */
</style>