"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PMREMGenerator, type Material, type MeshStandardMaterial, type Object3D } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useExplorerStore } from "@/store/explorerStore";
import { setGlassRim } from "./lib/materials";

const INTENSITY: Record<string, number> = { glass: 0.75, crystal: 1.5 };

/**
 * A soft studio reflection map, built in the browser (no image to load), for the materials that
 * need it: glass catches light along its edges and crystal facets show a specular glint. Other
 * materials keep the plain studio lights. Materials opt in with `userData.envKind`.
 */
export function PipelineEnvironment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const env = useMemo(() => {
    const pmrem = new PMREMGenerator(gl);
    const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return texture;
  }, [gl]);
  useEffect(() => () => env.dispose(), [env]);
  // glass outlines stay visible on either backdrop
  const theme = useExplorerStore((s) => s.theme);
  useEffect(() => setGlassRim(theme), [theme]);

  // stages mount and swap materials at any time: look for new opt-ins a few times a second
  const tick = useRef(0);
  useFrame(() => {
    if (tick.current++ % 15) return;
    scene.traverse((o: Object3D) => {
      const m = (o as Object3D & { material?: Material | Material[] }).material;
      if (!m) return;
      for (const mm of (Array.isArray(m) ? m : [m]) as MeshStandardMaterial[]) {
        const kind = mm.userData.envKind as string | undefined;
        if (!kind || mm.envMap === env) continue;
        mm.envMap = env;
        mm.envMapIntensity = INTENSITY[kind] ?? 1;
        mm.needsUpdate = true;
      }
    });
  });
  return null;
}
