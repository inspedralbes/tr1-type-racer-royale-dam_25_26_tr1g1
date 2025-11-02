<template>
  <div class="wrap">
    <PoseSkeleton @features="onFeatures" />
  </div>
</template>

<script setup>
import { shallowRef } from "vue";

import PoseSkeleton from "@/components/Ai/PoseSkeleton.vue";

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

<style scoped>
.wrap {
  padding: 100px;
}
@media (max-width: 900px) {
  .wrap {
    padding: 15px;
  }
}
</style>
