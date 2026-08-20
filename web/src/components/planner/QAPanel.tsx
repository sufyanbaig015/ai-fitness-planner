"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { QAPair } from "@/lib/types";
import { MessageCircle } from "lucide-react";

type Props = {
  enabled: boolean;
  loading: boolean;
  pairs: QAPair[];
  onAsk: (question: string) => Promise<void>;
};

export function QAPanel({ enabled, loading, pairs, onAsk }: Props) {
  const [question, setQuestion] = useState("");

  const submit = async () => {
    const trimmed = question.trim();
    if (!trimmed) return;
    await onAsk(trimmed);
    setQuestion("");
  };

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-coral" />
        <div>
          <h2 className="text-lg font-bold text-ink">Questions about your plan?</h2>
          <p className="text-sm text-ink-muted">
            Ask follow-ups once diet and fitness plans are generated.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Your question"
            placeholder="Can I swap chicken for tofu?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={!enabled || loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void submit();
              }
            }}
          />
        </div>
        <Button
          type="button"
          onClick={() => void submit()}
          disabled={!enabled || !question.trim()}
          loading={loading}
        >
          Get Answer
        </Button>
      </div>

      {!enabled ? (
        <p className="mt-4 text-sm text-ink-muted">
          Generate a plan first to unlock Q&amp;A.
        </p>
      ) : null}

      {pairs.length > 0 ? (
        <div className="mt-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink-faint">
            Q&amp;A History
          </h3>
          {pairs.map((pair, index) => (
            <div
              key={`${index}-${pair.question}`}
              className="rounded-xl border border-canvas-line bg-canvas p-4"
            >
              <p className="text-sm font-semibold text-ink">Q: {pair.question}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
                A: {pair.answer}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
