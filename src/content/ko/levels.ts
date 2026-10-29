// Korean version of ../levels.ts: same exports and signatures, Korean text.
import type { Level, Selection } from "@/store/explorerStore";
import { aaLabel, type ProteinModel } from "@/lib/structure/protein";
import type { ResidueMolecule } from "@/lib/chem/residueMolecule";
import { ELEMENT_TEXT } from "@/content/elements";
import { LEVELS as EN_LEVELS, levelMeasures, nm, type LevelMeta, type LevelSize } from "../levels";

const TEXT: Record<Level, Pick<LevelMeta, "name" | "schematicNote">> = {
  0: { name: "단백질" },
  1: { name: "폴리펩타이드 사슬" },
  2: { name: "아미노산" },
  3: { name: "원자", schematicNote: "모식도 · 실제 비율 아님" },
  4: { name: "아원자 입자", schematicNote: "모식도 · 약 10⁻¹⁵ m" },
};

export const LEVELS: LevelMeta[] = EN_LEVELS.map((l) => ({ ...l, ...TEXT[l.id] }));

/** Short Level V caption for an electron, which has no measurable size (the tour checks for it) */
export const POINT_LIKE = "점 입자";

const NUCLEON = { proton: "양성자", neutron: "중성자" };

/** The real size of what each level shows (measured as in the English module), with Korean captions. */
export function levelSizes(protein: ProteinModel, molecule: ResidueMolecule, selection: Selection, proteinName: string): LevelSize[] {
  const m = levelMeasures(protein, molecule, selection);
  const across = nm(m.across);
  const contour = Math.round(m.contour);
  const residueSize = nm(m.residueSize);
  const atomSize = nm(m.atomSize, 2);
  const element = ELEMENT_TEXT.ko.name[selection.atomElement];

  return [
    { short: across, long: `${proteinName}의 폭은 약 ${across}입니다.` },
    { short: `길이 ${contour} nm`, long: `아미노산 ${protein.residues.length}개로 이루어진 이 사슬을 쭉 펴면 길이가 약 ${contour} nm입니다.` },
    { short: residueSize, long: `${aaLabel(protein.residues[selection.residueIndex])}의 폭은 약 ${residueSize}입니다.` },
    { short: atomSize, long: `${element} 원자의 지름(공유 결합 반지름의 2배)은 약 ${atomSize}입니다.` },
    selection.particle === "electron"
      ? { short: POINT_LIKE, long: "전자는 측정할 수 있는 크기가 없습니다. 실험으로 알 수 있는 한 전자는 점입니다." }
      : { short: "1.7 fm", long: `${NUCLEON[selection.particle]}의 지름은 약 1.7펨토미터입니다. 1펨토미터(fm)는 1나노미터의 100만분의 1입니다.` },
  ];
}
