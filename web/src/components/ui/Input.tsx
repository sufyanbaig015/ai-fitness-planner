import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, className, id, ...props }: Props) {
  const inputId = id ?? props.name;
  return (
    <label className="flex flex-col gap-1.5">
      {label ? (
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          {label}
        </span>
      ) : null}
      <input
        id={inputId}
        className={clsx(
          "rounded-lg border border-canvas-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-coral focus:ring-2 focus:ring-coral/20",
          className,
        )}
        {...props}
      />
    </label>
  );
}
