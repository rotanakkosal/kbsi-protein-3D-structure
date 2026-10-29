import { Vector3 } from "three";

/**
 * Per-frame state of a pipeline stage change, shared by the transition driver, the camera rig
 * and the stage groups. Kept outside React so animation never triggers re-renders.
 */
export const pipelineRuntime = {
  active: false,
  /** +1 forward (next stage), −1 back */
  direction: 1 as 1 | -1,
  /** 0 → 1 over the whole change */
  progress: 0,
  outgoing: { scale: 1, opacity: 1 },
  incoming: { scale: 1, opacity: 0 },
  /** Debug only (exposed with ?debug): speeds up or slows down the stages' own animations */
  speed: 1,
  /** Debug only: contact shadows on or off (to measure their cost) */
  shadows: true,
};

/** Frame time for stage animations: capped against hitches, scaled by the debug speed. */
export const stageDelta = (delta: number) => Math.min(delta, 0.1) * pipelineRuntime.speed;

export interface StageFraming {
  target: Vector3;
  /** Radius of the sphere that should fill the free part of the view */
  radius: number;
  /** Preferred view direction (target → camera) */
  direction: Vector3;
}

/** Where a stage's contact shadow lies: a horizontal plane under its objects */
export interface StageShadow {
  /** Centre of the shadow plane */
  at: [number, number, number];
  /** Width and depth of the plane */
  size: [number, number];
  /** How far above the plane objects still cast a shadow */
  far: number;
}

export const shadow = (at: [number, number, number], size: [number, number], far: number): StageShadow => ({ at, size, far });

/** A ground shadow under whatever a framing shows: just below its sphere, as wide as it */
export const shadowUnder = (f: StageFraming): StageShadow =>
  shadow([f.target.x, f.target.y - f.radius * 0.82, f.target.z], [f.radius * 2.6, f.radius * 2.6], f.radius * 1.7);

export const framing = (target: [number, number, number], radius: number, direction: [number, number, number]): StageFraming => ({
  target: new Vector3(...target),
  radius,
  direction: new Vector3(...direction).normalize(),
});
