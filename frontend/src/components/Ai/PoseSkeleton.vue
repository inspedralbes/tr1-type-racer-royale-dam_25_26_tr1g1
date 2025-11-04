<!-- src/components/PoseSkeleton.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { calculateAngle, KEYPOINTS } from "./analysis.js";

// TensorFlow.js + backend WebGL per acceleració al navegador
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
// Model de pose (MoveNet) via el paquet "pose-detection"
import * as poseDetection from "@tensorflow-models/pose-detection";

const videoRef = ref(null);
const canvasRef = ref(null);

// --- Nous estats per a la sessió ---
const sessionState = ref("connecting"); // connecting, waiting, exercise, finished
const lobbyTime = ref(300); // 5 minuts en segons
const exerciseTime = ref(60);
const currentExercise = ref({ name: "Esperant...", description: "" });
const leaderboard = ref([]);

// Estat per al comptador de repeticions local
const repCount = ref(0);
const exerciseState = ref("up"); // 'up' o 'down'

let ws = null; // WebSocket

let currentStream = null; // guardem l'stream actiu per poder-lo aturar
let detector = null; // detector MoveNet
let rafId = null; // id de requestAnimationFrame del bucle

// 1) Obrir la càmera
async function startCamera() {
  try {
    // Parem l'stream anterior si n'hi hagués
    if (currentStream) {
      currentStream.getTracks().forEach((t) => t.stop());
      currentStream = null;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
      audio: false,
    });

    currentStream = stream;
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      await videoRef.value.play();
    }
  } catch (err) {
    console.error("No s’ha pogut accedir a la càmera:", err);
    alert(
      "No s’ha pogut accedir a la càmera. Revisa permisos i que hi hagi una webcam disponible."
    );
  }
}

// --- Lògica de detecció d'exercicis ---
function detectExercise(keypoints) {
  if (currentExercise.value.name === "Squats") {
    countSquats(keypoints);
  }
  // Aquí es podrien afegir més crides a altres funcions de recompte
  // else if (currentExercise.value.name === "Push-ups") { ... }
}

// Funció per comptar esquats (squats)
function countSquats(keypoints) {
  if (!keypoints) return;

  const leftHip = keypoints[KEYPOINTS.left_hip];
  const rightHip = keypoints[KEYPOINTS.right_hip];
  const leftKnee = keypoints[KEYPOINTS.left_knee];
  const rightKnee = keypoints[KEYPOINTS.right_knee];
  const leftAnkle = keypoints[KEYPOINTS.left_ankle];
  const rightAnkle = keypoints[KEYPOINTS.right_ankle];

  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

  // Llindars per a l'estat 'down' (esquat) i 'up' (dempeus)
  const downThreshold = 110; // Angle del genoll per sota de 110 graus
  const upThreshold = 160; // Angle del genoll per sobre de 160 graus

  if (
    exerciseState.value === "up" &&
    leftKneeAngle < downThreshold &&
    rightKneeAngle < downThreshold
  ) {
    exerciseState.value = "down";
  } else if (
    exerciseState.value === "down" &&
    leftKneeAngle > upThreshold &&
    rightKneeAngle > upThreshold
  ) {
    exerciseState.value = "up";
    repCount.value++;

    // Enviar actualització al servidor
    const points = repCount.value * 100;
    ws.send(
      JSON.stringify({
        type: "ACT_NIVELL",
        usuari: "el_meu_usuari", // TODO: Canviar per l'usuari real
        sala_id: "sala123", // TODO: Canviar per la sala real
        repeticions: repCount.value,
        punts: points,
      })
    );
  }
}

// 2) Dibuixar esquelet (punts + línies) al canvas
function drawSkeleton(ctx, keypoints) {
  // Neteja el canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Línies entre punts adjacents
  const pairs = poseDetection.util.getAdjacentPairs(
    poseDetection.SupportedModels.MoveNet
  );
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#ffffff";
  for (const [i, j] of pairs) {
    const a = keypoints[i],
      b = keypoints[j];
    if (!a || !b) continue;
    if ((a.score ?? 1) < 0.3 || (b.score ?? 1) < 0.3) continue;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  // Punts
  ctx.fillStyle = "#ffffff";
  for (const kp of keypoints) {
    if ((kp.score ?? 1) < 0.3) continue;
    ctx.beginPath();
    ctx.arc(kp.x, kp.y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 3) Bucle principal: estima la pose i dibuixa
async function loop() {
  const video = videoRef.value;
  const canvas = canvasRef.value;
  if (!video || !canvas || !detector) return;

  // Assegura que el canvas tingui la mateixa mida que el vídeo
  if (
    canvas.width !== video.videoWidth ||
    canvas.height !== video.videoHeight
  ) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }

  // Estima la pose (un únic cos) i dibuixa
  const poses = await detector.estimatePoses(video, {
    maxPoses: 1,
    flipHorizontal: true, // mirall (més natural en "selfie")
  });

  const ctx = canvas.getContext("2d");
  if (poses[0]?.keypoints) {
    drawSkeleton(ctx, poses[0].keypoints);
    // Crida a la funció genèrica de detecció
    detectExercise(poses[0].keypoints);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  rafId = requestAnimationFrame(loop);
}

// --- Gestió del WebSocket ---
function setupWebSocket() {
  ws = new WebSocket("ws://localhost:5000");

  ws.onopen = () => {
    console.log("Connectat al servidor de la sessió.");
    // TODO: Obtenir sala_id i usuari_id (p. ex. de la URL o Pinia)
    ws.send(
      JSON.stringify({
        type: "UNIR_SALA",
        usuari: "Usuari_" + Math.floor(Math.random() * 1000), // TODO: Canviar per l'usuari real
        sala_id: "sala123", // TODO: Canviar per la sala real
        exercici: "fullbody", // Canviat a la rutina fullbody
      })
    );
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log("Missatge rebut:", message);

    switch (message.type) {
      case "LOBBY_TIMER":
        lobbyTime.value = message.time;
        if (sessionState.value === "connecting") {
          sessionState.value = "waiting";
        }
        break;
      case "SESSIO_INICIA":
        sessionState.value = "exercise";
        break;
      case "PROPER_EXERCICI":
        currentExercise.value = message.exercise;
        exerciseTime.value = message.duration;
        repCount.value = 0; // Reiniciem comptador per al nou exercici
        break;
      case "EXERCISE_TIMER":
        exerciseTime.value = message.time;
        break;
      case "LEADERBOARD_ACT":
        leaderboard.value = message.data;
        break;
      case "SESSIO_ACABA":
        sessionState.value = "finished";
        leaderboard.value = message.final_leaderboard;
        break;
      case "ERROR":
        alert(`Error del servidor: ${message.missatge}`);
        break;
    }
  };
}

// 4) Inicialització i neteja
onMounted(async () => {
  // Inicialitza TF amb backend webgl (accelera al GPU del navegador)
  await tf.setBackend("webgl");
  await tf.ready();

  // Inicia la càmera
  await startCamera();

  // Configura la connexió WebSocket
  setupWebSocket();

  // Crea el detector MoveNet (variant "Lightning" = ràpida)
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      enableSmoothing: true,
    }
  );

  // Comença el bucle
  loop();
});

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId);
  if (currentStream) currentStream.getTracks().forEach((t) => t.stop());
  if (ws) ws.close();
  detector = null;
});
</script>

<template>
  <div class="wrap">
    <div class="stage">
      <video ref="videoRef" playsinline muted autoplay class="video"></video>
      <canvas ref="canvasRef" class="overlay"></canvas>

      <!-- Display d'estat de la sessió -->
      <div v-if="sessionState === 'waiting'" class="session-info">
        <h2>Sala d'Espera</h2>
        <p>
          La sessió començarà en: {{ Math.floor(lobbyTime / 60) }}:{{
            ("0" + (lobbyTime % 60)).slice(-2)
          }}
        </p>
      </div>

      <div v-if="sessionState === 'exercise'" class="session-info">
        <h2>{{ currentExercise.name }}</h2>
        <p>Temps restant: {{ exerciseTime }}s</p>
      </div>

      <!-- Marcador de repeticions a baix a l'esquerra -->
      <div v-if="sessionState === 'exercise'" class="reps-marker">
        REPS: {{ repCount }}
      </div>

      <!-- Leaderboard (Marcador) -->
      <div class="leaderboard">
        <h3>Classificació</h3>
        <ol>
          <li v-for="user in leaderboard" :key="user.usuari">
            {{ user.usuari }}: {{ user.punts }} pts
          </li>
        </ol>
      </div>

      <div v-if="sessionState === 'finished'" class="session-info">
        <h2>Sessió Finalitzada!</h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  width: 100%;
  height: 100%;
}
/* Marc del vídeo */
.stage {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
}

/* El vídeo i el canvas ocupen exactament el mateix espai */
.video,
.overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Default to cover */
}

.session-info {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  text-align: center;
  z-index: 10;
}

.leaderboard {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  width: 200px;
  z-index: 10;
}

.leaderboard h3 {
  margin-top: 0;
}

.reps-marker {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #4caf50;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 2rem;
  font-weight: bold;
  z-index: 10;
}

.counter-display {
  position: relative;
}
</style>
