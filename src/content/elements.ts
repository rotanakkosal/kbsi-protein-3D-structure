import { ELEMENTS, type ElementSymbol } from "@/lib/chem/elements";
import { defineText } from "@/i18n/text";

const byElement = (pick: (e: (typeof ELEMENTS)[ElementSymbol]) => string) =>
  Object.fromEntries(Object.values(ELEMENTS).map((e) => [e.symbol, pick(e)])) as Record<ElementSymbol, string>;

/** Element and isotope names shown in the interface (the chemistry data lives in lib/chem/elements). */
export const ELEMENT_TEXT = defineText({
  en: { name: byElement((e) => e.name), isotope: byElement((e) => e.isotopeName) },
  ko: {
    name: { H: "수소", C: "탄소", N: "질소", O: "산소", S: "황" },
    isotope: { H: "수소-1", C: "탄소-12", N: "질소-14", O: "산소-16", S: "황-32" },
  },
});
