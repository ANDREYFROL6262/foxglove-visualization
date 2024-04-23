import { Stamp } from "./types";

export function createTraceMessage( mode: number, point_id: number, stamp: Stamp) {
  let marker = {
    header: {
      frame_id: "base",
      stamp: stamp,
      seq: 0,
    },
    id: point_id,
    type: 2,
    action: 0,
    scale: { x: 0.05, y: 0.05, z: 0.0001 },
    pose: {
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      orientation: {
        x: 0,
        y: 0,
        z: 0,
        w: 0,
      },
    },
    lifetime: { sec: 2, nsec: 0 },
    color: { r: 0, g: 255, b: 0, a: point_id % 3 == 0 ? 0.5 : 0 },
    frame_locked: true,
  }

  if (mode == 0) {
    marker.color = { r: 0.4, g: 0.4, b: 0.4, a: 1 };
  } else if (mode == 1) {
    marker.color = { r: 0, g: 255, b: 0, a: 1 };
  } else if (mode == 2) {
    marker.color = { r: 255, g: 255, b: 0, a: 1 };
  }

  return marker
}
