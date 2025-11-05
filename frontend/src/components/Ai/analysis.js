// analysis.js
import * as poseDetection from "@tensorflow-models/pose-detection";

export function calculateAngle(pointA, pointB, pointC) {
  if (!pointA || !pointB || !pointC) {
    return 0;
  }

  const radians =
    Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
    Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);

  if (angle > 180) {
    angle = 360 - angle;
  }

  return angle;
}

export const KEYPOINTS = {
  nose: 0,
  left_eye: 1,
  right_eye: 2,
  left_ear: 3,
  right_ear: 4,
  left_shoulder: 5,
  right_shoulder: 6,
  left_elbow: 7,
  right_elbow: 8,
  left_wrist: 9,
  right_wrist: 10,
  left_hip: 11,
  right_hip: 12,
  left_knee: 13,
  right_knee: 14,
  left_ankle: 15,
  right_ankle: 16,
};

// Funció per comptar esquats (squats)
export function countSquats(keypoints, exerciseState) {
  if (!keypoints) return { newState: exerciseState, repDone: false };

  const leftHip = keypoints[KEYPOINTS.left_hip];
  const rightHip = keypoints[KEYPOINTS.right_hip];
  const leftKnee = keypoints[KEYPOINTS.left_knee];
  const rightKnee = keypoints[KEYPOINTS.right_knee];
  const leftAnkle = keypoints[KEYPOINTS.left_ankle];
  const rightAnkle = keypoints[KEYPOINTS.right_ankle];

  if (
    !leftHip ||
    !rightHip ||
    !leftKnee ||
    !rightKnee ||
    !leftAnkle ||
    !rightAnkle
  ) {
    return { newState: exerciseState, repDone: false };
  }

  if (
    leftHip.score < 0.3 ||
    rightHip.score < 0.3 ||
    leftKnee.score < 0.3 ||
    rightKnee.score < 0.3 ||
    leftAnkle.score < 0.3 ||
    rightAnkle.score < 0.3
  ) {
    return { newState: exerciseState, repDone: false };
  }

  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

  // Llindars per a l'estat 'down' (esquat) i 'up' (dempeus)
  const downThreshold = 110; // Angle del genoll per sota de 110 graus
  const upThreshold = 160; // Angle del genoll per sobre de 160 graus

  let newState = exerciseState;
  let repDone = false;

  if (
    exerciseState === "up" &&
    leftKneeAngle < downThreshold &&
    rightKneeAngle < downThreshold
  ) {
    newState = "down";
    console.log("detected down");
  } else if (
    exerciseState === "down" &&
    leftKneeAngle > upThreshold &&
    rightKneeAngle > upThreshold
  ) {
    newState = "up";
    repDone = true;
    console.log("detected up");
  }
  return { newState, repDone };
}

export async function estimatePose(detector, video) {
  if (!detector || !video) return null;

  const poses = await detector.estimatePoses(video, {
    maxPoses: 1,
    flipHorizontal: true, // mirall (més natural en "selfie")
  });

  return poses[0] || null;
}

export function drawSkeleton(ctx, keypoints) {
  // Neteja el canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

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
