import { Pose } from "./types";

export function createBoxMessage( mode: number, pose: Pose, scale: any ) {
  let marker = {
    header: {
      frame_id: "base",
      stamp: { sec: 0, nsec: 0 },
      seq: 0,
    },
    type: 1,
    action: 0,
    scale: scale,
    pose: pose,
    lifetime: { sec: 4, nsec: 1 },
    color: { r: 0, g: 255, b: 0, a: 1 },
  }

  if (mode == 0) {
    marker.color = { r: 0.4, g: 0.4, b: 0.4, a: 1 };
  } else if (mode == 1) {
    marker.color = { r: 0, g: 255, b: 0, a: 1 };
  } else if (mode == 2) {
    marker.color = { r: 255, g: 255, b: 0, a: 1 };
  }

  marker.pose.position.z = 0.05;

  return marker
}
