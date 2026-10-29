"use client";

import type { ComponentType } from "react";
import type { StageKey } from "@/store/pipelineStore";
import { usePipelineStore } from "@/store/pipelineStore";
import { shadow, type StageFraming, type StageShadow } from "../runtime";
import { GeneStage, geneFraming } from "./GeneStage";
import { ConstructStage, constructFraming } from "./ConstructStage";
import { PlasmidStage, plasmidFraming } from "./PlasmidStage";
import { CellStage, cellFraming } from "./CellStage";
import { ExpressionStage, expressionFraming } from "./ExpressionStage";
import { PurificationStage, purificationFraming } from "./PurificationStage";
import { StorageStage, storageFraming } from "./StorageStage";
import { CrystalStage, crystalFraming } from "./CrystalStage";
import { DiffractionStage, diffractionFraming } from "./DiffractionStage";
import { StructureStage, structureFraming } from "./StructureStage";

export interface StageDef {
  Component: ComponentType;
  /** Camera framing once the stage has settled (may read the stage's own view toggles) */
  framing: () => StageFraming;
  /** Gentle auto-rotation suits free-floating objects, not lab set-ups seen from the front */
  autoRotate?: boolean;
  /** Where the contact shadow lies (default: just under the framing) */
  shadow?: () => StageShadow | undefined;
}

/*
 * Contact shadows for stages that stand on something (a bench, a shaker) or switch views; the
 * planes sit at the bottom of each set-up.
 */
const FLASK_SHADOW = shadow([0, -1.66, 0], [10, 10], 8);
const subView = (key: "cell" | "expression", inside: string) => {
  const { steps, subViews } = usePipelineStore.getState();
  return (subViews[key] ?? (steps[key] > 0 ? inside : "flask")) === inside;
};
const cellShadow = () => (subView("cell", "cells") ? shadow([0, -0.9, 1], [30, 26], 4) : FLASK_SHADOW);
const expressionShadow = () => (subView("expression", "cell") ? shadow([0, -10.6, 0], [56, 30], 26) : FLASK_SHADOW);
const crystalShadow = () => (usePipelineStore.getState().crystalView === "lattice" ? undefined : shadow([0, -2.36, 0], [64, 46], 6));

export const STAGES: Record<StageKey, StageDef> = {
  gene: { Component: GeneStage, framing: geneFraming, autoRotate: false },
  construct: { Component: ConstructStage, framing: constructFraming, autoRotate: false },
  plasmid: { Component: PlasmidStage, framing: plasmidFraming, autoRotate: false, shadow: () => shadow([0, -9.6, 0], [26, 14], 12) },
  cell: { Component: CellStage, framing: cellFraming, shadow: cellShadow },
  expression: { Component: ExpressionStage, framing: expressionFraming, autoRotate: false, shadow: expressionShadow },
  purification: { Component: PurificationStage, framing: purificationFraming, autoRotate: false, shadow: () => shadow([1, -10.6, 0], [30, 12], 26) },
  storage: { Component: StorageStage, framing: storageFraming, autoRotate: false, shadow: () => shadow([1.5, -3.65, 0], [32, 12], 10) },
  crystal: { Component: CrystalStage, framing: crystalFraming, autoRotate: false, shadow: crystalShadow },
  diffraction: { Component: DiffractionStage, framing: diffractionFraming, autoRotate: false, shadow: () => shadow([0.5, -8.3, -1], [34, 22], 14) },
  structure: { Component: StructureStage, framing: structureFraming, autoRotate: false },
};
