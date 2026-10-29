/**
 * The interface speaks English and Korean. Strings live next to the code that shows them, as one
 * object per locale; defineText makes TypeScript check that the Korean set has exactly the keys
 * (and function signatures) of the English one, so a missing translation is a type error.
 */

export type Locale = "en" | "ko";
export const LOCALES: Locale[] = ["en", "ko"];
export const LOCALE_KEY = "protein-to-particle:lang";
export const isLocale = (v: unknown): v is Locale => v === "en" || v === "ko";

export function defineText<T>(text: { en: T; ko: NoInfer<T> }): Record<Locale, T> {
  return text;
}
