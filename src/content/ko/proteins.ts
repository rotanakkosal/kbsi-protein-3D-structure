// Korean version of ../proteins.ts: same exports and signatures, Korean text.
// Structural data (files, chains, residue ranges, hotspots, citations) comes from the English
// entries by spreading them; only the text fields are overridden here.
import * as EN from "../proteins";
import { dataLine, hasLigand, type ProteinEntry, type ProteinId, type SiteSpec } from "../proteins";
import type { InfoSection } from "../info";
import type { ProteinModel } from "@/lib/structure/protein";

export type { Hotspot, ProteinEntry, ProteinId, ResidueNote, SiteSpec } from "../proteins";
export { PROTEIN_ORDER } from "../proteins";

const sections = (made: string[], example: string[], why: string[]): InfoSection[] => [
  { id: "made", label: "구성", body: made },
  { id: "example", label: "예시", body: example },
  { id: "why", label: "중요한 이유", body: why },
];

const nm = (m: ProteinModel) => `약 ${(m.maxDimension / 10).toFixed(1)} nm`;

/** Experimental method from the file (e.g. "X-RAY DIFFRACTION") in Korean; unknown methods stay as in English. */
const METHOD: Record<string, string> = {
  "X-RAY DIFFRACTION": "X선 회절",
  "SOLUTION NMR": "용액 NMR",
  "ELECTRON MICROSCOPY": "전자 현미경",
};
const method = (m: ProteinModel) => METHOD[m.method.toUpperCase()] ?? m.method.toLowerCase();

/** The English sites with Korean labels; start and end stay as in the English entry. */
const relabel = (sites: SiteSpec[], labels: string[]): SiteSpec[] => sites.map((s, i) => ({ ...s, label: labels[i] ?? s.label }));

/* ------------------------------------------------------------------ ligands */

export const LIGAND_INFO: Record<string, { name: string; beginner: string; scientific: string }> = {
  GDP: {
    name: EN.LIGAND_INFO.GDP.name,
    beginner: "GDP(구아노신 이인산)입니다. KRAS가 GDP를 붙들고 있는 동안에는 스위치가 꺼져(OFF) 있습니다.",
    scientific: "구아노신 5′-이인산: 비활성 상태의 뉴클레오타이드로, β-인산기가 P-루프에 단단히 붙잡혀 있습니다.",
  },
  GTP: {
    name: EN.LIGAND_INFO.GTP.name,
    beginner: "GTP(구아노신 삼인산)입니다. KRAS가 GTP를 붙들고 있는 동안에는 스위치가 켜져(ON) 있습니다.",
    scientific: "구아노신 5′-삼인산: 활성 상태의 뉴클레오타이드로, GDP + Pᵢ로 가수분해됩니다.",
  },
  GNP: {
    name: EN.LIGAND_INFO.GNP.name,
    beginner: "실험실에서 GTP를 본떠 만든, 쪼개지지 않는 분자입니다. KRAS를 켜짐(ON) 상태로 고정하는 데 쓰입니다.",
    scientific: "포스포아미노포스폰산-구아닐산 에스터(GppNHp): 비가수분해성 GTP 유사체입니다.",
  },
  GCP: {
    name: EN.LIGAND_INFO.GCP.name,
    beginner: "실험실에서 GTP를 본떠 만든, 쪼개지지 않는 분자입니다.",
    scientific: "포스포메틸포스폰산 구아닐산 에스터: 비가수분해성 GTP 유사체입니다.",
  },
  MG: {
    name: EN.LIGAND_INFO.MG.name,
    beginner: "뉴클레오타이드의 인산기들을 제자리에 붙잡아 두도록 돕는 마그네슘 이온입니다.",
    scientific: "Mg²⁺ 보조인자: β-인산기와 Ser17이 배위합니다(GTP 상태에서는 Thr35도 배위).",
  },
};

/* ------------------------------------------------------------------ ubiquitin */

const ubiquitin: ProteinEntry = {
  ...EN.PROTEINS.ubiquitin,
  name: "유비퀴틴",
  sites: relabel(EN.PROTEINS.ubiquitin.sites, ["Lys48 · 사슬 연결 부위"]),
  tail: {
    beginner: "사슬의 유연한 끝부분입니다. 세포는 이 사슬의 마지막 아미노산을 다른 단백질에 붙입니다.",
    scientific: "Gly75–Gly76으로 끝나는 유연한 C-말단 꼬리로, 이 말단이 접합 부위입니다.",
  },
  levelOne: (m, mode) => {
    if (mode === "beginner") {
      return {
        title: "유비퀴틴",
        subtitle: "단백질: 커다란 생체 분자",
        summary:
          "단백질은 아미노산이 줄줄이 연결되어 만들어진 커다란 생체 분자입니다. 단백질은 생물의 몸속에서 중요한 일을 합니다. 여기 보이는 단백질인 유비퀴틴은 우리 몸의 거의 모든 세포에 들어 있습니다.",
        facts: [
          { label: "아미노산 수", value: `${m.residues.length}` },
          { label: "원자 수(H 제외)", value: `${m.heavyAtomCount}` },
          { label: "크기", value: nm(m) },
        ],
        sections: sections(
          [
            `아미노산 ${m.residues.length}개가 이어진 긴 사슬 하나가 촘촘한 3차원 모양으로 접혀 있습니다.`,
            "색깔 있는 모양은 모두 이 사슬 하나의 일부입니다. 용수철처럼 감긴 부분은 나선, 납작한 화살표는 시트, 가는 관은 루프입니다.",
          ],
          [
            "유비퀴틴은 “재활용해 주세요”라는 꼬리표처럼 작동합니다. 세포는 낡거나 손상된 단백질에 유비퀴틴을 붙이고, 그러면 세포의 재활용 기계(프로테아솜)가 그 단백질을 분해해 부품을 다시 씁니다.",
          ],
          [
            "단백질은 모양에 따라 하는 일이 정해집니다. 단백질은 음식을 소화하고(효소), 병균과 싸우고(항체), 산소를 나르고(헤모글로빈), 머리카락과 피부를 만듭니다(케라틴과 콜라겐).",
            "유비퀴틴은 매우 중요한 단백질이어서 사람, 효모, 식물에서 서열이 거의 똑같습니다.",
          ],
        ),
        relation: {
          up: "단백질들은 세포 안에서 함께 일하며 우리가 살아갈 수 있게 해 줍니다.",
          down: "확대해 보면 이 단백질은 접힌 폴리펩타이드 사슬 하나입니다.",
        },
        note: {
          tone: "info",
          title: "이 모델을 보는 법",
          text: "이 리본 그림은 X선 결정학으로 측정한 실제 원자 위치를 바탕으로 그렸습니다. 리본은 사슬이 지나가는 길을 따라가며, 가까이 확대하면 원자 하나하나가 나타납니다.",
        },
      };
    }
    return {
      title: `유비퀴틴 · PDB ${m.idCode || "1UBI"}`,
      subtitle: `구형 단백질 · Homo sapiens · ${method(m)}${m.resolution ? `, ${m.resolution.toFixed(1)} Å` : ""}`,
      summary:
        "단백질은 L-α-아미노산의 중합체인 생체 고분자로, 그 서열에 고유한 3차원 접힘 구조가 암호화되어 있습니다. 유비퀴틴(76개 잔기, 8.6 kDa)은 β-grasp 접힘 구조, 즉 5가닥 혼합형 β-시트가 α-나선 하나에 맞대어 패킹된 구조를 취합니다.",
      facts: [
        { label: "잔기 수", value: `${m.residues.length}` },
        { label: "질량", value: `${m.massKDa.toFixed(1)} kDa` },
        { label: "비수소 원자 수", value: `${m.heavyAtomCount}` },
        { label: "최대 크기", value: `${(m.maxDimension / 10).toFixed(1)} nm` },
      ],
      sections: sections(
        [
          "단일 폴리펩타이드 사슬(사슬 A)이며, Met1–Gly76으로 이루어집니다.",
          "2차 구조(PDB HELIX/SHEET 레코드): α-나선 Ile23–Glu34; 3₁₀-나선 Leu56–Tyr59; β-가닥 1–7, 10–17, 40–45, 48–50, 64–72.",
          "소수성 코어가 있고, 표면에는 유비퀴틴 결합 도메인이 인식하는 패치(Leu8, Ile44, Val70)가 있습니다.",
        ],
        [
          "C-말단의 Gly76은 E1–E2–E3 효소 연쇄 반응을 거쳐 표적 단백질에 있는 라이신의 ε-아미노기와 연결됩니다(아이소펩타이드 결합).",
          "Lys48 연결 폴리유비퀴틴 사슬은 표적 단백질을 26S 프로테아솜으로 보내 분해되게 하고, Lys63 연결 사슬은 DNA 복구와 신호 전달에 관여합니다.",
        ],
        [
          "유비퀴틴 매개 단백질 분해는 단백질 대사 회전(turnover), 세포 주기, DNA 복구, 면역 신호 전달을 조절합니다. 이 과정을 발견한 공로로 Ciechanover, Hershko, Rose가 2004년 노벨 화학상을 받았습니다.",
          "사람과 효모의 유비퀴틴은 76개 위치 중 3곳에서만 달라, 알려진 단백질 가운데 가장 잘 보존된 단백질 중 하나입니다.",
        ],
      ),
      relation: {
        up: "4차 구조 수준: 단백질은 모여서 복합체와 경로를 이룹니다(예: 유비퀴틴–프로테아솜 시스템).",
        down: "3차 구조 = 접힌 폴리펩타이드 사슬.",
      },
      note: {
        tone: "info",
        title: "표현 방식 및 데이터",
        text: `골격 좌표로 계산한 카툰 표현입니다(Cα 스플라인, 리본 방향은 C=O 벡터 기준). 나선은 리본, 가닥은 화살표(N→C), 코일은 튜브로 나타냈습니다. 확대하면 곁사슬 결합이 보입니다. 좌표: ${dataLine(m, ubiquitin)}.`,
      },
    };
  },
  chainExamples: {
    beginner:
      "목걸이에 꿴 구슬을 떠올려 보세요. 구슬의 순서는 DNA에 적혀 있습니다. 구슬 하나만 바뀌어도 단백질 전체가 달라질 수 있습니다. 겸상 적혈구 빈혈증에서는 헤모글로빈의 아미노산 단 하나가 다릅니다.",
    scientific: "β-가닥을 따라 소수성 잔기가 하나 걸러 하나씩 놓이므로, 시트의 한쪽 면이 코어 쪽으로 패킹됩니다.",
    scientificExtra: "사람과 효모의 유비퀴틴은 76개 위치 중 단 3곳(P19S, E24D, A28S)만 다릅니다.",
  },
  residueNote: (seq, resName) => {
    if (seq === 1 && resName === "MET")
      return {
        beginner: "Met1은 사슬의 맨 첫 번째 아미노산입니다.",
        scientific: "Met1은 N-말단 잔기이며, 그 α-아미노기는 선형(M1 연결) 유비퀴틴 사슬의 고정점이 되기도 합니다.",
      };
    if ((seq === 8 && resName === "LEU") || (seq === 44 && resName === "ILE") || (seq === 70 && resName === "VAL"))
      return {
        beginner: "이 아미노산은 유비퀴틴 표면의 기름진 부분에 속합니다. 다른 단백질들이 이 부분을 붙잡습니다.",
        scientific: "대부분의 유비퀴틴 결합 도메인이 인식하는 Ile44 소수성 패치(Leu8, Ile44, Val70)의 일부입니다.",
      };
    if (seq === 48 && resName === "LYS")
      return {
        beginner: "이 자리에 유비퀴틴이 더 이어 붙어 사슬을 이루면, 그 단백질은 재활용될 곳으로 보내집니다.",
        scientific: "Lys48: K48 연결 폴리유비퀴틴은 프로테아솜 분해의 전형적인 신호입니다.",
      };
    if (seq === 63 && resName === "LYS")
      return {
        beginner: "이 라이신에 이어 붙은 사슬은 DNA 복구를 돕습니다.",
        scientific: "Lys63: K63 연결 사슬은 DNA 복구, 세포내이입(엔도사이토시스), 신호 전달에 관여합니다.",
      };
    if ([6, 11, 27, 29, 33].includes(seq) && resName === "LYS")
      return {
        beginner: "유비퀴틴의 라이신 7개 중 하나입니다. 라이신마다 또 다른 유비퀴틴이 붙을 수 있습니다.",
        scientific: `Lys${seq}: 각각 유비퀴틴–유비퀴틴 연결을 형성할 수 있는 라이신 7개 중 하나입니다.`,
      };
    if ((seq === 75 || seq === 76) && resName === "GLY")
      return {
        beginner: "유연한 꼬리의 일부입니다. 마지막 글리신(76번)이 다른 단백질에 붙는 부분입니다.",
        scientific: `C-말단 꼬리의 Gly${seq}입니다. Gly76은 기질 단백질의 라이신과 아이소펩타이드 결합을 형성합니다.`,
      };
    if (seq === 10 && resName === "GLY")
      return {
        beginner: "Gly10은 처음 두 가닥 사이에서 사슬이 반대쪽으로 꺾여 되돌아가는 급한 턴에 있습니다.",
        scientific: "Gly10은 가닥 1과 가닥 2 사이의 급격한 β-헤어핀 턴(Leu8–Gly10)을 닫는 잔기입니다.",
      };
    return null;
  },
};

/* ------------------------------------------------------------------ KRAS */

const ligandList = (m: ProteinModel) => m.ligands.map((l) => LIGAND_INFO[l.resName]?.name ?? l.resName);

const kras: ProteinEntry = {
  ...EN.PROTEINS.kras,
  name: "KRAS",
  sites: relabel(EN.PROTEINS.kras.sites, ["P-루프", "스위치 I", "스위치 II"]),
  tail: {
    beginner: "이 모델에서 사슬이 끝나는 곳입니다. 실제 세포 속 KRAS는 여기서 유연한 꼬리로 더 이어지며, 이 꼬리가 KRAS를 세포막에 고정합니다.",
    scientific: "결정화된 G 도메인의 C-말단입니다. 초가변 영역(잔기 ~170–188)과 파네실화된 Cys185는 이 구조에 없습니다.",
  },
  levelOne: (m, mode) => {
    const first = m.residues[0];
    const last = m.residues[m.residues.length - 1];
    const ligands = ligandList(m);
    const gdp = hasLigand(m, ["GDP"]);
    const gtpLike = hasLigand(m, ["GTP", "GNP", "GCP"]);
    if (mode === "beginner") {
      return {
        title: "KRAS",
        subtitle: "단백질: 세포 성장을 켜고 끄는 분자 스위치",
        summary:
          "단백질은 아미노산이 줄줄이 연결되어 만들어진 커다란 생체 분자입니다. 단백질은 생물의 몸속에서 중요한 일을 합니다. KRAS는 세포 안의 전등 스위치처럼 작동합니다. 켜지면(ON) 세포에 자라서 분열하라고 알리고, 그다음 스스로 다시 꺼집니다(OFF).",
        facts: [
          { label: "표시된 아미노산 수", value: `${m.residues.length}` },
          { label: "원자 수(H 제외)", value: `${m.heavyAtomCount}` },
          { label: "크기", value: nm(m) },
        ],
        sections: sections(
          [
            `아미노산 사슬 하나가 촘촘한 모양으로 접혀 있습니다. 이 모델은 KRAS에서 실제로 스위치 역할을 하는 부분(아미노산 ${first.seq}번부터 ${last.seq}번까지)을 보여 줍니다.`,
            gdp
              ? "주머니에 붙잡혀 있는 작은 분자(공과 막대)는 GDP입니다. KRAS는 GDP를 붙들고 있는 동안 꺼져(OFF) 있고, GDP를 GTP로 바꾸면 켜집니다(ON)."
              : gtpLike
                ? "주머니에 붙잡혀 있는 작은 분자(공과 막대)는 GTP를 본뜬 분자로, KRAS를 켜진(ON) 상태로 유지합니다."
                : "KRAS는 GTP라는 작은 분자를 붙들면 켜지고(ON), GDP를 붙들면 꺼집니다(OFF).",
          ],
          [
            "많은 암에서는 KRAS가 고장 나서 켜짐(ON) 위치에 멈춘 채 세포에 계속 자라라고 알립니다. 췌장암 10건 중 약 9건에서 KRAS의 변화가 발견됩니다.",
          ],
          [
            "KRAS는 수십 년 동안 “약으로 겨냥할 수 없는” 단백질로 불렸습니다. 과학자들이 KRAS의 모양에서 숨은 주머니를 찾아낸 뒤, 2021년에 고장 난 KRAS의 한 형태(G12C)를 막는 첫 번째 약이 승인되었습니다.",
            "KRAS에서 가장 자주 바뀌는 아미노산은 12번 글리신으로, 확대하면 가장 먼저 들르는 곳입니다.",
          ],
        ),
        relation: {
          up: "KRAS는 세포 안에서 메시지를 전달합니다. 세포 표면에 도착한 성장 신호를 핵 쪽으로 전해 줍니다.",
          down: "확대해 보면 KRAS는 접힌 폴리펩타이드 사슬 하나입니다.",
        },
        note: {
          tone: "info",
          title: "이 모델을 보는 법",
          text: "이 리본 그림은 X선 결정학으로 측정한 실제 원자 위치를 바탕으로 그렸습니다. 주머니 속 분자는 공과 막대로 나타냈습니다. 가까이 확대하면 단백질의 원자 하나하나가 나타납니다.",
        },
      };
    }
    return {
      title: `KRAS · PDB ${m.idCode || "4OBE"}`,
      subtitle: `소형 GTP 가수분해효소 · Homo sapiens · ${method(m)}${m.resolution ? `, ${m.resolution.toFixed(2)} Å` : ""}`,
      summary: `KRAS는 RAS 슈퍼패밀리에 속하는 소형 GTP 가수분해효소(GTPase)입니다. G 도메인(이 구조에서는 잔기 ${first.seq}–${last.seq})은 Ras 접힘 구조를 취합니다. 6가닥 β-시트 양옆을 α-나선 5개가 둘러싼 이 구조는 Mg²⁺ 이온과 함께 GDP 또는 GTP와 결합합니다. GTP 결합 KRAS는 RAF 같은 효과기 단백질과 결합하여 RAF–MEK–ERK(MAPK) 경로를 활성화합니다.`,
      facts: [
        { label: "모델링된 잔기", value: `${first.seq}–${last.seq}` },
        { label: "질량(G 도메인)", value: `${m.massKDa.toFixed(1)} kDa` },
        { label: "결합 리간드", value: ligands.length ? ligands.join(" · ") : "없음" },
        { label: "비수소 원자 수", value: `${m.heavyAtomCount}` },
      ],
      sections: sections(
        [
          `단일 사슬(${m.chainId})입니다. 결정화된 G 도메인은 188개 잔기로 된 KRAS4B 아이소폼 중 잔기 ${first.seq}–${last.seq}에 해당합니다.`,
          "인산 결합 P-루프는 Gly10–Ser17(GAGGVGKS)입니다. 스위치 I(~30–38)과 스위치 II(~59–76)는 GDP 상태와 GTP 상태 사이에서 입체 구조가 바뀌고, NKxD(116–119)와 SAK(145–147) 모티프는 구아닌 염기를 인식합니다.",
          "Ser17은 Mg²⁺ 이온에 배위하며, GTP 상태에서는 스위치 I의 Thr35도 함께 배위합니다.",
        ],
        [
          "발암성 핫스팟 G12, G13, Q61의 돌연변이는 GAP에 의해 촉진되는 GTP 가수분해를 저해합니다(Gly12 치환은 GAP의 아르지닌 핑거를 입체적으로 차단). 그 결과 KRAS는 GTP 결합 상태로 남아 신호를 계속 전달합니다.",
          "공유 결합형 KRAS G12C 억제제인 소토라십(2021년 승인)과 아다그라십(2022년)은 GDP 결합 KRAS의 스위치 II 포켓에 결합하여 KRAS를 비활성 상태에 가둡니다.",
        ],
        [
          "RAS 유전자 돌연변이는 인간 암의 약 5분의 1에서 나타나며, 그 대부분을 KRAS가 차지합니다. 특히 췌장암, 대장암, 폐선암에서 두드러집니다.",
        ],
      ),
      relation: {
        up: "신호 전달: C-말단 초가변 영역(결정 구조에는 없음)을 통해 세포막에 고정되며, 수용체 타이로신 인산화효소의 신호를 RAF–MEK–ERK로 전달합니다.",
        down: "3차 구조 = 접힌 폴리펩타이드 사슬.",
      },
      note: {
        tone: "info",
        title: "표현 방식 및 데이터",
        text: `골격 좌표로 계산한 카툰 표현입니다(Cα 스플라인, 리본 방향은 C=O 벡터 기준). 결합한 리간드는 공-막대 모형으로 그렸으며, 리간드 안의 결합은 원자 간 거리로부터 추론했습니다. 좌표: ${dataLine(m, kras)}.`,
      },
    };
  },
  chainExamples: {
    beginner:
      "구슬 하나만 바뀌어도 모든 것이 달라질 수 있습니다. 12번 글리신이 다른 아미노산으로 바뀌면(예: G12D, G12C) KRAS 스위치가 켜짐(ON) 위치에 걸려 버립니다.",
    scientific: "핫스팟 잔기 Gly12와 Gly13은 P-루프에, Gln61은 스위치 II에 있습니다.",
    scientificExtra: "KRAS, HRAS, NRAS는 G 도메인 전체에서 약 90%의 서열 동일성을 보이며, 주로 초가변 영역에서 차이가 납니다.",
  },
  residueNote: (seq, resName) => {
    if (seq === 12 && resName === "GLY")
      return {
        beginner:
          "Gly12는 암에서 가장 자주 바뀌는 KRAS의 아미노산입니다. 이 아주 작은 글리신이 다른 아미노산으로 바뀌면(예: G12D, G12V, G12C) KRAS가 스스로 꺼지지(OFF) 못합니다.",
        scientific:
          "Gly12(P-루프). 이 위치에 어떤 곁사슬이 오든 GTP 가수분해효소 활성화 단백질(GAP)의 아르지닌 핑거를 입체적으로 가로막아 GTP 가수분해를 저해합니다. G12D, G12V, G12C가 가장 흔한 발암성 변이체입니다.",
      };
    if (seq === 13 && resName === "GLY")
      return {
        beginner: "Gly13은 이 루프에서 두 번째로 자주 바뀌는 자리입니다(G13D).",
        scientific: "Gly13(P-루프): 두 번째 글리신 핫스팟입니다(예: G13D).",
      };
    if (seq === 61 && resName === "GLN")
      return {
        beginner: "Gln61은 KRAS가 스스로 꺼지도록(OFF) 돕습니다. 이 아미노산이 바뀌면(예: Q61H) KRAS는 켜진(ON) 채로 남습니다.",
        scientific: "Gln61(스위치 II)은 GTP 가수분해에 필요한 촉매 물 분자의 위치를 잡아 줍니다. Q61 치환은 발암성입니다.",
      };
    if (seq === 17 && resName === "SER")
      return { beginner: "Ser17은 주머니 속 마그네슘 이온을 붙잡고 있습니다.", scientific: "Ser17(P-루프)은 Mg²⁺ 이온에 배위합니다." };
    if (seq === 35 && resName === "THR")
      return {
        beginner: "Thr35는 KRAS가 켜져(ON) 있을 때 주머니 안으로 뻗어 들어갑니다.",
        scientific: "Thr35(스위치 I)는 GTP 상태에서 Mg²⁺에 배위하고 γ-인산기와 접촉합니다.",
      };
    if (seq >= 10 && seq <= 17)
      return {
        beginner: "GDP나 GTP의 인산기를 붙잡는 P-루프의 일부입니다.",
        scientific: "P-루프(Gly10–Ser17, GxxxxGKS 모티프): 뉴클레오타이드의 인산기와 결합합니다.",
      };
    if (seq >= 30 && seq <= 38)
      return {
        beginner: "꺼짐(OFF)과 켜짐(ON) 사이에서 모양이 바뀌는 스위치 I의 일부입니다.",
        scientific: "스위치 I(~30–38): GTP가 결합하면 재배열되어 RAF 같은 효과기 단백질과 접촉합니다.",
      };
    if (seq >= 59 && seq <= 76)
      return {
        beginner: "꺼짐(OFF)과 켜짐(ON) 사이에서 모양이 바뀌는 스위치 II의 일부입니다. 소토라십 같은 약은 그 아래에 있는 주머니에 꼭 들어맞습니다.",
        scientific: "스위치 II(~59–76): 그 아래의 스위치 II 포켓은 공유 결합형 G12C 억제제의 결합 부위입니다.",
      };
    if (seq >= 116 && seq <= 119)
      return {
        beginner: "GDP와 GTP의 G(구아닌) 부분을 알아보는 작은 루프의 일부입니다.",
        scientific: "NKxD 모티프(Asn116–Asp119): 구아닌 염기를 인식합니다.",
      };
    if (seq >= 145 && seq <= 147)
      return {
        beginner: "마찬가지로 GDP와 GTP의 구아닌 부분을 붙잡는 루프의 일부입니다.",
        scientific: "SAK 모티프(Ser145–Lys147): 구아닌 결합을 안정화합니다.",
      };
    return null;
  },
};

export const PROTEINS: Record<ProteinId, ProteinEntry> = { ubiquitin, kras };
