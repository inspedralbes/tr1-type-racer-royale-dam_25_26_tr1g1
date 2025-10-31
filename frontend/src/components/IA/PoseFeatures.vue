<!-- src/components/PoseFeatures.vue -->
<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  features: { type: Object, default: null }
})

/* NEW: “Schema” persistent dels camps vists.
   - No s’esborra mai; si una feature no arriba en un frame, al panell es mostra “—”.
   - Separem en grups: top-level (ex.: fps, score…), angles, inclinations, velocities, normalized, i noms de keypoints. */
const seen = reactive({
  top: new Set(),           // qualsevol camp top-level que no sigui un dels grups especials
  angles: new Set(),
  inclinations: new Set(),
  velocities: new Set(),
  normalized: new Set(),
  keypointNames: new Set()
})

// NEW: quan arriben features noves, actualitzem el “schema” (sense eliminar res)
watch(() => props.features, (f) => {
  if (!f) return

  // Top-level (excloent sub-objects especials)
  Object.keys(f).forEach(k => {
    if (!['angles','inclinations','velocities','normalized','keypoints'].includes(k)) {
      seen.top.add(k)
    }
  })

  // Subgrups
  if (f.angles && typeof f.angles === 'object') {
    Object.keys(f.angles).forEach(k => seen.angles.add(k))
  }
  if (f.inclinations && typeof f.inclinations === 'object') {
    Object.keys(f.inclinations).forEach(k => seen.inclinations.add(k))
  }
  if (f.velocities && typeof f.velocities === 'object') {
    Object.keys(f.velocities).forEach(k => seen.velocities.add(k))
  }
  if (f.normalized && typeof f.normalized === 'object') {
    Object.keys(f.normalized).forEach(k => seen.normalized.add(k))
  }

  // Keypoints: persistim els noms (o índex si no hi ha name)
  if (Array.isArray(f.keypoints)) {
    f.keypoints.forEach((kp, idx) => {
      seen.keypointNames.add(kp?.name ?? String(idx))
    })
  }
}, { immediate: true })

// NEW: helper per formatar números bonics
function fmt(val, digits = 2) {
  if (val == null || Number.isNaN(val)) return '—'
  if (typeof val === 'number' && Number.isFinite(val)) return val.toFixed(digits)
  return String(val)
}
</script>

<template>
  <aside class="panel">
    <h3>Features</h3>
    <ul>
      <!-- TOP-LEVEL (fps, score, qualsevol altre camp que arribi) -->
      <li v-for="k in Array.from(seen.top).sort()" :key="'top-' + k">
        <strong>{{ k }}:</strong>
        <span>
          {{ typeof features?.[k] === 'number'
              ? fmt(features?.[k], k === 'fps' || k === 'fpsSmooth' ? 1 : 3)
              : (features?.[k] ?? '—') }}
        </span>
      </li>

      <!-- ANGLES (°) -->
      <li v-if="seen.angles.size"><strong>Angles</strong></li>
      <li v-for="name in Array.from(seen.angles).sort()" :key="'ang-' + name" style="margin-left: 12px;">
        {{ name }}: {{ fmt(features?.angles?.[name], 1) }}
      </li>

      <!-- INCLINACIONS (°) -->
      <li v-if="seen.inclinations.size"><strong>Inclinacions</strong></li>
      <li v-for="name in Array.from(seen.inclinations).sort()" :key="'inc-' + name" style="margin-left: 12px;">
        {{ name }}: {{ fmt(features?.inclinations?.[name], 1) }}
      </li>

      <!-- VELOCITATS (unitats normalitzades/s) -->
      <li v-if="seen.velocities.size"><strong>Velocitats</strong></li>
      <li v-for="name in Array.from(seen.velocities).sort()" :key="'vel-' + name" style="margin-left: 12px;">
        {{ name }}: v={{ fmt(features?.velocities?.[name]?.v, 3) }}
      </li>

      <!-- NORMALITZADES (valors normalitzats o objectes {x,y} etc.) -->
      <li v-if="seen.normalized.size"><strong>Normalitzades</strong></li>
      <li v-for="name in Array.from(seen.normalized).sort()" :key="'norm-' + name" style="margin-left: 12px;">
        <template v-if="typeof features?.normalized?.[name] === 'object'">
          {{ name }}:
          <span v-for="(v, k2) in features?.normalized?.[name]" :key="name + '-' + k2">
            {{ k2 }}={{ fmt(v, 3) }}<span v-if="k2 !== Object.keys(features?.normalized?.[name]).slice(-1)[0]">, </span>
          </span>
        </template>
        <template v-else>
          {{ name }}: {{ fmt(features?.normalized?.[name], 3) }}
        </template>
      </li>

      <!-- Resum de keypoints (mateixa idea que ja tenies) -->
      <li v-if="Array.from(seen.keypointNames).length">
        <strong>Keypoints:</strong>
        <span>n={{ features?.keypoints?.length ?? 0 }}</span>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.panel {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
}
.panel h3 { margin: 0 0 8px; }
ul { margin: 8px 0 0; padding-left: 18px; }
</style>
