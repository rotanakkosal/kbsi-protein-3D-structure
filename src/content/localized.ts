import type { Locale } from "@/i18n/text";
import * as en from "./api-en";
import * as ko from "./api-ko";

/**
 * The text-bearing content in each language. The English modules (info, proteins, aminoAcids,
 * levels, tour) are the reference; the Korean ones in ./ko export the same names with the same
 * signatures, which the Content type checks. Structural data (files, residue ranges, colours)
 * stays in the English modules and is shared.
 */
export type Content = typeof en;
export const CONTENT: Record<Locale, Content> = { en, ko };
