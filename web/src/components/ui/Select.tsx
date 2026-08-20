import { clsx } from "clsx";
import type { SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: readonly string[];
};

export function Select({ label, options, className, id, ...props }: Props) {
  const selectId = id ?? props.name;
  return (
    <label className="flex flex-col gap-1.5">
      {label ? (
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          {label}
        </span>
      ) : null}
      <select
        id={selectId}
        className={clsx(
          "rounded-lg border border-canvas-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/20",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
