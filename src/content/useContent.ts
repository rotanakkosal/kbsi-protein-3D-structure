"use client";

import { useLocale } from "@/i18n/useLocale";
import { CONTENT, type Content } from "./localized";

/** The content (panel text, names, hover text, tour) in the current language. */
export const useContent = (): Content => CONTENT[useLocale()];
