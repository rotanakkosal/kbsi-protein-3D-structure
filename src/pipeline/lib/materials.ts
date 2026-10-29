import { BackSide, Color, DoubleSide, FrontSide, MeshPhysicalMaterial } from "three";

/*
 * Shared lab materials for the pipeline, tuned for contrast against the stage backdrop.
 * Glass and clear plastic get a darker fresnel rim, so their outlines stay visible on a pale
 * background; liquids use fixed, readable colours. Materials marked `envKind` pick up the studio
 * reflection map (see PipelineEnvironment).
 */

export const GLASS_TINT = "#B8C6DA";
/** Rim colour shared by every glass material: dark on the light backdrop, light on the dark one */
const RIM = new Color("#3E4F6B");
export const GLASS_RIM: Record<"light" | "dark", string> = { light: "#3E4F6B", dark: "#A9BCD8" };
export const setGlassRim = (theme: "light" | "dark") => void RIM.set(GLASS_RIM[theme]);

export const LIQUID = {
  /** LB broth: amber, slightly cloudy once cells grow in it */
  broth: "#D9A441",
  brothCloudy: "#D8AE62",
  /** Crystallization reservoir, and the drop one shade darker */
  reservoir: "#8FB3E0",
  drop: "#7BA2D6",
};

/**
 * Glass (or clear plastic) with a fresnel rim: surfaces seen edge-on darken toward a slate rim
 * colour and become more opaque, which draws a soft dark outline round every vessel.
 */
export function glassMaterial({ opacity = 0.42, color = GLASS_TINT, rim = 0.85 }: { opacity?: number; color?: string; rim?: number } = {}) {
  const m = new MeshPhysicalMaterial({ color, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.08, transparent: true, opacity, depthWrite: false, side: DoubleSide });
  m.userData.forceTransparent = true;
  m.userData.viewMax = opacity;
  m.userData.envKind = "glass";
  m.onBeforeCompile = (shader) => {
    shader.uniforms.rimColor = { value: RIM };
    shader.uniforms.rimStrength = { value: rim };
    shader.fragmentShader = shader.fragmentShader
      .replace("void main() {", "uniform vec3 rimColor;\nuniform float rimStrength;\nvoid main() {")
      .replace(
        "#include <opaque_fragment>",
        `#include <opaque_fragment>
        float rimF = pow(clamp(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0), 2.4);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, rimColor, rimF * rimStrength);
        gl_FragColor.a = min(1.0, gl_FragColor.a * (1.0 + 1.6 * rimF));`,
      );
  };
  m.customProgramCacheKey = () => `glass-rim-${rim}`;
  return m;
}

/**
 * The same glass split into back and front walls. Drawn in the order back wall, liquid, front wall
 * (via renderOrder), only the near wall tints the liquid; a double-sided wall drawn after the liquid
 * would lay both walls over it and wash its colour out.
 */
export function glassWalls(options?: Parameters<typeof glassMaterial>[0]) {
  const back = glassMaterial(options);
  back.side = BackSide;
  const front = glassMaterial(options);
  front.side = FrontSide;
  return { back, front };
}

/** Draw order for a liquid inside glass walls; see glassWalls */
export const LAYER = { liquid: 1, frontWall: 2 };

/** A clear liquid in a fixed colour; `turbid` makes it milkier and more opaque. */
export function liquidMaterial(color: string, { opacity = 0.82, turbid = 0 }: { opacity?: number; turbid?: number } = {}) {
  const m = new MeshPhysicalMaterial({ color, roughness: 0.18 + 0.3 * turbid, clearcoat: 0.6, transparent: true, opacity, depthWrite: false });
  m.userData.forceTransparent = true;
  m.userData.viewMax = opacity;
  return m;
}
