"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { getResidueMolecule, useDataStore } from "@/store/dataStore";
import { useExplorerStore, type ParticleKind } from "@/store/explorerStore";
import { useShallow } from "zustand/react/shallow";
import { aaLabel } from "@/lib/structure/protein";
import { PROTEINS } from "@/content/proteins";
import { ELEMENT_TEXT } from "@/content/elements";
import { useContent } from "@/content/useContent";
import { defineText } from "@/i18n/text";
import { useLocale, useText } from "@/i18n/useLocale";
import { josa } from "@/i18n/ko";

const TEXT = defineText({
  en: {
    hotspots: "Cancer hotspots",
    hotspotsShort: "Hotspots",
    colourScheme: "Colour scheme",
    byStructure: "Colour by structure",
    byStructureShort: "Structure",
    byOrder: "Colour by chain order",
    byOrderShort: "N→C order",
    chainLayout: "Chain layout",
    folded: "Folded",
    unfold: "Unfold chain",
    unfoldShort: "Unfold",
    form: "Amino-acid form",
    inProtein: "In the protein",
    inProteinShort: "In chain",
    free: "Free amino acid",
    freeShort: "Free",
    atomModel: "Atom model",
    orbits: "Orbit model (simplified)",
    orbitsShort: "Orbits",
    cloud: "Electron cloud",
    cloudShort: "Cloud",
    quarks: "Quarks inside",
    quarksShort: "Quarks",
    field: "Charge field",
    fieldShort: "Field",
    backTo: (level: string) => `Back to ${level.toLowerCase()}`,
    previousLevel: "Previous level",
    back: "Back",
    previousTitle: "Previous level (←)",
    intoChain: "Zoom into the chain",
    intoResidue: (residue: string) => `Zoom into ${residue}`,
    intoAtom: (atom: string) => `Zoom into the ${atom} atom`,
    intoParticle: (particle: ParticleKind) => `Zoom into a ${particle}`,
    deepest: "Deepest level reached",
    zoomIn: "Zoom in",
    end: "End",
    nextTitle: "Next level (→)",
  },
  ko: {
    hotspots: "암 핫스팟",
    hotspotsShort: "핫스팟",
    colourScheme: "색 구성",
    byStructure: "구조별 색상",
    byStructureShort: "구조",
    byOrder: "사슬 순서별 색상",
    byOrderShort: "N→C 순서",
    chainLayout: "사슬 배치",
    folded: "접힌 상태",
    unfold: "사슬 펼치기",
    unfoldShort: "펼치기",
    form: "아미노산 형태",
    inProtein: "단백질 속 잔기",
    inProteinShort: "사슬 속",
    free: "자유 아미노산",
    freeShort: "자유형",
    atomModel: "원자 모형",
    orbits: "궤도 모형(단순화)",
    orbitsShort: "궤도",
    cloud: "전자 구름",
    cloudShort: "구름",
    quarks: "내부의 쿼크",
    quarksShort: "쿼크",
    field: "전기장",
    fieldShort: "전기장",
    backTo: (level) => `${josa(level, "으로/로")} 돌아가기`,
    previousLevel: "이전 단계",
    back: "뒤로",
    previousTitle: "이전 단계 (←)",
    intoChain: "사슬로 확대",
    intoResidue: (residue) => `${josa(residue, "으로/로")} 확대`,
    intoAtom: (atom) => `${atom} 원자로 확대`,
    intoParticle: (particle) => `${{ proton: "양성자로", neutron: "중성자로", electron: "전자로" }[particle]} 확대`,
    deepest: "가장 깊은 단계에 도달",
    zoomIn: "확대",
    end: "끝",
    nextTitle: "다음 단계 (→)",
  },
});

export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { v: T; l: string; s?: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-full border border-line bg-surface/95 p-0.5 text-[11.5px] font-medium shadow-[0_1px_3px_rgba(7,38,90,0.08)]">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          role="radio"
          aria-checked={value === o.v}
          onClick={() => onChange(o.v)}
          className={`rounded-full px-2.5 py-1 whitespace-nowrap transition-colors sm:px-3 ${value === o.v ? "bg-brand text-white" : "text-muted hover:text-ink"}`}
        >
          <span className={o.s ? "hidden sm:inline" : undefined}>{o.l}</span>
          {o.s && <span className="sm:hidden">{o.s}</span>}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ on, onChange, children }: { on: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onChange(!on)}
      className={`rounded-full border px-3 py-1 text-[11.5px] font-medium whitespace-nowrap shadow-[0_1px_3px_rgba(7,38,90,0.08)] transition-colors ${
        on ? "border-brand bg-brand text-white" : "border-line bg-surface/95 text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

/** Level-specific view options (fold/unfold, residue/free, orbits/cloud, quarks, field). */
export function ContextControls() {
  const s = useExplorerStore(
    useShallow((st) => ({
      level: st.transition ? null : st.level,
      colorScheme: st.colorScheme,
      setColorScheme: st.setColorScheme,
      chainUnfolded: st.chainUnfolded,
      setChainUnfolded: st.setChainUnfolded,
      aminoAcidForm: st.aminoAcidForm,
      setAminoAcidForm: st.setAminoAcidForm,
      atomView: st.atomView,
      setAtomView: st.setAtomView,
      showQuarks: st.showQuarks,
      setShowQuarks: st.setShowQuarks,
      showField: st.showField,
      setShowField: st.setShowField,
      showHotspots: st.showHotspots,
      setShowHotspots: st.setShowHotspots,
      proteinId: st.selection.proteinId,
    })),
  );
  const level = s.level;
  const t = useText(TEXT);
  const hotspots = PROTEINS[s.proteinId].hotspots?.length ? (
    <Toggle on={s.showHotspots} onChange={s.setShowHotspots}>
      <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-hotspot ring-1 ring-white/70" aria-hidden />
      <span className="hidden sm:inline">{t.hotspots}</span>
      <span className="sm:hidden">{t.hotspotsShort}</span>
    </Toggle>
  ) : null;
  if (level === 0)
    return (
      <div className="flex gap-1.5">
        <Segmented
          label={t.colourScheme}
          value={s.colorScheme}
          onChange={s.setColorScheme}
          options={[
            { v: "structure", l: t.byStructure, s: t.byStructureShort },
            { v: "rainbow", l: t.byOrder, s: t.byOrderShort },
          ]}
        />
        {hotspots}
      </div>
    );
  if (level === 1)
    return (
      <div className="flex gap-1.5">
        <Segmented
          label={t.chainLayout}
          value={s.chainUnfolded ? "unfolded" : "folded"}
          onChange={(v) => s.setChainUnfolded(v === "unfolded")}
          options={[
            { v: "folded", l: t.folded },
            { v: "unfolded", l: t.unfold, s: t.unfoldShort },
          ]}
        />
        {hotspots}
      </div>
    );
  if (level === 2)
    return (
      <Segmented
        label={t.form}
        value={s.aminoAcidForm}
        onChange={s.setAminoAcidForm}
        options={[
          { v: "residue", l: t.inProtein, s: t.inProteinShort },
          { v: "free", l: t.free, s: t.freeShort },
        ]}
      />
    );
  if (level === 3)
    return (
      <Segmented
        label={t.atomModel}
        value={s.atomView}
        onChange={s.setAtomView}
        options={[
          { v: "orbits", l: t.orbits, s: t.orbitsShort },
          { v: "cloud", l: t.cloud, s: t.cloudShort },
        ]}
      />
    );
  if (level === 4)
    return (
      <div className="flex gap-1.5">
        <Toggle on={s.showQuarks} onChange={s.setShowQuarks}>
          <span className="hidden sm:inline">{t.quarks}</span>
          <span className="sm:hidden">{t.quarksShort}</span>
        </Toggle>
        <Toggle on={s.showField} onChange={s.setShowField}>
          <span className="hidden sm:inline">{t.field}</span>
          <span className="sm:hidden">{t.fieldShort}</span>
        </Toggle>
      </div>
    );
  return null;
}

export const stepBase =
  "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[12px] font-medium whitespace-nowrap shadow-[0_1px_3px_rgba(7,38,90,0.08)] transition-colors disabled:opacity-35";

/** "Back to …": returns to the parent level. */
export function PrevButton() {
  const level = useExplorerStore((s) => s.level);
  const busy = useExplorerStore((s) => s.transition !== null);
  const previous = useExplorerStore((s) => s.previous);
  const t = useText(TEXT);
  const { LEVELS } = useContent();
  const label = level > 0 ? t.backTo(LEVELS[level - 1].name) : null;
  return (
    <button type="button" onClick={previous} disabled={!label || busy} className={`${stepBase} border-line bg-surface/95 text-ink hover:border-brand hover:text-brand-ink`} title={t.previousTitle}>
      <ChevronLeft className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{label ?? t.previousLevel}</span>
      <span className="sm:hidden">{t.back}</span>
    </button>
  );
}

/** "Zoom into …": descends into the currently selected component. */
export function NextButton() {
  const protein = useDataStore((s) => s.protein);
  const level = useExplorerStore((s) => s.level);
  const busy = useExplorerStore((s) => s.transition !== null);
  const selection = useExplorerStore((s) => s.selection);
  const next = useExplorerStore((s) => s.next);
  const locale = useLocale();
  const t = TEXT[locale];
  if (!protein) return null;
  const m = getResidueMolecule(protein, selection.residueIndex);
  const atom = m.atomById[selection.atomId];
  const label = [
    t.intoChain,
    t.intoResidue(aaLabel(protein.residues[selection.residueIndex])),
    t.intoAtom(atom ? atom.display : ELEMENT_TEXT[locale].name[selection.atomElement]),
    t.intoParticle(selection.particle),
    null,
  ][level];
  return (
    <button type="button" onClick={next} disabled={!label || busy} className={`${stepBase} border-brand bg-brand text-white hover:bg-brand-dark`} title={t.nextTitle}>
      <span className="hidden sm:inline">{label ?? t.deepest}</span>
      <span className="sm:hidden">{label ? t.zoomIn : t.end}</span>
      <ChevronRight className="h-3.5 w-3.5" />
    </button>
  );
}
