"use client";

import { useExplorerStore } from "@/store/explorerStore";
import type { Locale } from "./text";

export const useLocale = (): Locale => useExplorerStore((s) => s.locale);

/** The current locale's strings from a defineText table. */
export function useText<T>(text: Record<Locale, T>): T {
  return text[useLocale()];
}

/** For code outside React (event handlers, frame loops). */
export const currentLocale = (): Locale => useExplorerStore.getState().locale;
