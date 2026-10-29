// Korean version of ../aminoAcids.ts: same exports and signatures, Korean text.
// Codes, formulas, classes, masses and colours come from the English entries; only the text is Korean.
import { AA_CLASS_INFO as EN_CLASS_INFO, AMINO_ACIDS as EN, type AminoAcidInfo } from "../aminoAcids";

export const AMINO_ACIDS: Record<string, AminoAcidInfo> = {
  GLY: {
    ...EN.GLY,
    name: "글리신",
    sideChainBeginner: "글리신은 가장 작은 아미노산으로, 곁사슬이 수소 원자 하나뿐입니다. 그래서 매우 유연하며, 사슬이 구부러져야 하는 자리에 자주 놓입니다.",
    sideChainScientific: "R = H. Cα에 수소가 2개 결합해 있어, 표준 아미노산 중 유일하게 키랄성이 없습니다. 골격 φ/ψ 이면각의 허용 범위가 가장 넓어 급격한 턴에 흔히 나타납니다.",
    example: "콜라겐(피부와 힘줄을 튼튼하게 하는 단백질)을 이루는 아미노산은 약 3개 중 1개가 글리신입니다.",
  },
  ALA: {
    ...EN.ALA,
    name: "알라닌",
    sideChainBeginner: "알라닌의 곁사슬은 작은 메틸기(탄소 1개에 수소 3개)입니다. 물을 피하는 성질이 있고, 나선이 만들어지는 것을 돕습니다.",
    sideChainScientific: "R = –CH₃. 작고 비극성이며, α-나선 형성 경향이 강합니다.",
    example: "알라닌은 단백질에서 가장 흔한 아미노산 중 하나이며, 우리 몸의 세포가 쉽게 만들어 냅니다.",
  },
  VAL: {
    ...EN.VAL,
    name: "발린",
    sideChainBeginner: "발린의 곁사슬은 가지가 갈라진 기름 같은 구조라 물을 피합니다. 그래서 대개 접힌 단백질의 안쪽에 숨어 있습니다.",
    sideChainScientific: "R = –CH(CH₃)₂. β-분지형이고 소수성이며, β-가닥을 선호합니다.",
    example: "발린은 필수 아미노산입니다. 우리 몸에서 만들 수 없으므로 음식으로 섭취해야 합니다.",
  },
  LEU: {
    ...EN.LEU,
    name: "류신",
    sideChainBeginner: "류신의 곁사슬은 더 큰 기름 같은 구조입니다. 기름 같은 곁사슬은 물을 피해 단백질의 중심부에 함께 모입니다.",
    sideChainScientific: "R = –CH₂CH(CH₃)₂. 소수성이고 α-나선 형성 경향이 강하며, 단백질 코어에서 가장 흔한 잔기 중 하나입니다.",
    example: "류신은 음식으로 반드시 섭취해야 하는 아미노산이며, 근육에 새 단백질을 만들라는 신호를 보냅니다.",
  },
  ILE: {
    ...EN.ILE,
    name: "아이소류신",
    sideChainBeginner: "아이소류신의 곁사슬은 가지가 갈라진 기름 같은 구조로, 류신과 같은 원자로 이루어져 있지만 배열이 다릅니다.",
    sideChainScientific: "R = –CH(CH₃)CH₂CH₃. β-분지형이고 소수성이며, Cβ에 두 번째 키랄 중심이 있습니다.",
    example: "아이소류신은 스포츠 보충제에 들어 있는 세 가지 ‘분지 사슬’ 아미노산 중 하나입니다.",
  },
  MET: {
    ...EN.MET,
    name: "메티오닌",
    sideChainBeginner: "메티오닌에는 황 원자가 들어 있습니다. 세포가 단백질을 만들기 시작할 때 보통 가장 먼저 오는 아미노산입니다.",
    sideChainScientific: "R = –CH₂CH₂SCH₃ (싸이오에터). 개시 코돈 AUG가 암호화하므로, 새로 합성되는 단백질 대부분이 메티오닌으로 시작합니다.",
    example: "달걀, 생선, 참깨에는 메티오닌이 풍부합니다.",
  },
  PHE: {
    ...EN.PHE,
    name: "페닐알라닌",
    sideChainBeginner: "페닐알라닌의 곁사슬에는 탄소 원자 6개로 이루어진 평평한 고리가 있습니다.",
    sideChainScientific: "R = –CH₂–C₆H₅ (벤질). 방향족이고 소수성이며, 다른 고리와 쌓임 상호작용을 합니다.",
    example: "다이어트 음료에 페닐알라닌 경고 문구가 붙는 것은 페닐케톤뇨증(PKU) 환자가 이를 분해하지 못하기 때문입니다.",
  },
  TRP: {
    ...EN.TRP,
    name: "트립토판",
    sideChainBeginner: "트립토판의 곁사슬은 가장 큽니다. 질소가 들어 있는 이중 고리 구조입니다.",
    sideChainScientific: "R = –CH₂–인돌. 가장 큰 방향족 곁사슬이며, 그 형광을 이용해 단백질 접힘을 연구합니다.",
    example: "우리 몸은 트립토판으로 뇌의 화학 전달 물질인 세로토닌을 만듭니다.",
  },
  PRO: {
    ...EN.PRO,
    name: "프롤린",
    sideChainBeginner: "프롤린의 곁사슬은 되돌아와 자기 자신의 질소와 결합해 고리를 만듭니다. 그래서 그 자리에서 사슬이 뻣뻣해집니다.",
    sideChainScientific: "고리형: 곁사슬이 골격 N에 결합해 2차 아민을 이루므로 φ ≈ −65°로 고정되고 아마이드 H가 없습니다. 그래서 Pro는 나선을 끊습니다.",
    example: "프롤린은 콜라겐에 풍부하며, 밧줄 같은 삼중 나선을 만드는 데 기여합니다.",
  },
  SER: {
    ...EN.SER,
    name: "세린",
    sideChainBeginner: "세린의 곁사슬에는 알코올처럼 –OH가 있어 물을 좋아합니다.",
    sideChainScientific: "R = –CH₂OH. 극성 하이드록실기를 가지며, 인산화가 자주 일어나는 자리이자 세린 프로테아제의 친핵체입니다.",
    example: "트립신 같은 소화 효소는 세린을 이용해 다른 단백질을 자릅니다.",
  },
  THR: {
    ...EN.THR,
    name: "트레오닌",
    sideChainBeginner: "트레오닌에는 –OH기와 작은 탄소 부분이 함께 있어 어느 정도 물을 좋아합니다.",
    sideChainScientific: "R = –CH(OH)CH₃. β-분지형이고 극성이며, Cβ에 두 번째 키랄 중심이 있습니다.",
    example: "트레오닌은 유제품과 렌틸콩에 들어 있는 필수 아미노산입니다.",
  },
  CYS: {
    ...EN.CYS,
    name: "시스테인",
    sideChainBeginner: "시스테인에는 황이 들어 있습니다. 시스테인 두 개가 스테이플러 심처럼 서로 이어져 단백질의 모양을 붙잡아 줄 수 있습니다.",
    sideChainScientific: "R = –CH₂SH (싸이올, pKa ≈ 8.3). 이황화 결합(–S–S–)을 형성할 수 있으며, KRAS G12C 억제제 같은 공유 결합 약물의 표적입니다.",
    example: "시스테인 사이의 이황화 결합이 ‘스테이플러 심’처럼 머리카락의 모양을 잡아 줍니다. 파마는 이 결합을 끊었다가 다시 만드는 원리입니다.",
  },
  ASN: {
    ...EN.ASN,
    name: "아스파라진",
    sideChainBeginner: "아스파라진의 곁사슬에는 질소와 산소가 있어 물과 쉽게 수소 결합을 이룹니다.",
    sideChainScientific: "R = –CH₂CONH₂ (카복스아마이드). 극성이지만 전하를 띠지 않으며, 턴에 흔하고 N-연결 글리코실화가 일어나는 자리입니다.",
    example: "아스파라진은 가장 먼저 발견된 아미노산입니다. 1806년에 아스파라거스 즙에서 분리되었습니다.",
  },
  GLN: {
    ...EN.GLN,
    name: "글루타민",
    sideChainBeginner: "글루타민은 아스파라진보다 조금 더 긴, 물을 좋아하는 곁사슬을 가지고 있습니다.",
    sideChainScientific: "R = –CH₂CH₂CONH₂. 극성 카복스아마이드기를 가지며, 혈액의 주요 질소 운반체입니다.",
    example: "글루타민은 사람 혈액에 가장 많은 자유 아미노산입니다.",
  },
  TYR: {
    ...EN.TYR,
    name: "타이로신",
    sideChainBeginner: "타이로신의 곁사슬에는 끝에 –OH기가 달린 탄소 고리가 있습니다.",
    sideChainScientific: "R = –CH₂–C₆H₄–OH (페놀). 방향족이고 약한 극성을 띠며, 타이로신 인산화효소의 표적입니다.",
    example: "우리 몸은 타이로신으로 아드레날린과 피부 색소인 멜라닌을 만듭니다.",
  },
  ASP: {
    ...EN.ASP,
    name: "아스파르트산",
    sideChainBeginner: "아스파르트산의 곁사슬은 산성이며, 몸속에서 음전하를 띱니다.",
    sideChainScientific: "R = –CH₂COOH (pKa ≈ 3.9). pH 7에서는 탈양성자화되어 아스파르트산 음이온(–CH₂COO⁻)으로 존재합니다.",
    example: "감미료 아스파탐은 아스파르트산과 페닐알라닌으로 만듭니다.",
  },
  GLU: {
    ...EN.GLU,
    name: "글루탐산",
    sideChainBeginner: "글루탐산의 곁사슬은 산성이며 음전하를 띱니다.",
    sideChainScientific: "R = –CH₂CH₂COOH (pKa ≈ 4.1). pH 7에서는 글루탐산 음이온(–COO⁻)으로 존재합니다.",
    example: "글루탐산은 MSG에서처럼 음식에 감칠맛(‘우마미’)을 내며, 뇌의 주요 흥분성 신경 전달 물질입니다.",
  },
  LYS: {
    ...EN.LYS,
    name: "라이신",
    sideChainBeginner: "라이신의 곁사슬은 길고, 끝에 양전하를 띤 아미노기가 있습니다.",
    sideChainScientific: "R = –(CH₂)₄NH₃⁺ (pKa ≈ 10.5). 라이신의 ε-아미노기에는 유비퀴틴 자체를 비롯한 화학적 표지가 흔히 붙습니다.",
    example: "유비퀴틴의 라이신으로 이어진 사슬은 ‘재활용’ 꼬리표처럼 작용합니다. K48로 연결된 사슬은 단백질을 세포의 분쇄기로 보냅니다.",
  },
  ARG: {
    ...EN.ARG,
    name: "아르지닌",
    sideChainBeginner: "아르지닌의 곁사슬은 길고, 질소 원자 여러 개와 양전하를 가지고 있습니다.",
    sideChainScientific: "R = –(CH₂)₃NH–C(=NH₂⁺)NH₂ (구아니디늄, pKa ≈ 12.5). 전하가 질소 3개에 비편재화되어 있습니다.",
    example: "우리 몸은 아르지닌으로 혈관 이완을 돕는 일산화질소를 만듭니다.",
  },
  HIS: {
    ...EN.HIS,
    name: "히스티딘",
    sideChainBeginner: "히스티딘의 곁사슬에는 질소 원자 2개가 들어 있는 고리가 있어, 수소를 쉽게 얻거나 내놓을 수 있습니다.",
    sideChainScientific: "R = –CH₂–이미다졸 (pKa ≈ 6.0). pKa가 생리적 pH에 가까워 이 부근에서 전하 상태가 바뀝니다. 여기서는 중성인 Nε2-H 호변 이성질체로 나타냈습니다.",
    example: "많은 효소가 반응 중에 히스티딘을 이용해 양성자(H⁺)를 주고받습니다.",
  },
};

export const AA_CLASS_INFO: typeof EN_CLASS_INFO = {
  nonpolar: { ...EN_CLASS_INFO.nonpolar, label: "비극성(소수성)", beginner: "기름 같은 곁사슬" },
  polar: { ...EN_CLASS_INFO.polar, label: "극성(친수성)", beginner: "물을 좋아하는 곁사슬" },
  acidic: { ...EN_CLASS_INFO.acidic, label: "산성(음전하)", beginner: "음전하" },
  basic: { ...EN_CLASS_INFO.basic, label: "염기성(양전하)", beginner: "양전하" },
  glycine: { ...EN_CLASS_INFO.glycine, label: "글리신(가장 작음)", beginner: "글리신" },
};

/** Like the English aminoAcid(): an unknown residue name falls back to glycine. */
export function aminoAcid(resName: string): AminoAcidInfo {
  return AMINO_ACIDS[resName] ?? AMINO_ACIDS.GLY;
}
