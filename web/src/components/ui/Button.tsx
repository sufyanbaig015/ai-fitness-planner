import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "dark";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-coral text-white hover:bg-coral-dark shadow-sm border border-transparent",
  secondary:
    "bg-white text-ink border border-canvas-line hover:bg-canvas",
  ghost: "bg-transparent text-ink-muted hover:bg-canvas border border-transparent",
  dark: "bg-ink text-white hover:bg-ink-soft border border-transparent",
};

export function Button({
  className,
  variant = "primary",
  loading,
  disabled,
  children,
  ...props
}: Props) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Working…" : children}
    </button>
  );
}
