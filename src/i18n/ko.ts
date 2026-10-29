/**
 * Korean particles change with the word they follow: 은/는, 이/가, 을/를, 과/와 and 으로/로 depend on
 * whether its last syllable ends in a consonant (batchim). Inserted names such as "유비퀴틴", "KRAS",
 * "Gly12" or "Cα" need the right one, so josa() picks it from how the word is read aloud.
 */

type Pair = "은/는" | "이/가" | "을/를" | "과/와" | "으로/로" | "이다/다" | "이에요/예요";

/** Final consonant of a Hangul syllable: 0 none, 8 ㄹ, other values another consonant */
const finalOf = (code: number) => (code - 0xac00) % 28;

// how a trailing digit or Latin letter is read: 1 일, 3 삼, 6 육, 7 칠, 8 팔, 0 영 end in a consonant
const DIGIT_FINAL: Record<string, number> = { "0": 21, "1": 8, "2": 0, "3": 16, "4": 0, "5": 0, "6": 1, "7": 8, "8": 8, "9": 0 };
// letters read on their own: L 엘, M 엠, N 엔, R 알 end in a consonant
const LETTER_FINAL: Record<string, number> = { l: 8, m: 16, n: 4, r: 8 };
const SUB_SUPER = "₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹";

function finalSound(word: string): number {
  const w = word.replace(/[\s)\]}'"’”.,:;!?⁺⁻+−-]+$/u, "");
  const last = w.at(-1);
  if (!last) return 0;
  const code = last.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) return finalOf(code);
  const sub = SUB_SUPER.indexOf(last);
  if (sub >= 0) return DIGIT_FINAL[String(sub % 10)];
  if (/\d/.test(last)) {
    // 10 십, 100 백, 1000 천 are read by their place
    const m = /(\d+)$/.exec(w)![1];
    if (/[1-9]0$/.test(m)) return m.endsWith("000") ? 4 : m.endsWith("00") ? 1 : 17;
    return DIGIT_FINAL[last];
  }
  // Greek letters: α 알파, β 베타, γ 감마 … (all end in a vowel)
  if (/[α-ω]/i.test(last)) return 0;
  return LETTER_FINAL[last.toLowerCase()] ?? 0;
}

/** The word followed by the right particle, e.g. josa("KRAS", "은/는") → "KRAS는", josa("Gly12", "이/가") → "Gly12가". */
export function josa(word: string, pair: Pair): string {
  const [withFinal, without] = pair.split("/");
  const f = finalSound(word);
  // ㄹ takes 로, not 으로
  if (pair === "으로/로") return word + (f === 0 || f === 8 ? without : withFinal);
  return word + (f === 0 ? without : withFinal);
}
