function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function buildArch(steering: number) {
  let angle = 90 * steering;
  let numPoints = 10;
  let arr = [{ x: 0, y: 0, z: 0 }];
  for (let i = 1; i < numPoints; i++) {
    let x =
      arr[i - 1]!.x +
      (1 / numPoints) * Math.cos(degreesToRadians(angle * (i / numPoints)));
    let y =
      arr[i - 1]!.y +
      (1 / numPoints) * Math.sin(degreesToRadians(angle * (i / numPoints)));
    arr.push({ x: x, y: y, z: 0 });
  }
  return arr;
}

export function createArchMessage(isActive: boolean, steering: number) {
  let marker = {
    header: {
      frame_id: "base",
      stamp: { sec: 0, nsec: 0 },
      seq: 0,
    },
    id: 0,
    type: isActive ? 4 : 0,
    action: isActive ? 0 : 2,
    scale: { x: 0.04, y: 0, z: 0 },
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
        w: 0.1,
      },
    },
    lifetime: { sec: 2, nsec: 0 },
    color: { r: 10, g: 10, b: 10, a: 1 },
    frame_locked: true,
    points: isActive ? buildArch(steering) : []
  };

  return marker
}