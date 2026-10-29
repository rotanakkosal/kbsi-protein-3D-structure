// Korean version of ../tour.ts: same exports and signatures, Korean text.
// The steps keep the English levels and views; the context fields arrive in Korean (see Tour.tsx).
import { josa } from "@/i18n/ko";
import { TOUR_STEPS as EN, type TourStep } from "../tour";
import { POINT_LIKE } from "./levels";

/** Korean counts large numbers in 만 (10,000): 3.1 million is 310만, rounded as finely as the English "3.1 million" */
const millions = (x: number) => (x >= 1e6 ? `${(Math.round(x / 1e5) * 10).toLocaleString("en-US")}만` : Math.round(x).toLocaleString("en-US"));

export const TOUR_STEPS: TourStep[] = [
  {
    ...EN[0],
    title: (c) => `이것은 실제 단백질인 ${c.proteinName}입니다`,
    text: (c) =>
      `나선과 화살표는 모두 X선 결정학으로 측정한 원자 위치를 바탕으로 그린 것입니다. ${josa(c.proteinName, "은/는")} 폭이 약 ${c.sizes[0].short}이며, ${c.perHair.toLocaleString("en-US")}개를 나란히 늘어놓으면 가는 머리카락 한 올의 굵기가 됩니다.`,
  },
  {
    ...EN[1],
    title: () => "들여다보면: 접힌 사슬 하나",
    text: (c) => `확대해 보면 이 단백질은 아미노산 ${c.residueCount}개가 이어진 사슬 하나이며, 구슬 하나가 아미노산 하나입니다. 이 사슬이 스스로 접혀 단백질의 모양을 만듭니다.`,
  },
  {
    ...EN[2],
    title: () => "펼치면 긴 끈이 됩니다",
    text: (c) => `쭉 펼친 사슬은 ${c.sizes[1].short} 정도입니다. 아미노산의 순서(유전자에 기록된 서열)가 사슬이 어떻게 접힐지를 결정합니다.`,
  },
  {
    ...EN[3],
    title: (c) => `아미노산 하나: ${c.residueLabel}`,
    text: (c) =>
      `${josa(c.residueLabel, "은/는")} 사슬을 이루는 구슬 하나입니다. 탄소, 수소, 질소, 산소 원자로 이루어진, 폭이 약 ${c.sizes[2].short}인 작은 분자입니다.${c.residueNote ? ` ${c.residueNote}` : ""}`,
  },
  {
    ...EN[4],
    title: (c) => `원자 하나: ${c.atomName}`,
    text: (c) =>
      `이것은 ${c.residueLabel}의 ${c.atomDisplay} ${c.atomName} 원자이며, 지름은 약 ${c.sizes[3].short}입니다. 아주 작은 원자핵에 양성자 ${c.protons}개와 중성자 ${c.neutrons}개가 있고, 그 주위에 전자 ${c.protons}개가 있습니다. 이렇게 가지런한 궤도는 단순화한 그림입니다.`,
  },
  {
    ...EN[5],
    title: () => "전자는 구름을 이룹니다",
    text: () => "전자는 실제로 행성처럼 궤도를 돌지 않습니다. 이 구름은 전자가 발견될 가능성이 높은 곳을 보여 줍니다. 원자핵 가까이에서 가장 짙고, 멀어질수록 옅어집니다.",
  },
  {
    ...EN[6],
    title: () => "아원자 입자",
    text: (c) =>
      `양성자(+)와 중성자(전하 없음)는 각각 지름이 약 ${c.sizes[4].short === POINT_LIKE ? "1.7 fm" : c.sizes[4].short}이며, 쿼크 3개로 이루어져 있습니다. 전자(−)는 크기가 전혀 없는 것처럼 보입니다.`,
  },
  {
    ...EN[7],
    title: () => "단백질에서 입자까지",
    text: (c) => `방금 약 ${millions(c.zoomFactor)} 배 확대했습니다. ${c.sizes[0].short} 크기의 단백질에서 1.7 fm 크기의 양성자까지 내려왔습니다. 원하는 단계를 직접 탐색하거나 투어를 다시 보세요.`,
  },
];

/** How long a caption stays up: Korean is read more slowly per character than English. */
export const dwellMs = (text: string) => Math.max(6000, 2400 + text.length * 80);
