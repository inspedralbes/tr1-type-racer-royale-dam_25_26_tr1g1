<template>
  <v-container>
    <h1>Game Page</h1>
    <v-row>
      <v-col cols="12" md="8">
        <div style="position: relative;">
          <video ref="videoRef" autoplay playsinline style="width: 100%;"></video>
          <canvas ref="canvasRef" style="position: absolute; top: 0; left: 0;"></canvas>
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <!-- Aquí podrías mostrar información del juego, como puntuación, etc. -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';

const videoRef = ref(null);
const canvasRef = ref(null);
let stream = null;
let detector = null;
let animationFrameId = null;

const setupDetector = async () => {
  await tf.ready();
  const model = poseDetection.SupportedModels.MoveNet;
  detector = await poseDetection.createDetector(model);
  console.log('Detector loaded');
};

const detectPose = async () => {
  if (detector && videoRef.value && canvasRef.value) {
    const video = videoRef.value;
    const canvas = canvasRef.value;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const poses = await detector.estimatePoses(video);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (poses.length > 0) {
      drawPose(poses[0], ctx);
    }
  }
  animationFrameId = requestAnimationFrame(detectPose);
};

const drawPose = (pose, ctx) => {
  if (pose.keypoints) {
    // Draw keypoints
    ctx.fillStyle = 'Red';
    for (const keypoint of pose.keypoints) {
      if (keypoint.score > 0.5) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Draw skeleton
    ctx.strokeStyle = 'White';
    ctx.lineWidth = 2;
    const adjacentKeyPoints = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet);
    for (const [i, j] of adjacentKeyPoints) {
      const kp1 = pose.keypoints[i];
      const kp2 = pose.keypoints[j];
      if (kp1.score > 0.5 && kp2.score > 0.5) {
        ctx.beginPath();
        ctx.moveTo(kp1.x, kp1.y);
        ctx.lineTo(kp2.x, kp2.y);
        ctx.stroke();
      }
    }
  }
};

onMounted(async () => {
  try {
    await setupDetector();
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      videoRef.value.addEventListener('loadeddata', () => {
        detectPose();
      });
    }
  } catch (error) {
    console.error('Error setting up the game:', error);
    alert('Error al configurar la detección de pose.');
  }
});

onUnmounted(() => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>