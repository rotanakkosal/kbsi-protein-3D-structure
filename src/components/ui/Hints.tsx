"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Hand, Waypoints, X } from "lucide-react";
import { useExplorerStore, type Level } from "@/store/explorerStore";
import { useTourStore } from "@/store/tourStore";
import { defineText } from "@/i18n/text";
import { useText } from "@/i18n/useLocale";

const TEXT = defineText({
  en: {
    hints: {
      0: "Drag to rotate · scroll to zoom · click any coloured part of the protein to zoom in",
      1: "Each bead is one amino acid. Click a bead (or a letter in the sequence) to look inside it",
      2: "Click a carbon atom (grey) to zoom into it · try “Free amino acid” below",
      3: "Click a proton, neutron or electron to see what it is",
      4: "Click a particle to compare it · toggle quarks and the charge field below",
    } as Record<Level, string>,
    tour: "Take the tour",
    dismiss: "Dismiss hint",
  },
  ko: {
    hints: {
      0: "드래그하면 회전 · 스크롤하면 확대/축소 · 단백질의 색칠된 부분을 클릭하면 그곳으로 확대됩니다",
      1: "구슬 하나가 아미노산 하나입니다. 구슬(또는 서열의 글자)을 클릭하면 그 안을 볼 수 있습니다",
      2: "탄소 원자(회색)를 클릭하면 확대됩니다 · 아래의 “자유 아미노산”도 눌러 보세요",
      3: "양성자, 중성자, 전자를 클릭하면 각각 무엇인지 볼 수 있습니다",
      4: "입자를 클릭해 서로 비교해 보세요 · 아래에서 “내부의 쿼크”와 “전기장”을 켜고 끌 수 있습니다",
    },
    tour: "둘러보기 시작",
    dismiss: "힌트 닫기",
  },
});

/** Subtle first-time hints, one per level, dismissed on interaction or after a few seconds. */
export function Hints() {
  const level = useExplorerStore((s) => s.level);
  const busy = useExplorerStore((s) => s.transition !== null);
  const touring = useTourStore((s) => s.active);
  const startTour = useTourStore((s) => s.start);
  const t = useText(TEXT);
  const [seen, setSeen] = useState<Set<Level>>(() => new Set());
  const [visible, setVisible] = useState<Level | null>(null);

  useEffect(() => {
    if (busy || touring || seen.has(level)) return;
    const show = setTimeout(() => setVisible(level), 500);
    const hide = setTimeout(() => {
      setVisible((v) => (v === level ? null : v));
      setSeen((s) => new Set(s).add(level));
    }, 9500);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [level, busy, touring, seen]);

  const dismiss = () => {
    setVisible(null);
    setSeen((s) => new Set(s).add(level));
  };

  return (
    <AnimatePresence>
      {!busy && !touring && visible !== null && visible === level && (
        <motion.div
          key={visible}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.3 }}
          data-label-block
          className="pointer-events-auto flex max-w-[min(640px,calc(100vw-2rem))] items-center gap-2 rounded-[18px] border border-line bg-surface/95 py-1.5 pr-1.5 pl-3 text-[12px] text-ink shadow-[0_2px_10px_rgba(7,38,90,0.1)]"
          role="status"
        >
          <Hand className="h-3.5 w-3.5 shrink-0 text-brand-ink" aria-hidden />
          <span>{t.hints[visible]}</span>
          {visible === 0 && (
            <button
              type="button"
              onClick={() => {
                dismiss();
                startTour();
              }}
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[11.5px] font-medium whitespace-nowrap text-white hover:bg-brand-dark"
            >
              <Waypoints className="h-3 w-3" aria-hidden />
              {t.tour}
            </button>
          )}
          <button type="button" onClick={dismiss} className="rounded-full p-1 text-muted hover:bg-paper hover:text-ink" aria-label={t.dismiss}>
            <X className="h-3 w-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
