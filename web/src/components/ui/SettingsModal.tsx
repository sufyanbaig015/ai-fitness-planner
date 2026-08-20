"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ExternalLink, X } from "lucide-react";

type Props = {
  open: boolean;
  apiKey: string;
  onChange: (value: string) => void;
  onClose: () => void;
};

export function SettingsModal({ open, apiKey, onChange, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        aria-label="Close settings"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-canvas-line bg-white p-6 shadow-card">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-ink">Settings</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Your OpenAI key is stored only in this browser.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-faint hover:bg-canvas hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <Input
          label="OpenAI API Key"
          type="password"
          value={apiKey}
          onChange={(e) => onChange(e.target.value)}
          placeholder="sk-..."
          autoComplete="off"
        />

        <a
          href="https://platform.openai.com/api-keys"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-coral hover:text-coral-dark"
        >
          Get an API key
          <ExternalLink className="h-3.5 w-3.5" />
        </a>

        <div className="mt-5 flex justify-end">
          <Button type="button" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
