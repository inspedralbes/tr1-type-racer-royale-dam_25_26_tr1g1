<!-- src/components/PoseSkeleton.vue -->
<script setup>
/*
  PoseSkeleton (Composition API, <script setup>)
  ------------------------------------------------------
  Goals
  - Open the webcam and show the video.
  - List all available cameras (videoinput).
  - Let the user switch camera using a <select> under the video.
  - Load MoveNet (Lightning) and draw skeleton on a canvas overlay.

  Key browser APIs:
  - MediaDevices.getUserMedia()
  - MediaDevices.enumerateDevices()
  - devicechange event
  - MediaStreamTrack.stop()
  - HTMLMediaElement.play()

  Notes
  - Always stop the previous stream before starting a new one.
  - After permission is granted, device labels become readable.
*/

import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

// TensorFlow.js + backend WebGL
import * as tf from '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-backend-webgl'

// Pose detection (MoveNet)
import * as poseDetection from '@tensorflow-models/pose-detection'

/* -----------------------------
   STATE (abans data())
------------------------------*/
const devices = ref([])           // [{ deviceId, label }]
const selectedId = ref('')        // deviceId seleccionat
const currentStream = ref(null)   // MediaStream actiu
const onDeviceChange = ref(null)  // handler per poder-lo eliminar

const videoEl = ref(null)         // <video>
const canvasRef = ref(null)       // <canvas> overlay per dibuixar esquelet

let detector = null               // MoveNet detector
let rafId = 0                     // requestAnimationFrame id per al loop

/* -----------------------------
   HELPERS (angles, distàncies, normalització, velocitats) - NEW
------------------------------*/

// NEW: EMA (Exponential Moving Average) senzill per suavitzar FPS
function ema(prev, x, alpha = 0.2) {
  if (!Number.isFinite(x)) return prev
  if (!Number.isFinite(prev) || prev === 0) return x
  return prev * (1 - alpha) + x * alpha
}

// NEW: estat per a l'EMA d’FPS
let _fpsEma = 0

// NEW: estat angles anteriors per calcular velocitat angular (°/s)
const _prevAngles = {
  leftElbow: null, rightElbow: null,
  leftKnee:  null, rightKnee:  null,
  leftHip:   null, rightHip:   null
}

// NEW: distància euclidiana
function dist(a, b) {
  if (!a || !b) return null
  const dx = a.x - b.x, dy = a.y - b.y
  return Math.hypot(dx, dy)
}

// NEW: angle (en graus) donats tres punts A-B-C (angle al punt B)
function angleABC(A, B, C) {
  if (!A || !B || !C) return null
  const v1x = A.x - B.x, v1y = A.y - B.y
  const v2x = C.x - B.x, v2y = C.y - B.y
  const dot = v1x * v2x + v1y * v2y
  const m1 = Math.hypot(v1x, v1y), m2 = Math.hypot(v2x, v2y)
  if (!m1 || !m2) return null
  const cos = Math.min(1, Math.max(-1, dot / (m1 * m2)))
  return Math.acos(cos) * 180 / Math.PI
}

// NEW: inclinació (graus) de la línia AB respecte l'horitzontal
function inclinationDeg(A, B) {
  if (!A || !B) return null
  const ang = Math.atan2(B.y - A.y, B.x - A.x) * 180 / Math.PI
  return ang // 0=horitzontal, 90=vertical cap avall
}

// NEW: normalitza coordenades a [0,1] amb mida de vídeo
function normalizeKP(kp, w, h) {
  if (!kp) return null
  return { ...kp, nx: kp.x / w, ny: kp.y / h }
}

// NEW: estat anterior per calcular fps i velocitats
let _prevTime = 0
let _prevNormByName = null  // { name: { nx, ny } }



/* -----------------------------
   EMISSIÓ DE FEATURES (nou)
------------------------------*/
// NEW: exposem un event "features" cap al pare (App.vue) perquè el panell pugui pintar
const emit = defineEmits(['features'])

// NEW: emissor amb throttle (10Hz) per no saturar la UI del panell
const emitFeaturesThrottled = (() => {
  let last = 0
  return (payload) => {
    const now = performance.now()
    if (now - last > 100) {
      emit('features', payload)
      last = now
    }
  }
})()

/* -----------------------------
   UTILITATS DE CÀMERA
------------------------------*/
async function listVideoInputs () {
  if (!navigator.mediaDevices?.enumerateDevices) return
  const all = await navigator.mediaDevices.enumerateDevices()
  const cams = all.filter(d => d.kind === 'videoinput')

  devices.value = cams.map((d, idx) => ({
    deviceId: d.deviceId,
    label: d.label || `Camera ${idx + 1}`
  }))

  if (!selectedId.value && devices.value.length) {
    selectedId.value = devices.value[0].deviceId
  }
}

async function startCamera (deviceId = '') {
  // Atura l’stream anterior si existeix
  if (currentStream.value) {
    currentStream.value.getTracks().forEach(t => t.stop())
    currentStream.value = null
  }

  // Construeix constraints
  const constraints = deviceId
    ? { video: { deviceId: { exact: deviceId } }, audio: false }
    : { video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false }

  // Demana permís i obté el MediaStream
  const stream = await navigator.mediaDevices.getUserMedia(constraints)
  currentStream.value = stream

  // Assigna al <video> i reprodueix
  const v = videoEl.value
  if (v) {
    v.srcObject = stream
    try { await v.play() } catch (e) { console.error('No s’ha pogut iniciar el vídeo:', e) }
  }

  // Un cop concedit el permís, els labels ja són llegibles
  await listVideoInputs()
}

/* -----------------------------
   DRAW (esquelet sobre canvas)
------------------------------*/
function drawSkeleton(ctx, keypoints) {
  if (!ctx || !keypoints?.length) return

  // Reseteja canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // Línies entre punts adjacents
  const pairs = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet)
  ctx.lineWidth = 2
  ctx.strokeStyle = '#ffffff'
  for (const [i, j] of pairs) {
    const a = keypoints[i], b = keypoints[j]
    if (!a || !b) continue
    if ((a.score ?? 1) < 0.3 || (b.score ?? 1) < 0.3) continue
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }

  // Punts
  ctx.fillStyle = '#ffffff'
  for (const kp of keypoints) {
    if ((kp.score ?? 1) < 0.3) continue
    ctx.beginPath()
    ctx.arc(kp.x, kp.y, 3.5, 0, Math.PI * 2)
    ctx.fill()
  }
}
/* -----------------------------
   BUCLE PRINCIPAL (estima + dibuixa)
------------------------------*/
async function loop() {
  const video = videoEl.value
  const canvas = canvasRef.value
  if (!video || !canvas || !detector) return

  // Assegura mida canvas = mida vídeo
  if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
  }

  // Estima la pose (1 cos) i dibuixa
  const poses = await detector.estimatePoses(video, {
    maxPoses: 1,
    flipHorizontal: true // mirall (més natural en "selfie")
  })

  const ctx = canvas.getContext('2d')

  // --- keypoints i dibuix ---
  let keypoints = []
  if (poses[0]?.keypoints) {
    keypoints = poses[0].keypoints
    drawSkeleton(ctx, keypoints)
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  // --- Build features snapshot (normalitzades, angles, inclinacions, velocitats, EMA FPS) ---
  const tNow = performance.now()
  const dt = _prevTime ? (tNow - _prevTime) / 1000 : 0
  const fpsNow = dt > 0 ? 1 / dt : 0
  _prevTime = tNow
  // NEW: suavitzat d’FPS
  const fpsSmooth = (_fpsEma = ema(_fpsEma, fpsNow, 0.2))

  // Índex per nom
  const byName = {}
  for (const kp of keypoints) {
    if (!kp) continue
    byName[kp.name ?? ''] = kp
  }
  const L = (name) => byName[name]

  // Normalització a [0,1]
  const W = video.videoWidth || canvas.width
  const H = video.videoHeight || canvas.height
  const normByName = {}
  for (const kp of keypoints) {
    if (!kp) continue
    const name = kp.name ?? ''
    normByName[name] = normalizeKP(kp, W, H)
  }

  // Velocitats lineals (unitats normalitzades/s) per punts clau
  const trackNames = ['left_wrist','right_wrist','left_ankle','right_ankle','nose']
  const velocities = {}
  for (const n of trackNames) {
    const cur = normByName[n]
    const prev = _prevNormByName?.[n]
    if (cur && prev && dt > 0) {
      const vx = (cur.nx - prev.nx) / dt
      const vy = (cur.ny - prev.ny) / dt
      const v  = Math.hypot(vx, vy)
      velocities[n] = { vx, vy, v }
    } else {
      velocities[n] = { vx: null, vy: null, v: null }
    }
  }
  _prevNormByName = normByName

  // Angles (graus) – colzes, genolls, malucs
  const angles = {
    leftElbow:  angleABC(L('left_shoulder'),  L('left_elbow'),  L('left_wrist')),
    rightElbow: angleABC(L('right_shoulder'), L('right_elbow'), L('right_wrist')),
    leftKnee:   angleABC(L('left_hip'),       L('left_knee'),   L('left_ankle')),
    rightKnee:  angleABC(L('right_hip'),      L('right_knee'),  L('right_ankle')),
    leftHip:    angleABC(L('left_shoulder'),  L('left_hip'),    L('left_knee')),
    rightHip:   angleABC(L('right_shoulder'), L('right_hip'),   L('right_knee'))
  }

  // NEW: velocitat angular (°/s) – diferència d’angle / dt
  const angularVelocities = {}
  if (dt > 0) {
    for (const k of Object.keys(angles)) {
      const cur = angles[k]
      const prev = _prevAngles[k]
      angularVelocities[k] = (Number.isFinite(cur) && Number.isFinite(prev))
        ? (cur - prev) / dt
        : null
      _prevAngles[k] = cur
    }
  } else {
    for (const k of Object.keys(angles)) angularVelocities[k] = null
  }

  // Inclinacions (graus) – espatlles, malucs, tronc
  const inclinations = {
    shoulders: inclinationDeg(L('left_shoulder'), L('right_shoulder')),
    hips:      inclinationDeg(L('left_hip'),      L('right_hip')),
    torso:     (function() {
      const sL = L('left_shoulder'), sR = L('right_shoulder')
      const hL = L('left_hip'),      hR = L('right_hip')
      const sMid = (sL && sR) ? { x: (sL.x + sR.x)/2, y: (sL.y + sR.y)/2 } : null
      const hMid = (hL && hR) ? { x: (hL.x + hR.x)/2, y: (hL.y + hR.y)/2 } : null
      return inclinationDeg(hMid, sMid)
    })()
  }

  // Normalitzades (exemples)
  const shoulderWidth = (L('left_shoulder') && L('right_shoulder')) ? dist(L('left_shoulder'), L('right_shoulder')) : null
  const hipWidth      = (L('left_hip')      && L('right_hip'))      ? dist(L('left_hip'),      L('right_hip'))      : null
  const diag = Math.hypot(W, H) || 1
  const normalized = {
    shoulderWidth_px: shoulderWidth,
    hipWidth_px: hipWidth,
    shoulderWidth_norm: shoulderWidth != null ? (shoulderWidth / diag) : null,
    hipWidth_norm: hipWidth != null ? (hipWidth / diag) : null,
    nose_norm: normByName['nose'] ? { x: normByName['nose'].nx, y: normByName['nose'].ny } : null
  }

  // Score mig (igual que abans)
  const scores = keypoints.map(k => k?.score ?? 0).filter(Number.isFinite)
  const meanScore = scores.length ? (scores.reduce((a,b)=>a+b,0)/scores.length) : 0

  // Snapshot final (manté antics + nous)
  const features = {
    fps: fpsNow,
    fpsSmooth,                  // NEW: FPS suavitzat (EMA)
    score: meanScore,
    keypoints: keypoints.map(k => ({
      name: k.name ?? null,
      x: k.x, y: k.y, score: k.score
    })),
    angles,
    angularVelocities,          // NEW: velocitat angular (°/s)
    inclinations,
    velocities,
    normalized
  }

  // Envia al pare (throttle 10Hz)
  emitFeaturesThrottled(features)

  rafId = requestAnimationFrame(loop)
}



/* -----------------------------
   CICLE DE VIDA
------------------------------*/
onMounted(async () => {
  // Inicialitza TF a WebGL
  await tf.setBackend('webgl')
  await tf.ready()

  try {
    await startCamera()

    // Crea detector MoveNet (Lightning)
    detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true
      }
    )

    // Inicia el bucle
    rafId = requestAnimationFrame(loop)
  } catch (err) {
    console.error('Error inicialitzant càmera o detector:', err)
    alert('No s’ha pogut inicialitzar la càmera o el model de posició.')
  } finally {
    if (navigator.mediaDevices?.addEventListener) {
      onDeviceChange.value = async () => { await listVideoInputs() }
      navigator.mediaDevices.addEventListener('devicechange', onDeviceChange.value)
    }
  }
})

onBeforeUnmount(() => {
  // Atura stream i listeners
  if (currentStream.value) {
    currentStream.value.getTracks().forEach(t => t.stop())
    currentStream.value = null
  }
  if (navigator.mediaDevices?.removeEventListener && onDeviceChange.value) {
    navigator.mediaDevices.removeEventListener('devicechange', onDeviceChange.value)
  }
  // Atura raf
  if (rafId) cancelAnimationFrame(rafId)
  // Allibera detector si ho permet
  try { detector?.dispose?.() } catch {}
})

/* -----------------------------
   WATCHERS
------------------------------*/
watch(selectedId, (id) => {
  if (id) startCamera(id)
})
</script>

<template>
  <div class="skeleton-wrap">
    <!-- Àrea de vídeo + canvas overlay -->
    <div class="stage">
      <!-- playsinline evita auto-fullscreen a mòbil; muted+autoplay ajuda amb autoplay -->
      <video ref="videoEl" playsinline muted autoplay class="video"></video>
      <canvas ref="canvasRef" class="overlay"></canvas>
    </div>

    <!-- Selector de càmera sota el vídeo -->
    <div class="camera-select">
      <select v-model="selectedId" class="select">
        <option v-for="d in devices" :key="d.deviceId" :value="d.deviceId">
          {{ d.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
/* Container: stack video and select vertically to save horizontal space */
.skeleton-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

/* Video frame with fixed aspect ratio and rounded corners */
.stage {
  position: relative;
  width: min(100%, 720px);
  aspect-ratio: 4 / 3;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
}

/* The video element fills the frame */
.video {
  width: 100%;
  height: 100%;
  object-fit: contain; /* keep proportions without cropping */
  display: block;
}

/* Canvas overlay on top of video */
.overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* Simple select below the video */
.camera-select {
  width: min(100%, 720px);
}

.camera-select .select {
  width: 100%;
  padding: 6px 8px;
}
</style>
