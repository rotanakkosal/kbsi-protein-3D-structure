"use client";

import dynamic from "next/dynamic";
import { FrameChrome } from "./ui/FrameChrome";
import { LoadingState } from "./ui/LoadingState";
import { Both } from "@/i18n/Both";

// WebGL needs the browser, so the interactive explorer is client-only.
const Explorer = dynamic(() => import("./Explorer"), {
  ssr: false,
  loading: () => <LoadingState label={<Both en="Loading the explorer…" ko="탐색기를 불러오는 중…" />} />,
});

export default function ExplorerShell() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-paper text-ink select-none">
      <Explorer />
      <FrameChrome />
    </main>
  );
}
