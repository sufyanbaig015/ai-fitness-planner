"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DietPanel } from "@/components/planner/DietPanel";
import { FitnessPanel } from "@/components/planner/FitnessPanel";
import { PlannerTabs } from "@/components/planner/PlannerTabs";
import { ProfileForm } from "@/components/planner/ProfileForm";
import { QAPanel } from "@/components/planner/QAPanel";
import { StatsRow } from "@/components/planner/StatsRow";
import { GeneratingOverlay } from "@/components/ui/Skeleton";
import { SettingsModal } from "@/components/ui/SettingsModal";
import { useToast } from "@/components/ui/Toast";
import { askAboutPlan, generatePlans } from "@/lib/api";
import { DEFAULT_PROFILE } from "@/lib/constants";
import { loadPlanner, savePlanner } from "@/lib/storage";
import type {
  DietaryPlan,
  FitnessPlan,
  PlannerTab,
  PlanStatus,
  QAPair,
  UserProfile,
} from "@/lib/types";

function formatAgo(ts: number | null) {
  if (!ts) return "just now";
  const sec = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  return `${min}m ago`;
}

export function PlannerWorkspace() {
  const { push } = useToast();
  const [hydrated, setHydrated] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [dietaryPlan, setDietaryPlan] = useState<DietaryPlan | null>(null);
  const [fitnessPlan, setFitnessPlan] = useState<FitnessPlan | null>(null);
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const [tab, setTab] = useState<PlannerTab>("profile");
  const [status, setStatus] = useState<PlanStatus>("draft");
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState<"dietary" | "fitness" | "done" | null>(
    null,
  );
  const [asking, setAsking] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeWeek, setActiveWeek] = useState(1);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [savedLabel, setSavedLabel] = useState("just now");

  useEffect(() => {
    const saved = loadPlanner();
    if (saved) {
      if (saved.apiKey) setApiKey(saved.apiKey);
      if (saved.profile) setProfile(saved.profile);
      if (saved.dietaryPlan) setDietaryPlan(saved.dietaryPlan);
      if (saved.fitnessPlan) {
        setFitnessPlan(saved.fitnessPlan);
        setActiveWeek(saved.fitnessPlan.weeks?.[0]?.week ?? 1);
      }
      if (saved.qaPairs) setQaPairs(saved.qaPairs);
      if (saved.status) setStatus(saved.status);
      if (saved.dietaryPlan && saved.fitnessPlan) setTab("fitness");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    savePlanner({
      apiKey,
      profile,
      dietaryPlan,
      fitnessPlan,
      qaPairs,
      status,
    });
    setSavedAt(Date.now());
  }, [hydrated, apiKey, profile, dietaryPlan, fitnessPlan, qaPairs, status]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSavedLabel(formatAgo(savedAt));
    }, 1000);
    return () => window.clearInterval(id);
  }, [savedAt]);

  const hasPlans = Boolean(dietaryPlan && fitnessPlan);
  const canGenerate = apiKey.trim().length > 10 && !generating;

  const exerciseCount = useMemo(() => {
    if (!fitnessPlan?.weeks) return 0;
    return fitnessPlan.weeks.reduce(
      (sum, week) =>
        sum +
        week.days.reduce(
          (dSum, day) => dSum + (day.is_rest ? 0 : day.exercises.length),
          0,
        ),
      0,
    );
  }, [fitnessPlan]);

  const stats = useMemo(() => {
    if (!fitnessPlan) {
      return [
        { label: "Exercises", value: "—" },
        { label: "Weeks", value: "—" },
        { label: "Avg Session", value: "—" },
        { label: "Status", value: "Awaiting Generate" },
      ];
    }
    return [
      { label: "Exercises", value: String(exerciseCount) },
      {
        label: "Weeks",
        value: String(fitnessPlan.weeks?.length || 0),
      },
      {
        label: "Avg Session",
        value: fitnessPlan.avg_session_min
          ? `~${fitnessPlan.avg_session_min} min`
          : "—",
      },
      {
        label: "Clients Using",
        value: status === "published" ? "1" : "0",
      },
    ];
  }, [fitnessPlan, exerciseCount, status]);

  const tags = useMemo(() => {
    const list = [
      status === "published" ? "PUBLISHED" : "DRAFT",
      profile.dietary_preferences.toUpperCase(),
      ...(fitnessPlan?.tags ?? [profile.fitness_goals.toUpperCase()]),
    ];
    if (fitnessPlan?.sessions_per_week) {
      list.push(`${fitnessPlan.sessions_per_week}X / WEEK`);
    }
    return Array.from(new Set(list)).slice(0, 6);
  }, [status, profile, fitnessPlan]);

  const handleGenerate = async () => {
    if (!apiKey.trim()) {
      setSettingsOpen(true);
      push("error", "Add your OpenAI API key in Settings first.");
      return;
    }
    setGenerating(true);
    setGenStep("dietary");
    const stepTimer = window.setTimeout(() => setGenStep("fitness"), 1800);
    try {
      const result = await generatePlans(profile, apiKey.trim());
      setDietaryPlan({
        ...result.dietary_plan,
        meals: result.dietary_plan.meals ?? [],
        macros: result.dietary_plan.macros ?? "",
      });
      setFitnessPlan({
        ...result.fitness_plan,
        weeks: result.fitness_plan.weeks ?? [],
        tags: result.fitness_plan.tags ?? [],
        program_name: result.fitness_plan.program_name ?? "Personalized Program",
      });
      setQaPairs([]);
      setStatus("draft");
      setActiveWeek(result.fitness_plan.weeks?.[0]?.week ?? 1);
      setSelectedExercise(null);
      setTab("fitness");
      setGenStep("done");
      push("success", "Personalized plan generated.");
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Failed to generate plans");
    } finally {
      window.clearTimeout(stepTimer);
      setGenerating(false);
      setGenStep(null);
    }
  };

  const handleAsk = async (question: string) => {
    if (!dietaryPlan || !fitnessPlan) return;
    setAsking(true);
    try {
      const answer = await askAboutPlan({
        apiKey: apiKey.trim(),
        question,
        mealPlan: dietaryPlan.meal_plan,
        fitnessRoutine: fitnessPlan.routine,
      });
      setQaPairs((prev) => [...prev, { question, answer }]);
      push("success", "Answer ready.");
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Failed to get answer");
    } finally {
      setAsking(false);
    }
  };

  const handleSaveDraft = () => {
    setStatus("draft");
    push("success", "Draft saved locally.");
  };

  const handlePublish = () => {
    setStatus("published");
    push("success", "Plan published.");
  };

  const title =
    fitnessPlan?.program_name?.toUpperCase() || "AI HEALTH PLANNER";

  return (
    <>
      <AppShell
        onGenerate={() => void handleGenerate()}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onOpenSettings={() => setSettingsOpen(true)}
        generating={generating}
        canGenerate={canGenerate}
        hasPlans={hasPlans}
        status={status}
        savedAgo={savedLabel}
      >
        <div className="mx-auto flex max-w-[1180px] flex-col gap-5 animate-[fadeIn_0.25s_ease]">
          <section className="rounded-2xl border border-canvas-line bg-white/80 p-5 shadow-card backdrop-blur-sm md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-coral">
                  Program Builder
                </p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink md:text-3xl lg:text-4xl">
                  {title}
                  {fitnessPlan?.weeks?.length
                    ? ` — ${fitnessPlan.weeks.length} WEEK PROGRAM`
                    : ""}
                </h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        tag === "DRAFT"
                          ? "bg-orange-100 text-orange-700"
                          : tag === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "border border-canvas-line bg-canvas text-ink-muted"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
                  {fitnessPlan?.goals ||
                    "Personalized diet and workout plans in a coaching workspace."}
                </p>
              </div>
              {!hasPlans ? (
                <div className="shrink-0 rounded-xl border border-dashed border-coral/30 bg-coral-soft px-4 py-3 text-sm text-ink-soft lg:max-w-[240px]">
                  <p className="font-semibold text-ink">Ready to build?</p>
                  <p className="mt-1 text-xs text-ink-muted">
                    Set your profile, add an API key in Settings, then generate.
                  </p>
                </div>
              ) : null}
            </div>
            <div className="mt-5">
              <StatsRow stats={stats} />
            </div>
          </section>

          <PlannerTabs active={tab} onChange={setTab} hasPlans={hasPlans} />

          <div
            key={tab}
            className="animate-[fadeIn_0.2s_ease]"
          >
            {tab === "profile" ? (
              <ProfileForm profile={profile} onChange={setProfile} />
            ) : null}
            {tab === "diet" ? <DietPanel plan={dietaryPlan} /> : null}
            {tab === "fitness" ? (
              <FitnessPanel
                plan={fitnessPlan}
                activeWeek={activeWeek}
                onWeekChange={setActiveWeek}
                selectedKey={selectedExercise}
                onSelect={setSelectedExercise}
              />
            ) : null}
            {tab === "qa" ? (
              <QAPanel
                enabled={hasPlans}
                loading={asking}
                pairs={qaPairs}
                onAsk={handleAsk}
              />
            ) : null}
          </div>
        </div>
      </AppShell>

      <SettingsModal
        open={settingsOpen}
        apiKey={apiKey}
        onChange={setApiKey}
        onClose={() => setSettingsOpen(false)}
      />
      <GeneratingOverlay step={genStep} />
    </>
  );
}
