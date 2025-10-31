<!-- src/App.vue -->
<script setup>
import { shallowRef } from "vue";

import PoseSkeleton from "./components/IA/PoseSkeleton.vue";
import PoseFeatures from "./components/PoseFeatures.vue";

// Usa shallowRef per no fer deep-reactivity sobre estructures grans cada frame
const features = shallowRef(null);

function onFeatures(payload) {
  // ✅ crea una referència nova (important per a Vue)
  // usa structuredClone si està disponible; si no, fallback JSON
  features.value =
    typeof structuredClone === "function"
      ? structuredClone(payload)
      : JSON.parse(JSON.stringify(payload));
}
</script>

<template>
  <div class="wrap">
    <PoseSkeleton @features="onFeatures" />
    <PoseFeatures
      message="Preparat per mostrar dades del model…"
      :features="features"
    />
  </div>
  <!-- <div class="layout">
      <div class="main">
        <PoseSkeleton @features="onFeatures"/>
      </div>
      <PoseFeatures :features="features"/>
  </div> -->
</template>

<style scoped>
.wrap {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 12px;
  padding: 12px;
}
@media (max-width: 900px) {
  .wrap {
    grid-template-columns: 1fr;
  }
}
</style>
