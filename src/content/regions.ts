import type { Locale } from "@/i18n/text";
import type { Region, RegionKind } from "@/lib/structure/protein";

const KO: Record<RegionKind, string> = { helix: "α-나선", helix310: "3₁₀-나선", strand: "β-가닥", loop: "루프", turn: "턴", nterm: "N-말단", tail: "C-말단 꼬리" };

/**
 * A region's label in the interface language, e.g. "α-helix 2 · Ser39–Tyr40" or "α-나선 2 · Ser39–Tyr40".
 * The structure code builds the English label; other languages keep its numbering and residue range.
 */
export function regionLabel(region: Region, locale: Locale): string {
  if (locale === "en") return region.label;
  const [name, range] = region.label.split(" · ");
  const ordinal = /(\d+)$/.exec(name)?.[1];
  return `${KO[region.kind]}${ordinal ? ` ${ordinal}` : ""} · ${range}`;
}
