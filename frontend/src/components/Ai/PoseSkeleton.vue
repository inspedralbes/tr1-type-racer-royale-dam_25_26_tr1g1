<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import {
  countSquats,
  estimatePose,
  drawSkeleton,
  countPushups,
  countJumpingJacks,
  countGluteBridges,
  countMountainClimbers,
  countHighKnees,
  countFireHydrants,
  checkPlank,
  checkSupermanHold,
} from "./analysis.js";
import { useWebSocketStore } from "@/stores/websocket";

import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as poseDetection from "@tensorflow-models/pose-detection";

const emit = defineEmits([
  "rep",
  "cameras",
  "in-pose",
  "loading-model",
  "model-loaded",
]);

const props = defineProps({
  currentExercise: {
    type: Object,
    required: true,
  },
});

const videoRef = ref(null);
const canvasRef = ref(null);

const repCount = ref(0);
const exerciseState = ref("up"); // 'up' or 'down'
const cameras = ref([]);

const getCameras = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  cameras.value = devices.filter((device) => device.kind === "videoinput");
  emit("cameras", cameras.value);
};

const websocketStore = useWebSocketStore();

let currentStream = null;
let detector = null;
let rafId = null;

async function startCamera(deviceId = null) {
  try {
    if (currentStream) {
      currentStream.getTracks().forEach((t) => t.stop());
      currentStream = null;
    }

    const constraints = {
      video: {
        facingMode: "user",
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
      audio: false,
    };
    if (deviceId) {
      constraints.video.deviceId = { exact: deviceId };
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

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

function detectExercise(keypoints) {
  if (!props.currentExercise) return;

  let repDone = false;
  let newState = exerciseState.value;
  let inPose = keypoints && keypoints.length > 0; // Default to true if keypoints are detected

  switch (props.currentExercise.name) {
    case "Squat":
    case "Jump Squats":
    case "Lunges":
      ({ newState, repDone } = countSquats(keypoints, exerciseState.value));
      break;
    case "Push-Up":
    case "Triceps Dips":
    case "Wall Push-ups":
    case "Burpees":
    case "Diamond Push-ups":
      ({ newState, repDone } = countPushups(keypoints, exerciseState.value));
      break;
    case "Jumping Jacks":
      ({ newState, repDone } = countJumpingJacks(
        keypoints,
        exerciseState.value
      ));
      break;
    case "Glute Bridge":
      ({ newState, repDone } = countGluteBridges(
        keypoints,
        exerciseState.value
      ));
      break;
    case "Mountain Climbers":
      ({ newState, repDone } = countMountainClimbers(
        keypoints,
        exerciseState.value
      ));
      break;
    case "High Knees":
      ({ newState, repDone } = countHighKnees(keypoints, exerciseState.value));
      break;
    case "Fire Hydrants":
      ({ newState, repDone } = countFireHydrants(
        keypoints,
        exerciseState.value
      ));
      break;
    case "Plank":
      inPose = checkPlank(keypoints);
      break;
    case "Superman Hold":
      inPose = checkSupermanHold(keypoints);
      break;
  }

  emit("in-pose", inPose);

  exerciseState.value = newState;
  if (repDone) {
    emit("rep");
    repCount.value++;
  }
}

// 3) Bucle principal: estima la pose i dibuixa
async function loop() {
  const video = videoRef.value;
  const canvas = canvasRef.value;
  if (!video || !canvas || !detector) return;

  if (
    canvas.width !== video.videoWidth ||
    canvas.height !== video.videoHeight
  ) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }

  const pose = await estimatePose(detector, video);

  const ctx = canvas.getContext("2d");
  if (pose?.keypoints) {
    drawSkeleton(ctx, pose.keypoints);
    detectExercise(pose.keypoints);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  rafId = requestAnimationFrame(loop);
}

// 4) Inicialització i neteja
onMounted(async () => {
  emit("loading-model");
  await tf.setBackend("webgl");
  await tf.ready();

  await getCameras();
  await startCamera();

  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      enableSmoothing: true,
    }
  );

  emit("model-loaded");
  loop();
});

defineExpose({ startCamera, getCameras });

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId);
  if (currentStream) currentStream.getTracks().forEach((t) => t.stop());
  detector = null;
});
</script>

<template>
  <div class="wrap">
    <div class="stage">
      <video ref="videoRef" playsinline muted autoplay class="video"></video>
      <canvas ref="canvasRef" class="overlay"></canvas>
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
  transform: scaleX(-1);
}

.overlay {
  z-index: -1;
}
</style>
