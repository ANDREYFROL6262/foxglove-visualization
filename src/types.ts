export type Config = {
  frequency: number;
  inputTopics: {
    mode: string;
    controlInput: string;
    odometry: string;
  }
  outputTopics: {
    box: string;
    trace: string;
    arch: string;
  }
  scale: {
    x: number;
    y: number;
    z: number;
  }
}

export const defaultConfig: Config = {
  frequency: 60,
  inputTopics: {
    mode: "/control/mode",
    controlInput: "control/input",
    odometry: "/ekf/odometry/filtered"
  },
  outputTopics: {
    box: "/improved_visualization/box",
    trace: "/improved_visualization/trace",
    arch: "/improved_visualization/arch"
  },
  scale: {
    x: 0.505,
    y: 0.313,
    z: 0.2525,
  }
};

export type Stamp = {
  sec: number;
  nsec: number;
}

export type Pose = {
  position: {
    x: number;
    y: number;
    z: number;
  }
  orientation: {
    x: number;
    y: number;
    z: number;
    w: number;
  }
}