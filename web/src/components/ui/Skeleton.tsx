export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gradient-to-r from-canvas-line/80 via-canvas to-canvas-line/80 ${className}`}
    />
  );
}

export function GeneratingOverlay({
  step,
}: {
  step: "dietary" | "fitness" | "done" | null;
}) {
  if (!step || step === "done") return null;

  const label =
    step === "dietary"
      ? "Dietary agent is building your meal plan…"
      : "Fitness agent is building your program…";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/30 backdrop-blur-[1px]">
      <div className="w-[min(420px,calc(100vw-2rem))] rounded-2xl border border-canvas-line bg-white p-6 shadow-card">
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-canvas">
          <div
            className={`h-full rounded-full bg-coral transition-all duration-500 ${
              step === "dietary" ? "w-1/2" : "w-[90%]"
            }`}
          />
        </div>
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="mt-1 text-xs text-ink-muted">
          This usually takes a few seconds.
        </p>
        <div className="mt-4 space-y-2">
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-5/6" />
          <SkeletonBlock className="h-10 w-4/5" />
        </div>
      </div>
    </div>
  );
}
