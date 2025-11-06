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

export function countPushups(keypoints, exerciseState) {
  if (!keypoints) return { newState: exerciseState, repDone: false };

  const leftShoulder = keypoints[KEYPOINTS.left_shoulder];
  const rightShoulder = keypoints[KEYPOINTS.right_shoulder];
  const leftElbow = keypoints[KEYPOINTS.left_elbow];
  const rightElbow = keypoints[KEYPOINTS.right_elbow];
  const leftWrist = keypoints[KEYPOINTS.left_wrist];
  const rightWrist = keypoints[KEYPOINTS.right_wrist];

  if (
    !leftShoulder ||
    !rightShoulder ||
    !leftElbow ||
    !rightElbow ||
    !leftWrist ||
    !rightWrist
  ) {
    return { newState: exerciseState, repDone: false };
  }

  if (
    leftShoulder.score < 0.3 ||
    rightShoulder.score < 0.3 ||
    leftElbow.score < 0.3 ||
    rightElbow.score < 0.3 ||
    leftWrist.score < 0.3 ||
    rightWrist.score < 0.3
  ) {
    return { newState: exerciseState, repDone: false };
  }

  const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

  const downThreshold = 100;
  const upThreshold = 160;

  let newState = exerciseState;
  let repDone = false;

  if (
    exerciseState === "up" &&
    leftElbowAngle < downThreshold &&
    rightElbowAngle < downThreshold
  ) {
    newState = "down";
  } else if (
    exerciseState === "down" &&
    leftElbowAngle > upThreshold &&
    rightElbowAngle > upThreshold
  ) {
    newState = "up";
    repDone = true;
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

export function countJumpingJacks(keypoints, exerciseState) {
  if (!keypoints) return { newState: exerciseState, repDone: false };

  const leftShoulder = keypoints[KEYPOINTS.left_shoulder];
  const rightShoulder = keypoints[KEYPOINTS.right_shoulder];
  const leftHip = keypoints[KEYPOINTS.left_hip];
  const rightHip = keypoints[KEYPOINTS.right_hip];
  const leftWrist = keypoints[KEYPOINTS.left_wrist];
  const rightWrist = keypoints[KEYPOINTS.right_wrist];

  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !leftWrist || !rightWrist) {
    return { newState: exerciseState, repDone: false };
  }

  if (leftShoulder.score < 0.3 || rightShoulder.score < 0.3 || leftHip.score < 0.3 || rightHip.score < 0.3 || leftWrist.score < 0.3 || rightWrist.score < 0.3) {
    return { newState: exerciseState, repDone: false };
  }

  const leftShoulderAngle = calculateAngle(leftHip, leftShoulder, leftWrist);
  const rightShoulderAngle = calculateAngle(rightHip, rightShoulder, rightWrist);

  const downThreshold = 60; // Arms up
  const upThreshold = 140; // Arms down

  let newState = exerciseState;
  let repDone = false;

  if (exerciseState === 'up' && leftShoulderAngle < downThreshold && rightShoulderAngle < downThreshold) {
    newState = 'down';
  } else if (exerciseState === 'down' && leftShoulderAngle > upThreshold && rightShoulderAngle > upThreshold) {
    newState = 'up';
    repDone = true;
  }

  return { newState, repDone };
}

export function countGluteBridges(keypoints, exerciseState) {
    if (!keypoints) return { newState: exerciseState, repDone: false };

    const leftShoulder = keypoints[KEYPOINTS.left_shoulder];
    const rightShoulder = keypoints[KEYPOINTS.right_shoulder];
    const leftHip = keypoints[KEYPOINTS.left_hip];
    const rightHip = keypoints[KEYPOINTS.right_hip];
    const leftKnee = keypoints[KEYPOINTS.left_knee];
    const rightKnee = keypoints[KEYPOINTS.right_knee];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !leftKnee || !rightKnee) {
        return { newState: exerciseState, repDone: false };
    }

    if (leftShoulder.score < 0.3 || rightShoulder.score < 0.3 || leftHip.score < 0.3 || rightHip.score < 0.3 || leftKnee.score < 0.3 || rightKnee.score < 0.3) {
        return { newState: exerciseState, repDone: false };
    }

    const leftAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightAngle = calculateAngle(rightShoulder, rightHip, rightKnee);

    const downThreshold = 140;
    const upThreshold = 160;

    let newState = exerciseState;
    let repDone = false;

    if (exerciseState === 'up' && (leftAngle < downThreshold && rightAngle < downThreshold)) {
        newState = 'down';
    } else if (exerciseState === 'down' && (leftAngle > upThreshold && rightAngle > upThreshold)) {
        newState = 'up';
        repDone = true;
    }
    return { newState, repDone };
}

export function countMountainClimbers(keypoints, exerciseState) {
    if (!keypoints) return { newState: exerciseState, repDone: false };

    const leftHip = keypoints[KEYPOINTS.left_hip];
    const rightHip = keypoints[KEYPOINTS.right_hip];
    const leftKnee = keypoints[KEYPOINTS.left_knee];
    const rightKnee = keypoints[KEYPOINTS.right_knee];
    const leftAnkle = keypoints[KEYPOINTS.left_ankle];
    const rightAnkle = keypoints[KEYPOINTS.right_ankle];

    if (!leftHip || !rightHip || !leftKnee || !rightKnee || !leftAnkle || !rightAnkle) {
        return { newState: exerciseState, repDone: false };
    }

    if (leftHip.score < 0.3 || rightHip.score < 0.3 || leftKnee.score < 0.3 || rightKnee.score < 0.3 || leftAnkle.score < 0.3 || rightAnkle.score < 0.3) {
        return { newState: exerciseState, repDone: false };
    }

    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

    const downThreshold = 90;
    const upThreshold = 150;

    let newState = exerciseState;
    let repDone = false;

    if (exerciseState === 'up' && (leftKneeAngle < downThreshold || rightKneeAngle < downThreshold)) {
        newState = 'down';
    } else if (exerciseState === 'down' && (leftKneeAngle > upThreshold && rightKneeAngle > upThreshold)) {
        newState = 'up';
        repDone = true;
    }
    return { newState, repDone };
}

export function countHighKnees(keypoints, exerciseState) {
    if (!keypoints) return { newState: exerciseState, repDone: false };

    const leftShoulder = keypoints[KEYPOINTS.left_shoulder];
    const rightShoulder = keypoints[KEYPOINTS.right_shoulder];
    const leftHip = keypoints[KEYPOINTS.left_hip];
    const rightHip = keypoints[KEYPOINTS.right_hip];
    const leftKnee = keypoints[KEYPOINTS.left_knee];
    const rightKnee = keypoints[KEYPOINTS.right_knee];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !leftKnee || !rightKnee) {
        return { newState: exerciseState, repDone: false };
    }

    if (leftShoulder.score < 0.3 || rightShoulder.score < 0.3 || leftHip.score < 0.3 || rightHip.score < 0.3 || leftKnee.score < 0.3 || rightKnee.score < 0.3) {
        return { newState: exerciseState, repDone: false };
    }

    const leftAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightAngle = calculateAngle(rightShoulder, rightHip, rightKnee);

    const downThreshold = 100; // Knee up
    const upThreshold = 150;   // Knee down

    let newState = exerciseState;
    let repDone = false;

    if (exerciseState === 'up' && (leftAngle < downThreshold || rightAngle < downThreshold)) {
        newState = 'down';
    } else if (exerciseState === 'down' && (leftAngle > upThreshold && rightAngle > upThreshold)) {
        newState = 'up';
        repDone = true;
    }
    return { newState, repDone };
}

export function countFireHydrants(keypoints, exerciseState) {
    if (!keypoints) return { newState: exerciseState, repDone: false };

    const leftShoulder = keypoints[KEYPOINTS.left_shoulder];
    const rightShoulder = keypoints[KEYPOINTS.right_shoulder];
    const leftHip = keypoints[KEYPOINTS.left_hip];
    const rightHip = keypoints[KEYPOINTS.right_hip];
    const leftKnee = keypoints[KEYPOINTS.left_knee];
    const rightKnee = keypoints[KEYPOINTS.right_knee];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !leftKnee || !rightKnee) {
        return { newState: exerciseState, repDone: false };
    }

    if (leftShoulder.score < 0.3 || rightShoulder.score < 0.3 || leftHip.score < 0.3 || rightHip.score < 0.3 || leftKnee.score < 0.3 || rightKnee.score < 0.3) {
        return { newState: exerciseState, repDone: false };
    }

    const leftAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightAngle = calculateAngle(rightShoulder, rightHip, rightKnee);

    const downThreshold = 120; // leg lifted
    const upThreshold = 100;   // leg down

    let newState = exerciseState;
    let repDone = false;

    if (exerciseState === 'up' && (leftAngle > downThreshold || rightAngle > downThreshold)) {
        newState = 'down';
    } else if (exerciseState === 'down' && (leftAngle < upThreshold && rightAngle < upThreshold)) {
        newState = 'up';
        repDone = true;
    }
    return { newState, repDone };
}

export function checkPlank(keypoints) {
    if (!keypoints) return false;

    const leftShoulder = keypoints[KEYPOINTS.left_shoulder];
    const rightShoulder = keypoints[KEYPOINTS.right_shoulder];
    const leftHip = keypoints[KEYPOINTS.left_hip];
    const rightHip = keypoints[KEYPOINTS.right_hip];
    const leftAnkle = keypoints[KEYPOINTS.left_ankle];
    const rightAnkle = keypoints[KEYPOINTS.right_ankle];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !leftAnkle || !rightAnkle) {
        return false;
    }

    if (leftShoulder.score < 0.3 || rightShoulder.score < 0.3 || leftHip.score < 0.3 || rightHip.score < 0.3 || leftAnkle.score < 0.3 || rightAnkle.score < 0.3) {
        return false;
    }

    const leftBodyAngle = calculateAngle(leftShoulder, leftHip, leftAnkle);
    const rightBodyAngle = calculateAngle(rightShoulder, rightHip, rightAnkle);

    const plankThreshold = 160;

    return leftBodyAngle > plankThreshold && rightBodyAngle > plankThreshold;
}

export function checkSupermanHold(keypoints) {
    if (!keypoints) return false;

    const leftShoulder = keypoints[KEYPOINTS.left_shoulder];
    const rightShoulder = keypoints[KEYPOINTS.right_shoulder];
    const leftHip = keypoints[KEYPOINTS.left_hip];
    const rightHip = keypoints[KEYPOINTS.right_hip];
    const leftWrist = keypoints[KEYPOINTS.left_wrist];
    const rightWrist = keypoints[KEYPOINTS.right_wrist];
    const leftAnkle = keypoints[KEYPOINTS.left_ankle];
    const rightAnkle = keypoints[KEYPOINTS.right_ankle];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !leftWrist || !rightWrist || !leftAnkle || !rightAnkle) {
        return false;
    }

    if (leftShoulder.score < 0.3 || rightShoulder.score < 0.3 || leftHip.score < 0.3 || rightHip.score < 0.3 || leftWrist.score < 0.3 || rightWrist.score < 0.3 || leftAnkle.score < 0.3 || rightAnkle.score < 0.3) {
        return false;
    }

    // Check if wrists are above shoulders and ankles are above hips
    const armsUp = leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;
    const legsUp = leftAnkle.y < leftHip.y && rightAnkle.y < rightHip.y;

    return armsUp && legsUp;
}