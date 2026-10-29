"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Color, Fog } from "three";
import { useExplorerStore } from "@/store/explorerStore";
import { SCENE_THEME, sceneColors } from "./shared/palette";

/**
 * Keeps the scene background, depth fog and shared mixing colour in step with the UI theme. With
 * `background={false}` the canvas stays transparent (a CSS backdrop shows through) and `colors`
 * sets what the fog fades toward.
 */
export function SceneThemeSync({ background = true, colors }: { background?: boolean; colors?: Record<"light" | "dark", string> }) {
  const theme = useExplorerStore((s) => s.theme);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const bg = colors?.[theme] ?? SCENE_THEME[theme].bg;
    sceneColors.bg.set(bg);
    if (!background) scene.background = null;
    else if (scene.background instanceof Color) scene.background.set(bg);
    else scene.background = new Color(bg);
    if (scene.fog instanceof Fog) scene.fog.color.set(bg);
  }, [scene, theme, background, colors]);
  return null;
}
