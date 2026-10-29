"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, Home, Languages, Link2, Minus, Moon, Pause, Play, Plus, RotateCcw, Sun, Tag, Waypoints } from "lucide-react";
import { useExplorerStore } from "@/store/explorerStore";
import { useDataStore } from "@/store/dataStore";
import { useTourStore } from "@/store/tourStore";
import { usePipelineStore } from "@/store/pipelineStore";
import { currentViewUrl } from "@/store/urlState";
import { ResidueSearch } from "./ResidueSearch";
import { defineText } from "@/i18n/text";
import { useLocale, useText } from "@/i18n/useLocale";

const TEXT = defineText({
  en: {
    shareTitle: "Copy a link to this exact view",
    share: "Share",
    copied: "Copied",
    linkCopied: "Link copied",
    copyLink: "Copy link to this view",
    copiedStatus: "Link copied to the clipboard",
    copyThis: "Copy this link to share the current view:",
    linkField: "Link to this view",
    done: "Done",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    reset: "Reset",
    resetView: "Reset view",
    tour: "Tour",
    stopTour: "Stop tour",
    tourTitle: "Guided tour: zoom through all five levels (T)",
    stopTourTitle: "Stop the guided tour",
    startTour: "Start the guided tour",
    startOver: "Start over",
    startOverTitle: "Start over from the complete protein",
    startOverMake: "Back to stage 1, the gene",
    rotate: "Rotate",
    autoRotate: "Auto-rotate",
    labels: "Labels",
    labelsTitle: "Show / hide labels (L)",
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
    lightTitle: "Light theme (D)",
    darkTitle: "Dark theme (D)",
    modeGroup: "Explanation level",
    modeTitle: "Switch explanation mode (M)",
    modes: { beginner: "Beginner", scientific: "Scientific" },
    other: "한국어",
    otherTitle: "Switch the interface to Korean",
    otherAria: "Switch to Korean",
  },
  ko: {
    shareTitle: "지금 화면이 그대로 열리는 링크 복사",
    share: "공유",
    copied: "복사됨",
    linkCopied: "링크 복사됨",
    copyLink: "이 화면의 링크 복사",
    copiedStatus: "링크를 클립보드에 복사했습니다",
    copyThis: "이 링크를 복사해 현재 화면을 공유하세요:",
    linkField: "이 화면의 링크",
    done: "완료",
    zoomIn: "확대",
    zoomOut: "축소",
    reset: "초기화",
    resetView: "보기 초기화",
    tour: "둘러보기",
    stopTour: "둘러보기 중지",
    tourTitle: "가이드 투어: 다섯 단계를 차례로 확대해 봅니다 (T)",
    stopTourTitle: "가이드 투어 중지",
    startTour: "가이드 투어 시작",
    startOver: "처음부터",
    startOverTitle: "단백질 전체 모습부터 다시 시작",
    startOverMake: "1단계(유전자)로 돌아가기",
    rotate: "회전",
    autoRotate: "자동 회전",
    labels: "라벨",
    labelsTitle: "라벨 보이기 / 숨기기 (L)",
    toLight: "라이트 테마로 전환",
    toDark: "다크 테마로 전환",
    lightTitle: "라이트 테마 (D)",
    darkTitle: "다크 테마 (D)",
    modeGroup: "설명 수준",
    modeTitle: "설명 모드 전환 (M)",
    modes: { beginner: "기초", scientific: "전문" },
    other: "English",
    otherTitle: "인터페이스를 영어로 전환",
    otherAria: "영어로 전환",
  },
});

const btn =
  "inline-flex h-7 min-w-7 items-center justify-center gap-1 rounded-[5px] border border-line bg-surface/95 px-1.5 text-[11.5px] font-medium text-ink shadow-[0_1px_2px_rgba(7,38,90,0.06)] transition-colors hover:border-brand hover:text-brand-ink disabled:opacity-40";

/** Inside another page (an iframe) the address bar is not ours, so a copied link would not open this view. */
const noop = () => () => {};
function useEmbedded() {
  return useSyncExternalStore(
    noop,
    () => {
      try {
        return window.self !== window.top;
      } catch {
        return true;
      }
    },
    () => false,
  );
}

/** Copies a link to the current view; falls back to a selectable field where the clipboard is blocked. */
function ShareButton() {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  const [url, setUrl] = useState("");
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state === "copied") {
      const t = setTimeout(() => setState("idle"), 1800);
      return () => clearTimeout(t);
    }
    if (state === "manual") field.current?.select();
  }, [state]);

  const t = useText(TEXT);
  const share = async () => {
    const link = currentViewUrl(useDataStore.getState().protein, { forSharing: true });
    setUrl(link);
    try {
      await navigator.clipboard.writeText(link);
      setState("copied");
    } catch {
      setState("manual");
    }
  };

  return (
    <div className="relative">
      <button type="button" className={`${btn} px-2`} onClick={share} title={t.shareTitle}>
        {state === "copied" ? <Check className="h-3 w-3" aria-hidden /> : <Link2 className="h-3 w-3" aria-hidden />}
        <span className="hidden sm:inline">{state === "copied" ? t.copied : t.share}</span>
        <span className="sr-only sm:hidden">{state === "copied" ? t.linkCopied : t.copyLink}</span>
      </button>
      <span className="sr-only" role="status">
        {state === "copied" ? t.copiedStatus : ""}
      </span>
      {state === "manual" && (
        <div data-label-block className="fixed inset-x-3 top-[140px] z-40 rounded-lg border border-line bg-surface p-2.5 shadow-[0_8px_28px_rgba(7,38,90,0.18)] sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-1.5 sm:w-[300px]">
          <p className="mb-1.5 text-[11px] text-muted">{t.copyThis}</p>
          <input ref={field} readOnly value={url} onFocus={(e) => e.target.select()} className="w-full rounded border border-line bg-paper px-2 py-1 text-[11.5px] text-ink" aria-label={t.linkField} />
          <button type="button" onClick={() => setState("idle")} className="mt-1.5 text-[11px] font-medium text-brand-ink hover:underline">
            {t.done}
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Top-right controls: find, zoom, reset, tour, rotate, labels, share, theme, language and the explanation mode.
 * In the pipeline ("make") the search and tour are left out and Start over returns to stage 1.
 */
export function ViewControls({ variant = "explore" }: { variant?: "explore" | "make" }) {
  const make = variant === "make";
  const pipelineBusy = usePipelineStore((s) => s.transition !== null);
  const command = useExplorerStore((s) => s.command);
  const autoRotate = useExplorerStore((s) => s.autoRotate);
  const toggleAutoRotate = useExplorerStore((s) => s.toggleAutoRotate);
  const showLabels = useExplorerStore((s) => s.showLabels);
  const toggleLabels = useExplorerStore((s) => s.toggleLabels);
  const mode = useExplorerStore((s) => s.mode);
  const setMode = useExplorerStore((s) => s.setMode);
  const busy = useExplorerStore((s) => s.transition !== null) || pipelineBusy;
  const restart = useExplorerStore((s) => s.restart);
  const theme = useExplorerStore((s) => s.theme);
  const setTheme = useExplorerStore((s) => s.setTheme);
  const touring = useTourStore((s) => s.active);
  const startTour = useTourStore((s) => s.start);
  const stopTour = useTourStore((s) => s.stop);
  const embedded = useEmbedded();
  const locale = useLocale();
  const setLocale = useExplorerStore((s) => s.setLocale);
  const t = TEXT[locale];

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-1">
        {!make && <ResidueSearch />}
        <button type="button" className={btn} onClick={() => command("zoomIn")} disabled={busy} aria-label={t.zoomIn} title={`${t.zoomIn} (+)`}>
          <Plus className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={btn} onClick={() => command("zoomOut")} disabled={busy} aria-label={t.zoomOut} title={`${t.zoomOut} (−)`}>
          <Minus className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={`${btn} px-2`} onClick={() => command("reset")} disabled={busy} title={`${t.resetView} (R)`}>
          <RotateCcw className="h-3 w-3 sm:hidden" aria-hidden />
          <span className="hidden sm:inline">{t.reset}</span>
          <span className="sr-only sm:hidden">{t.resetView}</span>
        </button>
      </div>
      <div className="flex items-center gap-1">
        {!make && (
        <button
          type="button"
          className={`${btn} px-2 ${touring ? "!border-brand !bg-brand !text-white" : ""}`}
          onClick={touring ? stopTour : startTour}
          aria-pressed={touring}
          title={touring ? t.stopTourTitle : t.tourTitle}
        >
          <Waypoints className="h-3 w-3" aria-hidden />
          <span className="hidden sm:inline">{touring ? t.stopTour : t.tour}</span>
          <span className="sr-only sm:hidden">{touring ? t.stopTourTitle : t.startTour}</span>
        </button>
        )}
        <button
          type="button"
          className={`${btn} px-2`}
          onClick={make ? () => usePipelineStore.getState().goTo(0) : restart}
          disabled={busy}
          title={make ? t.startOverMake : t.startOverTitle}
        >
          <Home className="h-3 w-3" />
          <span className="hidden sm:inline">{t.startOver}</span>
          <span className="sr-only sm:hidden">{t.startOver}</span>
        </button>
        <button type="button" className={`${btn} px-2`} onClick={toggleAutoRotate} aria-pressed={autoRotate} title={`${t.autoRotate} (Space)`}>
          {autoRotate ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          <span className="hidden sm:inline">{t.rotate}</span>
          <span className="sr-only sm:hidden">{t.autoRotate}</span>
        </button>
        <button
          type="button"
          className={`${btn} px-2 ${showLabels ? "!border-brand/60 !text-brand-ink" : ""}`}
          onClick={toggleLabels}
          aria-pressed={showLabels}
          title={t.labelsTitle}
        >
          <Tag className="h-3 w-3" />
          <span className="hidden sm:inline">{t.labels}</span>
          <span className="sr-only sm:hidden">{t.labels}</span>
        </button>
      </div>
      <div className="flex items-center gap-1">
        {!embedded && <ShareButton />}
        <button
          type="button"
          className={btn}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? t.toLight : t.toDark}
          title={theme === "dark" ? t.lightTitle : t.darkTitle}
        >
          {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>
        <button
          type="button"
          className={`${btn} px-2`}
          onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
          aria-label={t.otherAria}
          title={t.otherTitle}
        >
          <Languages className="h-3 w-3" aria-hidden />
          <span lang={locale === "ko" ? "en" : "ko"}>{t.other}</span>
        </button>
        <div role="radiogroup" aria-label={t.modeGroup} className="flex rounded-[6px] border border-line bg-surface/95 p-0.5 text-[11px] font-medium shadow-[0_1px_2px_rgba(7,38,90,0.06)]">
          {(["beginner", "scientific"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-[4px] px-2 py-1 transition-colors ${mode === m ? "bg-brand text-white" : "text-muted hover:text-ink"}`}
              title={t.modeTitle}
            >
              {t.modes[m]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
