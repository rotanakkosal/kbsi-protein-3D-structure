"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { useExplorerStore } from "@/store/explorerStore";
import { usePipelineStore, type StageKey } from "@/store/pipelineStore";
import { fadeTree, StageContext, type StageRole } from "@/scene/StageGroup";
import { pipelineRuntime, shadowUnder, type StageShadow } from "./runtime";
import { ContactShadow } from "./ContactShadow";
import { STAGES } from "./stages";

const shadowFor = (key: StageKey): StageShadow => STAGES[key].shadow?.() ?? shadowUnder(STAGES[key].framing());

/**
 * Wraps one pipeline stage: while stages change, the outgoing one swells or shrinks and fades,
 * and the incoming one grows into place (same material fading as the explorer's level stages).
 */
export function PipelineStage({ stageKey, role, children }: { stageKey: StageKey; role: StageRole; children: ReactNode }) {
  const ref = useRef<Group>(null);
  const dark = useExplorerStore((s) => s.theme === "dark");
  // the shadow follows the stage's own views (flask → cells, plate → well); a string keeps the selector stable
  const spec = usePipelineStore(() => JSON.stringify(shadowFor(stageKey)));
  const ground = JSON.parse(spec) as StageShadow;
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    let opacity = 1;
    let scale = 1;
    if (role !== "current") {
      const s = role === "outgoing" ? pipelineRuntime.outgoing : pipelineRuntime.incoming;
      opacity = s.opacity;
      scale = s.scale;
    }
    g.scale.setScalar(scale);
    g.visible = opacity > 0.004;
    if (g.visible) fadeTree(g, opacity);
  });
  return (
    <StageContext.Provider value={{ role, level: 0 }}>
      <group ref={ref}>
        {children}
        {/* a soft contact shadow grounds every stage; the outgoing stage drops its own */}
        {role !== "outgoing" && (
          <ContactShadow at={ground.at} size={ground.size} far={ground.far} opacity={dark ? 0.7 : 0.42} color={dark ? "#000000" : "#16253F"} />
        )}
      </group>
    </StageContext.Provider>
  );
}
