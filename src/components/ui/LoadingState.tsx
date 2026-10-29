"use client";

import type { ReactNode } from "react";
import { defineText } from "@/i18n/text";
import { useText } from "@/i18n/useLocale";

const TEXT = defineText({
  en: { loading: "Loading structure…", failed: "The protein structure could not be loaded", retry: "Try again", back: "Back to Ubiquitin" },
  ko: { loading: "구조를 불러오는 중…", failed: "단백질 구조를 불러오지 못했습니다", retry: "다시 시도", back: "유비퀴틴으로 돌아가기" },
});

/** Shown while the PDB structure is fetched and the 3D models are prepared. */
export function LoadingState({
  label,
  error,
  onRetry,
  onBack,
  backLabel,
}: {
  /** Rendered on the server too, so the shell passes both languages (see Both) */
  label?: ReactNode;
  error?: string | null;
  onRetry?: () => void;
  onBack?: () => void;
  backLabel?: string;
}) {
  const t = useText(TEXT);
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        {error ? (
          <>
            <p className="font-display text-xl font-bold text-brand-ink">{t.failed}</p>
            <p className="max-w-sm text-[13px] text-muted">{error}</p>
            <div className="flex gap-2">
              {onRetry && (
                <button type="button" onClick={onRetry} className="rounded-full bg-brand px-4 py-1.5 text-[13px] font-medium text-white hover:bg-brand-dark">
                  {t.retry}
                </button>
              )}
              {onBack && (
                <button type="button" onClick={onBack} className="rounded-full border border-line bg-surface px-4 py-1.5 text-[13px] font-medium text-brand-ink hover:border-brand">
                  {backLabel ?? t.back}
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <span className="spin-slow block h-7 w-7 rounded-full border-2 border-brand/25 border-t-brand" aria-hidden />
            <p className="text-[13px] text-muted" role="status">
              {label ?? t.loading}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
