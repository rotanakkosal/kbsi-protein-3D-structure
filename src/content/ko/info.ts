// Korean version of ../info.ts: same exports and signatures, Korean text.
import type { ProteinModel, Region } from "@/lib/structure/protein";
import { aaLabel } from "@/lib/structure/protein";
import type { MolAtom, ResidueMolecule } from "@/lib/chem/residueMolecule";
import { ELEMENTS, type ElementInfo, type ElementSymbol } from "@/lib/chem/elements";
import type { Level, Mode, ParticleKind, Selection } from "@/store/explorerStore";
import { josa } from "@/i18n/ko";
import { ELEMENT_TEXT } from "@/content/elements";
import { regionLabel } from "@/content/regions";
import { bondLength, chargeSuffix, deg, marbleMetres, phiPsi, type InfoContent, type InfoContext, type InfoSection } from "../info";
import { AA_CLASS_INFO, aminoAcid } from "./aminoAcids";
import { PROTEINS } from "./proteins";

const sections = (made: string[], example: string[], why: string[]): InfoSection[] => [
  { id: "made", label: "구성", body: made },
  { id: "example", label: "예시", body: example },
  { id: "why", label: "중요한 이유", body: why },
];

/* ------------------------------------------------------------------ helpers */

/** Element name in Korean (탄소, 질소, …) */
const elName = (symbol: ElementSymbol) => ELEMENT_TEXT.ko.name[symbol];

const NA = "해당 없음";
const angle = (x: number | null) => (x == null ? NA : deg(x));
const bond = (m: ResidueMolecule, a: string, b: string) => {
  const s = bondLength(m, a, b);
  return s === "n/a" ? NA : s;
};

/** The marble comparison of ../info.ts in Korean, with the same computed distance. */
function marbleKo(el: ElementInfo): string {
  return `원자핵이 1 cm 구슬이라면 원자 전체는 지름이 약 ${marbleMetres(el)} m가 됩니다`;
}

function elementExample(symbol: ElementSymbol): { beginner: string; scientific: string } {
  switch (symbol) {
    case "H":
      return {
        beginner: "수소는 우주에서 가장 흔한 원소이며, 태양도 대부분 수소로 이루어져 있습니다. 물 분자(H₂O)마다 수소 원자가 두 개씩 들어 있습니다.",
        scientific:
          "더 무거운 동위 원소인 ²H(중수소)와 ³H(삼중수소)도 존재합니다. 중성자 결정학에서는 중수소를 이용해, X선으로는 거의 보이지 않는 단백질 속 수소 원자의 위치를 찾아냅니다.",
      };
    case "C":
      return {
        beginner: "여러분 몸속의 탄소는 연필심(흑연)이나 다이아몬드를 이루는 탄소와 같은 종류입니다. 원자가 배열된 방식만 다를 뿐입니다.",
        scientific: "¹²C는 원자 질량 단위를 정의합니다(1 u = ¹²C 원자 질량의 1/12). 미량 존재하는 ¹⁴C(반감기 ≈ 5,730년)는 방사성 탄소 연대 측정의 기초입니다.",
      };
    case "N":
      return {
        beginner: "질소는 여러분이 들이마시는 공기의 약 78%를 차지합니다. 모든 아미노산에는 질소 원자가 적어도 하나 들어 있습니다.",
        scientific: "드문 안정 동위 원소인 ¹⁵N(0.4%)은 NMR 구조 결정을 위해 단백질을 표지하는 데 쓰입니다.",
      };
    case "O":
      return {
        beginner: "산소는 여러분이 들이마시는 기체입니다. 몸 질량의 대부분도 산소이며, 주로 물 분자 속에 들어 있습니다.",
        scientific: "빙하 코어와 패각에 보존된 ¹⁸O/¹⁶O 비는 과거 기후를 복원하는 데 쓰입니다.",
      };
    case "S":
      return {
        beginner: `황은 마늘과 양파의 톡 쏘는 냄새를 만듭니다. 단백질에서는 ${josa(aminoAcid("MET").name, "과/와")} ${aminoAcid("CYS").name}에 들어 있습니다.`,
        scientific: "1952년 허시–체이스 실험에서는 방사성 ³⁵S로 바이러스 단백질을 표지했으며, 이 실험으로 유전자가 단백질이 아니라 DNA로 이루어져 있음이 밝혀졌습니다.",
      };
  }
}

/* ------------------------------------------------------------------ atom roles */

/** Roles plus a short beginner form that reads after "Gly10의" (the panel subtitle). */
function roles(m: ResidueMolecule, a: MolAtom, form: "residue" | "free"): { beginner: string; scientific: string; short?: string } {
  const name = a.name;
  const free = form === "free";
  if (a.context) {
    const r: Record<string, string> = { CA: "알파 탄소", C: "카보닐 탄소", O: "카보닐 산소", N: "아마이드 질소", H: "아마이드 수소" };
    return { beginner: r[name] ?? "원자", scientific: r[name] ?? "원자" };
  }
  switch (name) {
    case "N":
      return free || m.isNTerminal
        ? { beginner: "아미노기 질소", scientific: "α-아미노기 질소" }
        : { beginner: "골격 질소(앞 아미노산과 연결)", scientific: "아마이드 질소(앞 잔기와 펩타이드 결합)" };
    case "CA":
      return { beginner: "알파 탄소(중심 탄소)", scientific: "알파 탄소(Gly를 제외한 모든 잔기에서 입체 중심)" };
    case "C":
      return { beginner: "골격 탄소(다음 아미노산과 연결)", scientific: free ? "카복실 탄소" : "카보닐 탄소(다음 잔기와 펩타이드 결합)" };
    case "O":
      return { beginner: "탄소와 이중 결합한 산소", scientific: "카보닐 산소(C=O)" };
    case "OXT":
      return free
        ? { beginner: "–OH기 산소(물이 되어 빠져나감)", scientific: "–COOH의 하이드록실 산소" }
        : { beginner: "사슬 맨 끝의 산소", scientific: "C-말단 카복실레이트 산소" };
    case "HXT":
      return { beginner: "–OH기 수소(물이 되어 빠져나감)", scientific: "카복실산 수소" };
  }
  if (a.isHydrogen && a.parent === "N") {
    return a.leaving
      ? { beginner: "아미노기 수소(물이 되어 빠져나감)", scientific: "펩타이드 결합이 형성될 때 떨어져 나가는 아미노기 H" }
      : { beginner: "질소에 붙은 수소", scientific: free || m.isNTerminal ? "α-아미노기 수소" : "아마이드 수소(골격의 수소 결합 주개)" };
  }
  if (a.isHydrogen && a.parent === "CA") {
    return a.group === "sidechain"
      ? { beginner: `${aminoAcid("GLY").name}의 곁사슬 전체: 수소 하나뿐`, scientific: "Hα3, Cβ 자리에 있음(R = H)", short: "곁사슬 전체: 수소 하나뿐" }
      : { beginner: "알파 탄소에 붙은 수소", scientific: "α-수소" };
  }
  if (a.isHydrogen) return { beginner: "곁사슬에 붙은 수소", scientific: "곁사슬 수소" };
  return { beginner: `곁사슬에 있는 ${elName(a.element)}`, scientific: `곁사슬 ${elName(a.element)}(${a.display})` };
}

export function atomRole(m: ResidueMolecule, a: MolAtom, form: "residue" | "free"): { beginner: string; scientific: string } {
  const { beginner, scientific } = roles(m, a, form);
  return { beginner, scientific };
}

/* ------------------------------------------------------------------ hover text */

export function regionHoverText(region: Region, mode: Mode, proteinId: Selection["proteinId"]): { title: string; subtitle: string } {
  const b: Record<Region["kind"], string> = {
    strand: "사슬이 길게 펴진 부분입니다. 이런 가닥들이 나란히 놓여 평평한 시트를 이룹니다.",
    helix: "용수철처럼 감긴 사슬 부분(α-나선)입니다.",
    helix310: "짧고 촘촘하게 감긴 나선입니다.",
    loop: "사슬이 방향을 바꿀 수 있게 해 주는 유연한 루프입니다.",
    turn: region.hairpin ? "사슬이 급하게 꺾여 되접히는 턴입니다." : "사슬의 방향이 바뀌는 짧은 굽이입니다.",
    nterm: "사슬이 시작되는 곳(N-말단)으로, 첫 번째 아미노산이 있습니다.",
    tail: PROTEINS[proteinId].tail.beginner,
  };
  const s: Record<Region["kind"], string> = {
    strand: "펼쳐진 β-가닥으로, 혼합형 β-시트에서 이웃 가닥과 수소 결합을 이룹니다.",
    helix: "α-나선: 한 바퀴당 3.6 잔기, i→i+4 C=O···H–N 수소 결합.",
    helix310: "3₁₀-나선: i→i+3 골격 수소 결합.",
    loop: "2차 구조 요소들을 잇는 불규칙한 코일입니다.",
    turn: region.hairpin
      ? "사슬 방향을 반대로 돌리는 급격한 턴(β-헤어핀 턴)입니다."
      : "두 2차 구조 요소를 잇는, 잔기 한두 개로 된 짧은 코일입니다.",
    nterm: "첫 2차 구조 요소 앞의 N-말단 잔기로, α-아미노기가 자유 상태입니다(pH 7에서 –NH₃⁺).",
    tail: PROTEINS[proteinId].tail.scientific,
  };
  return { title: regionLabel(region, "ko"), subtitle: mode === "beginner" ? b[region.kind] : s[region.kind] };
}

export function atomHoverText(m: ResidueMolecule, a: MolAtom, mode: Mode, form: "residue" | "free") {
  const el = ELEMENTS[a.element];
  const role = atomRole(m, a, form)[mode];
  if (a.context) {
    return {
      title: `${a.context.residueLabel}의 ${a.display}`,
      subtitle: `${elName(el.symbol)}(${el.symbol}) · 사슬에서 ${a.context.relation === "previous" ? "앞" : "다음"} 아미노산의 일부`,
      hint: "주변 맥락을 보여 주기 위해 흐리게 표시",
    };
  }
  const neighbors = m.bonds
    .filter((b) => b.a === a.id || b.b === a.id)
    .map((b) => m.atomById[b.a === a.id ? b.b : b.a])
    .filter((n) => (form === "free" ? n.inFree : n.inResidue))
    .map((n) => n.display);
  const bonded = neighbors.length ? `${josa(neighbors.join(", "), "과/와")} 결합` : "결합한 원자 없음";
  const leaving = a.leaving && form === "free" ? " · 펩타이드 결합이 생길 때 H₂O로 제거됨" : "";
  return {
    title: `${a.display}: ${role}`,
    subtitle: `${elName(el.symbol)}(${el.symbol}) · ${bonded}${leaving}`,
    hint: "클릭하면 이 원자로 확대됩니다",
  };
}

export function particleHoverText(kind: ParticleKind, el: ElementInfo, mode: Mode, shell?: number) {
  if (kind === "proton")
    return { title: "양성자", subtitle: mode === "beginner" ? `양전하(+1) · 이 원자핵의 양성자 ${el.Z}개 중 하나` : "+1 e · 938.27 MeV/c² · 쿼크 uud" };
  if (kind === "neutron")
    return { title: "중성자", subtitle: mode === "beginner" ? `전하 없음(0) · 이 원자핵의 중성자 ${el.massNumber - el.Z}개 중 하나` : "0 · 939.57 MeV/c² · 쿼크 udd" };
  const where = shell ? `${shell}번 껍질` : "전자 구름";
  return { title: "전자", subtitle: mode === "beginner" ? `음전하(−1) · ${where}에 있음` : `−1 e · 0.511 MeV/c² · 렙톤 · ${where}` };
}

/* ------------------------------------------------------------------ breadcrumb */

export function pathLabels(protein: ProteinModel, molecule: ResidueMolecule, sel: Selection): string[] {
  const atom = molecule.atomById[sel.atomId];
  const p = { proton: "양성자", neutron: "중성자", electron: "전자" }[sel.particle];
  return [
    PROTEINS[sel.proteinId].name,
    `사슬 ${protein.chainId}`,
    aaLabel(protein.residues[sel.residueIndex]),
    `${elName(sel.atomElement)}${atom ? ` · ${atom.display}` : ""}`,
    p,
  ];
}

/* ------------------------------------------------------------------ panels */

export function getInfoContent(level: Level, ctx: InfoContext): InfoContent {
  switch (level) {
    case 0:
      return proteinInfo(ctx);
    case 1:
      return chainInfo(ctx);
    case 2:
      return aminoAcidInfo(ctx);
    case 3:
      return atomInfo(ctx);
    default:
      return particleInfo(ctx);
  }
}

function proteinInfo({ protein, mode, selection }: InfoContext): InfoContent {
  return PROTEINS[selection.proteinId].levelOne(protein, mode);
}

function chainInfo({ protein, mode, selection }: InfoContext): InfoContent {
  const n = protein.residues.length;
  const kinds = new Set(protein.residues.map((r) => r.resName)).size;
  const region = protein.regionById[selection.regionId];
  const [regionName, regionRange] = region ? regionLabel(region, "ko").split(" · ") : [];
  const focus = region ? ` 지금 확대한 곳은 ${regionName}(${regionRange}) 근처입니다.` : "";
  const entry = PROTEINS[selection.proteinId];
  const first = protein.residues[0];
  const last = protein.residues[n - 1];
  const gaps = protein.residues.filter((r) => r.breakBefore).length;
  const bonds = n - 1 - gaps;
  if (mode === "beginner") {
    return {
      title: "폴리펩타이드 사슬",
      subtitle: `접혀서 ${josa(entry.name, "이/가")} 되는, 아미노산 ${n}개로 이루어진 사슬 하나`,
      summary: `폴리펩타이드는 아미노산이 길게 이어진 사슬입니다. 이 사슬이 특정한 모양으로 접히면 단백질이 됩니다. 여기 보이는 구슬 하나하나가 아미노산 하나입니다.${focus}`,
      facts: [
        { label: "구슬(아미노산)", value: `${n}` },
        { label: "연결(펩타이드 결합)", value: `${bonds}` },
        { label: "사용된 종류", value: `20종 중 ${kinds}종` },
      ],
      sections: sections(
        [
          "아미노산들이 펩타이드 결합(금색 띠)으로 하나씩 차례로 이어져 있습니다.",
          "모든 사슬에는 시작(N-말단)과 끝(C-말단)이 있습니다. 그래서 왼쪽에서 오른쪽으로 읽는 문장처럼 사슬에도 방향이 있습니다.",
        ],
        [entry.chainExamples.beginner],
        [
          "아미노산의 순서(서열)가 사슬이 접히는 방식을 정하고, 접힌 모양이 단백질이 할 수 있는 일을 정합니다.",
          "“사슬 펼치기”를 누르면 사슬이 곧게 펴져서, 단백질이 정말로 끊김 없는 하나의 사슬이라는 것을 확인할 수 있습니다.",
        ],
      ),
      relation: { up: "접혀서 단백질이 됩니다(I단계).", down: "구슬 하나가 아미노산 하나입니다(III단계)." },
      note: {
        tone: "info",
        title: "단순화",
        text: "구슬 하나는 아미노산 하나 전체(원자 약 10–25개)를 나타내며, 실제 알파 탄소 위치에 놓여 있습니다. 구슬 색은 곁사슬의 종류를 나타냅니다.",
      },
    };
  }
  return {
    title: `폴리펩타이드 사슬 ${protein.chainId}`,
    subtitle: `${aaLabel(first)} → ${aaLabel(last)} · 1차 구조`,
    summary: `폴리펩타이드는 아미노산 잔기들이 펩타이드(아마이드) 결합으로 이어진 선형 중합체이며, 이 결합은 잔기 i의 카보닐 탄소와 잔기 i+1의 아마이드 질소 사이에 형성됩니다. 서열(1차 구조)이 접힌 상태의 입체 형태를 결정합니다.${focus}`,
    facts: [
      { label: "잔기", value: `${n}` },
      { label: "펩타이드 결합", value: `${bonds}` },
      { label: "Cα–Cα(트랜스)", value: "3.8 Å" },
      { label: "잔기 종류", value: `20종 중 ${kinds}종` },
    ],
    sections: sections(
      [
        "골격(주사슬)은 –N–Cα–C(=O)– 단위의 반복이며, 각 Cα에 곁사슬(R)이 하나씩 붙어 있습니다.",
        "펩타이드 결합은 공명으로 인해 부분적인 이중 결합 성질을 띠므로, 각 C–N 단위는 평면을 이루고 거의 항상 트랜스(ω ≈ 180°)입니다. 사슬의 유연성은 Cα 양쪽의 φ, ψ 이면각에서 비롯됩니다.",
      ],
      [entry.chainExamples.scientific, entry.chainExamples.scientificExtra],
      [
        "접힘은 주로 소수성 효과에 의해 일어나며, 골격 수소 결합(나선, 시트), 곁사슬 패킹, 염다리가 접힌 구조를 안정화합니다.",
        "알츠하이머병, 파킨슨병 같은 질환의 바탕에는 단백질의 잘못된 접힘(misfolding)과 응집이 있습니다.",
      ],
    ),
    relation: { up: "3차 구조: 접힌 사슬(I단계).", down: "단량체 단위: 아미노산 잔기(III단계)." },
    note: {
      tone: "info",
      title: "표현 방식",
      text: `잔기마다 실험으로 결정된 Cα 위치에 구슬을 하나씩 놓은 조대화(coarse-grained) Cα 모델입니다. 금색 띠는 실제 C–N 펩타이드 결합 각각의 중점을 표시합니다. 펼친 배치는 모식도입니다.${gaps ? ` 사슬이 끊긴 ${gaps}곳은 결정 구조에서 위치가 결정되지 않은 잔기를 나타냅니다.` : ""}`,
    },
  };
}

function aminoAcidInfo({ protein, molecule: m, mode, aminoAcidForm: form, selection }: InfoContext): InfoContent {
  const aa = aminoAcid(m.resName);
  const r = protein.residues[selection.residueIndex];
  const atoms = m.atoms.filter((a) => !a.context && (form === "free" ? a.inFree : a.inResidue));
  const hasS = atoms.some((a) => a.element === "S");
  const formula = form === "free" ? m.formulaFree : `${m.formulaResidue}${chargeSuffix(m.chargeResidue)}`;
  const isGly = m.resName === "GLY";
  const entry = PROTEINS[selection.proteinId];
  const note = entry.residueNote(r.seq, r.resName);
  const lastSeq = protein.residues[protein.residues.length - 1].seq;
  if (mode === "beginner") {
    return {
      highlight: note ? `${entry.name}에서: ${note.beginner}` : undefined,
      title: `${aa.name}(${m.label})`,
      subtitle: form === "free" ? "자유 아미노산: 사슬에 연결되기 전의 구성 단위" : "아미노산: 사슬을 이루는 구성 단위 하나",
      summary: `아미노산은 단백질의 구성 단위가 되는 작은 분자입니다. 아미노산에는 탄소, 수소, 산소, 질소 같은 원자가 들어 있습니다. ${aa.sideChainBeginner}`,
      facts: [
        { label: "표시된 원자", value: `${atoms.length}` },
        { label: "화학식", value: formula },
        { label: "사슬 내 위치", value: `${lastSeq}개 중 ${r.seq}번째` },
      ],
      sections: sections(
        [
          "모든 아미노산은 같은 기본 구조를 가집니다. 중심 탄소(Cα)에 아미노기(N 포함), 카복실기(C와 O), 수소 하나, 그리고 R이라고 부르는 곁사슬이 붙어 있습니다.",
          `원자 색깔은 탄소 회색, 수소 흰색, 질소 파란색, 산소 빨간색${hasS ? ", 황 노란색" : ""}입니다. 막대는 화학 결합입니다(막대 두 개 = 이중 결합).`,
        ],
        [aa.example],
        [
          "흔히 쓰이는 아미노산은 20가지입니다. 곁사슬이 저마다 달라서 단백질마다 고유한 모양과 화학적 성질을 갖게 됩니다.",
          form === "residue"
            ? "사슬 안에 들어간 아미노산은 잔기라고 부릅니다. 아미노산 두 개가 연결될 때마다 물 분자(H₂O) 하나가 빠져나옵니다. “자유 아미노산”으로 바꾸면 비교해 볼 수 있습니다."
            : "파란 후광이 있는 원자들은 이 아미노산이 펩타이드 결합으로 사슬에 연결될 때 물(H₂O)이 되어 빠져나갑니다.",
        ],
      ),
      relation: {
        up: "사슬에서 펩타이드 결합으로 이웃 아미노산과 연결됩니다(II단계).",
        down: `원자로 이루어져 있습니다. ${isGly ? "중심 탄소(Cα)" : "탄소 원자"}를 클릭하면 확대됩니다(IV단계).`,
      },
      note: {
        tone: "info",
        title: "이 모델에 대해",
        text: `결정 구조에서 가져온 실제 ${m.label}의 공-막대 모형입니다. X선 구조에는 수소 원자가 나타나지 않으므로, 이상적인 결합 길이와 결합각을 이용해 수소를 추가했습니다.`,
      },
    };
  }
  const { phi, psi } = phiPsi(protein, selection.residueIndex);
  const heavy = m.atoms.filter((a) => !a.context && !a.isHydrogen && a.inResidue).map((a) => a.display);
  const charge = m.chargeResidue ? `${m.chargeResidue > 0 ? "+" : "−"}${Math.abs(m.chargeResidue)}` : "";
  const peptideBonds = [m.prevLabel ? `${m.prevLabel} C–N ${m.label}` : null, m.nextLabel ? `${m.label} C–N ${m.nextLabel}` : null].filter(Boolean);
  return {
    highlight: note ? `${entry.name}: ${note.scientific}` : undefined,
    title: `${m.label} · ${aa.name}`,
    subtitle: `${aa.three} / ${aa.one} · ${AA_CLASS_INFO[aa.cls].label} · M = ${aa.molarMass.toFixed(2)} g/mol(자유 아미노산 기준)`,
    summary: `α-아미노산은 중심의 알파 탄소에 아미노기, 카복실기, Hα, 곁사슬 R이 결합한 공통 구조를 가지며, 단백질에는 L-거울상 이성질체가 쓰입니다. ${aa.sideChainScientific}`,
    facts: [
      { label: form === "free" ? "자유 아미노산" : "잔기(pH 7)", value: formula },
      { label: "φ / ψ", value: `${angle(phi)} / ${angle(psi)}` },
      { label: "N–Cα · Cα–C", value: `${bond(m, "N", "CA")} · ${bond(m, "CA", "C")}` },
      { label: "C=O", value: bond(m, "C", "O") },
    ],
    sections: sections(
      [
        `비수소 원자(결정 좌표): ${heavy.join(", ")}.`,
        form === "residue"
          ? `잔기 = 자유 아미노산 − H₂O: ${aa.formula} − H₂O → ${aa.residueFormula}${charge ? ` (pH 7 기준 전하 ${josa(charge, "으로/로")} 표시)` : ""}.`
          : `중성 자유 아미노산: ${aa.formula}. pH 7에서는 주로 쌍극성 이온 H₃N⁺–CH(R)–COO⁻ 형태로 존재합니다.`,
      ],
      [
        peptideBonds.length ? `사슬 내 펩타이드 결합: ${peptideBonds.join(" 및 ")}.` : "말단 잔기입니다.",
        "축합 반응: R₁–COOH + H₂N–R₂ → R₁–CO–NH–R₂ + H₂O. 리보솜에서는 아미노아실-tRNA의 화학 반응이 이 과정을 이끕니다.",
      ],
      [
        isGly
          ? `R = H인 ${aa.name}에는 Cβ가 없어서 다른 잔기에는 허용되지 않는 φ/ψ 조합을 취할 수 있습니다. 그래서 턴과 조밀하게 패킹된 부위에 흔합니다.`
          : `${AA_CLASS_INFO[aa.cls].label} 곁사슬은 패킹, 수소 결합, 전하를 통해 접힘 구조를 좌우합니다.`,
        m.isNTerminal
          ? "N-말단 잔기이므로 아미노기가 자유 상태입니다(pH 7에서 –NH₃⁺)."
          : m.isCTerminal
            ? "C-말단 잔기이므로 카복실레이트가 자유 상태입니다(pH 7에서 –COO⁻)."
            : "골격의 N–H와 C=O는 2차 구조에서 각각 수소 결합 주개와 받개로 작용합니다.",
      ],
    ),
    relation: { up: "폴리펩타이드의 잔기 i(II단계).", down: "원자: 전자를 공유하며 공유 결합한 H, C, N, O(S) 원자핵(IV단계)." },
    note: {
      tone: "info",
      title: "모델 참고 사항",
      text: `비수소 원자 좌표는 PDB ${protein.idCode}에서 가져왔습니다. 수소는 기하학적으로 배치했습니다(C–H 1.09 Å, N–H 1.01 Å, O–H 0.96 Å; sp³ 사면체, sp² 평면 삼각형). 양성자화 상태는 pH ≈ 7 기준입니다(His는 Nε2–H 호변 이성질체). 방향족 고리는 케쿨레 구조 하나로 그렸습니다.`,
    },
  };
}

function atomInfo({ protein, molecule: m, mode, selection, aminoAcidForm: form, atomView }: InfoContext): InfoContent {
  const el = ELEMENTS[selection.atomElement];
  const name = elName(el.symbol);
  const atom = m.atomById[selection.atomId];
  const N = el.massNumber - el.Z;
  const roleText: { beginner: string; scientific: string; short?: string } = atom ? roles(m, atom, form) : { beginner: "원자", scientific: "원자" };
  const neighbors = atom
    ? m.bonds
        .filter((b) => b.a === atom.id || b.b === atom.id)
        .map((b) => m.atomById[b.a === atom.id ? b.b : b.a])
        .filter((n) => (form === "free" ? n.inFree : n.inResidue))
    : [];
  const neighborText = neighbors.map((n) => `${n.display}(${elName(n.element)})`).join(", ");
  const label = aaLabel(protein.residues[selection.residueIndex]);
  const bohrNote = `단순화한 그림입니다. 전자는 실제로 행성처럼 정해진 원 궤도를 따라 돌지 않습니다. 대신 전자가 발견될 가능성이 높은 곳을 나타내는 흐릿한 “구름”을 이룹니다${atomView === "orbits" ? "(“전자 구름”으로 바꾸면 볼 수 있습니다)" : ""}. 실제 비율이 아닙니다. ${marbleKo(el)}.`;

  if (mode === "beginner") {
    const short = roleText.short ?? roleText.beginner.split("(")[0].trim();
    return {
      title: `${name} 원자`,
      subtitle: `${ELEMENT_TEXT.ko.isotope[el.symbol]} · ${atom ? `${label}의 ${short}` : label}`,
      summary: `원자는 화학 원소의 기본 단위입니다. 원자들이 연결되어 분자를 이룹니다. 모든 ${name} 원자에는 양성자가 ${el.Z}개 있습니다.`,
      facts: [
        { label: "양성자", value: `${el.Z}` },
        { label: "중성자", value: `${N}` },
        { label: "전자", value: `${el.Z}` },
      ],
      sections: sections(
        [
          `원자핵이라는 작고 무거운 중심에 ${N ? `양성자 ${el.Z}개와 중성자 ${N}개가 들어 있습니다` : `양성자 ${el.Z}개가 들어 있습니다(중성자는 없습니다)`}. 그 주위를 전자 ${el.Z}개가 움직입니다.`,
          "원자 질량의 거의 전부는 원자핵에 있지만, 원자가 차지하는 공간의 거의 전부는 전자가 있는 영역입니다.",
        ],
        [elementExample(el.symbol).beginner],
        [
          `양성자 수가 그 원자가 어떤 원소인지를 결정합니다. 양성자가 ${el.Z}개이면 언제나 ${name}입니다.`,
          neighbors.length
            ? `${label}에서 이 원자와 결합한 원자는 ${neighbors.length}개로, ${neighborText}입니다. 짧은 회색 막대가 결합한 원자 쪽을 가리킵니다.`
            : `${josa(name, "은/는")} 보통 결합을 ${el.typicalBonds}개 만듭니다.`,
        ],
      ),
      relation: {
        up: `원자들이 결합해 아미노산 ${josa(label, "을/를")} 이룹니다(III단계).`,
        down: "아원자 입자로 이루어져 있습니다. 양성자, 중성자, 전자 중 하나를 클릭하면 확대됩니다(V단계).",
      },
      note: { tone: "warning", title: "단순화한 모형", text: bohrNote },
    };
  }

  const R = el.Z === 1 ? 0.84 : 1.2 * Math.cbrt(el.massNumber);
  const valence = el.shells[el.shells.length - 1];
  const massFrac = (100 * (1 - (el.Z * 0.000548580) / el.massNumber)).toFixed(2);
  const bonding = atom
    ? ` ${label}에서 ${josa(atom.display, "은/는")} 공유 결합 ${neighbors.length}개를 이룹니다(${neighbors.map((n) => n.display).join(", ")}). 결합 전자는 공유되므로 고립 원자 모형은 근사일 뿐입니다.`
    : "";
  return {
    title: `${name}(${el.isotopeSymbol})`,
    subtitle: `Z = ${el.Z} · N = ${N} · A = ${el.massNumber} · 중성 · ${atom ? roleText.scientific : ""}`,
    summary: `바닥상태 전자 배치는 ${el.configuration}입니다.${bonding}`,
    facts: [
      { label: "양성자(Z)", value: `${el.Z}` },
      { label: "중성자(N)", value: `${N}` },
      { label: "전자 / 껍질", value: `${el.Z} (${el.shells.join(", ")})` },
      { label: "자연 존재비", value: `${el.abundance}%` },
    ],
    sections: sections(
      [
        `원자핵: ${el.Z} p + ${N} n. 강한 핵력으로 결합되어 있으며 반지름은 ≈ ${R.toFixed(1)} fm(≈ 1.2·A^⅓ fm)입니다.`,
        `전자: 껍질별로 ${el.shells.join(" + ")}개이며, 원자가 전자는 ${valence}개입니다. 원자 질량의 ≈ ${massFrac}%가 원자핵에 있습니다.`,
      ],
      [elementExample(el.symbol).scientific],
      [
        `화학적 성질은 원자가 전자가 결정하며, 원자핵의 전하(+${el.Z}e)가 이 전자들을 붙잡아 둡니다. ${josa(name, "은/는")} 생체 분자에서 보통 공유 결합을 ${el.typicalBonds}개 형성합니다.`,
        "전자는 오비탈(확률 분포)을 차지하며, 오비탈 하나에는 스핀이 반대인 전자가 최대 두 개까지 들어갑니다(파울리 배타 원리).",
      ],
    ),
    relation: { up: `${label} 안에서 공유 결합을 이루고 있습니다(III단계).`, down: "구성 입자: 핵자(p, n)와 전자(V단계)." },
    note: {
      tone: "warning",
      title: "모델 참고 사항",
      text: `보어 모형식 껍질은 교육용 표현일 뿐이며, 양자역학에서는 정해진 경로가 없는 오비탈로 전자를 기술합니다. “전자 구름” 보기는 슬레이터형 1s/2s/2p 오비탈 밀도를 샘플링한 것입니다(Clementi–Raimondi 지수, 방사 마디는 생략). 원자핵은 약 10⁴배 확대했습니다. ${marbleKo(el)}.`,
    },
  };
}

function particleInfo({ mode, selection }: InfoContext): InfoContent {
  const el = ELEMENTS[selection.atomElement];
  const name = elName(el.symbol);
  const N = el.massNumber - el.Z;
  const p = selection.particle;
  const note = {
    tone: "info" as const,
    title: "단순화",
    text: "크기와 색은 실제와 다릅니다. 쿼크는 결코 홀로 발견되지 않으며(색 가둠), 용수철은 글루온장을 암시할 뿐입니다. 전자는 점 입자처럼 행동하므로 전자의 빛나는 모습은 예술적 표현일 뿐입니다.",
  };
  const relation = {
    up: p === "electron" ? `${name} 원자핵 주위의 오비탈을 차지합니다(IV단계).` : `${name} 원자핵 안에 묶여 있습니다(IV단계).`,
    down: p === "electron" ? "기본 입자: 더 작은 구성 요소는 알려져 있지 않습니다." : "쿼크를 포함합니다(그림에 표시). 이 탐색기의 마지막 단계입니다.",
  };

  if (mode === "beginner") {
    if (p === "proton")
      return {
        title: "양성자",
        subtitle: "원자핵 안에 있음",
        summary: "양성자: 원자핵 안에 있는, 양전하를 띤 입자입니다. 쿼크라는 더 작은 입자 세 개로 이루어져 있습니다.",
        facts: [
          { label: "전하", value: "+1(양전하)" },
          { label: "위치", value: "원자핵" },
          { label: "무게", value: "전자 약 1,836개" },
        ],
        sections: sections(
          ["“업” 쿼크 두 개와 “다운” 쿼크 한 개가 강한 상호작용(용수철로 표현)으로 묶여 있습니다."],
          [`방금 보고 온 ${name} 원자에는 양성자가 ${el.Z}개 있습니다. 모든 ${name} 원자는 정확히 이만큼의 양성자를 가집니다. 이 수가 바뀌면 다른 원소가 됩니다.`],
          ["반대 전하는 서로 끌어당깁니다. 양전하를 띤 양성자가 음전하를 띤 전자를 끌어당기고, 이 인력이 전자를 원자핵 가까이에 붙잡아 두어 원자가 존재할 수 있게 합니다."],
        ),
        relation,
        note,
      };
    if (p === "neutron")
      return {
        title: "중성자",
        subtitle: "원자핵 안에 있음",
        summary: "중성자: 원자핵 안에 있는, 전기적으로 중성인 입자입니다. 양성자처럼 쿼크 세 개로 이루어져 있습니다.",
        facts: [
          { label: "전하", value: "0(중성)" },
          { label: "위치", value: "원자핵" },
          { label: "무게", value: "전자 약 1,839개" },
        ],
        sections: sections(
          ["“업” 쿼크 한 개와 “다운” 쿼크 두 개로 이루어져 있습니다. 쿼크들의 전하가 서로 상쇄되어 중성자 전체로는 전하가 없습니다."],
          [
            N === 0
              ? "방금 보고 온 수소 원자에는 중성자가 하나도 없습니다. 보통의 수소는 중성자가 없는 유일한 원자입니다."
              : `방금 보고 온 ${name} 원자에는 중성자가 ${N}개 있습니다. 같은 원소이면서 중성자 수가 다른 원자들을 동위 원소라고 하며, 탄소-12와 탄소-14가 그 예입니다.`,
          ],
          ["중성자는 원자핵을 단단히 붙들어 줍니다. 중성자와 양성자 사이의 강한 핵력이 양성자끼리 전기적으로 밀어내는 힘보다 강하기 때문입니다."],
        ),
        relation,
        note,
      };
    return {
      title: "전자",
      subtitle: "원자핵 주위에 있음",
      summary: "전자: 원자핵 주위에 있는, 음전하를 띤 입자입니다. 전자는 정해진 경로가 아니라 원자핵 주위의 구름 같은 영역을 차지합니다.",
      facts: [
        { label: "전하", value: "−1(음전하)" },
        { label: "위치", value: "원자핵 주위" },
        { label: "무게", value: "양성자의 1/1836" },
      ],
      sections: sections(
        ["지금까지 알려진 바로는 이보다 작은 구성 요소가 없습니다. 전자는 기본 입자입니다."],
        ["전선에 흐르는 전기는 전자의 흐름입니다. 정전기로 찌릿한 것은 전자가 여러분에게서 문손잡이로 건너뛰기 때문입니다."],
        ["화학 반응은 전자 덕분에 일어납니다. 원자들은 전자를 공유하거나 주고받아 결합을 만듭니다. 여러분이 살펴본 아미노산의 모든 결합은 공유된 전자로 이루어져 있습니다."],
      ),
      relation,
      note,
    };
  }

  if (p === "proton")
    return {
      title: "양성자(p⁺)",
      subtitle: "중입자 · 쿼크 구성 uud · 스핀 ½ · 안정",
      summary: "양성자는 전하 +e를 띠며 중성자와 함께 원자핵을 이룹니다. 양성자 수 Z가 화학 원소를 결정합니다.",
      facts: [
        { label: "전하", value: "+1.602×10⁻¹⁹ C" },
        { label: "질량", value: "938.27 MeV/c²" },
        { label: "전하 반지름", value: "≈ 0.84 fm" },
        { label: "질량 / mₑ", value: "1836.15" },
      ],
      sections: sections(
        [
          "원자가 쿼크 u, u, d: +⅔ + ⅔ − ⅓ = +1.",
          "글루온이 쿼크들을 묶어 둡니다(양자 색역학). 쿼크의 정지 질량은 양성자 질량의 약 1%에 불과하며, 나머지는 갇힌 쿼크와 글루온의 에너지입니다.",
        ],
        [`${name}의 Z = ${el.Z}: 원자핵 전하 +${el.Z}e가 중성 원자에서 전자 ${el.Z}개를 붙잡아 둡니다.`],
        ["양성자 붕괴는 지금까지 한 번도 관측되지 않았습니다(수명 > 10³⁴년). 여러분 몸속의 수소는 우주만큼 오래되었습니다."],
      ),
      relation,
      note,
    };
  if (p === "neutron")
    return {
      title: "중성자(n⁰)",
      subtitle: "중입자 · 쿼크 구성 udd · 스핀 ½",
      summary: "중성자는 전기적으로 중성이지만 양성자보다 약간 무겁습니다. 안정한 원자핵 안에 묶여 있으면 안정하지만, 자유 상태에서는 β 붕괴합니다.",
      facts: [
        { label: "전하", value: "0" },
        { label: "질량", value: "939.57 MeV/c²" },
        { label: "자기 모멘트", value: "−1.91 μN" },
        { label: "자유 중성자 수명", value: "≈ 880 s" },
      ],
      sections: sections(
        ["원자가 쿼크 u, d, d: +⅔ − ⅓ − ⅓ = 0.", "전체로는 중성이지만 자기 모멘트를 가지며, 이는 전하를 띤 구성 입자가 있다는 증거입니다."],
        [`원자핵 밖에서: n → p + e⁻ + ν̄ₑ (평균 수명 ≈ 880 s, 약 15분). ${N ? `${el.isotopeSymbol} 같은 ` : ""}안정한 원자핵 안에 묶인 중성자는 붕괴하지 않습니다.`],
        [`중성자는 전기적 반발 없이 강한 핵력에 의한 결합을 더해 줍니다. N/Z 비(여기서는 ${N}/${el.Z})가 원자핵의 안정성을 좌우합니다.`],
      ),
      relation,
      note,
    };
  return {
    title: "전자(e⁻)",
    subtitle: "렙톤 · 스핀 ½ · 안정 · 알려진 내부 구조 없음",
    summary: "전자는 전하 −e를 띠며 질량은 양성자의 ~1/1836에 불과합니다. 전자는 원자핵 주위의 오비탈을 차지하고 화학 결합을 형성합니다.",
    facts: [
      { label: "전하", value: "−1.602×10⁻¹⁹ C" },
      { label: "질량", value: "0.511 MeV/c²" },
      { label: "크기", value: "점 입자(< 10⁻¹⁸ m)" },
      { label: "스핀", value: "½(페르미온)" },
    ],
    sections: sections(
      ["기본 렙톤입니다. 내부 구조가 검출된 적이 없습니다."],
      ["공유 결합은 공유된 전자쌍입니다. 예를 들어 여러분이 살펴본 아미노산의 Cα–N 결합에는 전자 두 개가 들어 있습니다."],
      ["전자는 페르미온이므로 파울리 배타 원리(오비탈 하나에 스핀이 반대인 전자 최대 두 개)를 따르며, 이로부터 껍질 구조와 주기율표가 생겨납니다."],
    ),
    relation,
    note,
  };
}
