<!-- src/components/PoseSkeleton.vue -->
<script setup>
/*
  Objectiu:
  - Obrir la webcam i mostrar-ne el vídeo.
  - Carregar MoveNet (Lightning) i estimar la posició del cos.
  - Dibuixar punts i línies (esquelet) en un canvas a sobre del vídeo.
*/

import { ref, onMounted, onBeforeUnmount } from 'vue'

// TensorFlow.js + backend WebGL per acceleració al navegador
import * as tf from '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-backend-webgl'
// Model de pose (MoveNet) via el paquet "pose-detection"
import * as poseDetection from '@tensorflow-models/pose-detection'

const videoRef = ref(null)
const canvasRef = ref(null)

let currentStream = null        // guardem l'stream actiu per poder-lo aturar
let detector = null             // detector MoveNet
let rafId = null                // id de requestAnimationFrame del bucle

// 1) Obrir la càmera
async function startCamera() {
  try {
    // Parem l'stream anterior si n'hi hagués
    if (currentStream) {
      currentStream.getTracks().forEach(t => t.stop())
      currentStream = null
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false
    })

    currentStream = stream
    if (videoRef.value) {
      videoRef.value.srcObject = stream
      await videoRef.value.play()
    }
  } catch (err) {
    console.error('No s’ha pogut accedir a la càmera:', err)
    alert('No s’ha pogut accedir a la càmera. Revisa permisos i que hi hagi una webcam disponible.')
  }
}

// 2) Dibuixar esquelet (punts + línies) al canvas
function drawSkeleton(ctx, keypoints) {
  // Neteja el canvas
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

// 3) Bucle principal: estima la pose i dibuixa
async function loop() {
  const video = videoRef.value
  const canvas = canvasRef.value
  if (!video || !canvas || !detector) return

  // Assegura que el canvas tingui la mateixa mida que el vídeo
  if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
  }

  // Estima la pose (un únic cos) i dibuixa
  const poses = await detector.estimatePoses(video, {
    maxPoses: 1,
    flipHorizontal: true // mirall (més natural en "selfie")
  })

  const ctx = canvas.getContext('2d')
  if (poses[0]?.keypoints) {
    drawSkeleton(ctx, poses[0].keypoints)
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  rafId = requestAnimationFrame(loop)
}

// 4) Inicialització i neteja
onMounted(async () => {
  // Inicialitza TF amb backend webgl (accelera al GPU del navegador)
  await tf.setBackend('webgl')
  await tf.ready()

  // Inicia la càmera
  await startCamera()

  // Crea el detector MoveNet (variant "Lightning" = ràpida)
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      enableSmoothing: true
    }
  )

  // Comença el bucle
  loop()
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (currentStream) currentStream.getTracks().forEach(t => t.stop())
  detector = null
})
</script>

<template>
  <div class="wrap">
    <!-- Vídeo de la webcam -->
    <div class="stage">
      <video ref="videoRef" playsinline muted autoplay class="video"></video>
      <!-- Canvas transparent a sobre on dibuixem l’esquelet -->
      <canvas ref="canvasRef" class="overlay"></canvas>
    </div>
  </div>
</template>

<style scoped>
/* Contenidor vertical senzill */
.wrap {
  display: inline-flex;
  flex-direction: column;
  gap: 10px;
  width: min(100%, 720px);
}

/* Marc del vídeo */
.stage {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
}

/* El vídeo i el canvas ocupen exactament el mateix espai */
.video, .overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
