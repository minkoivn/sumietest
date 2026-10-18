export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  run: boolean;
  interact: boolean;
}

export interface MountainConfig {
  roughness: number;
  color: string;
  opacity: number;
  yOffset: number;
  blur: number;
  speed: number;
  hasTrees: boolean;
  treeProb?: number;
}