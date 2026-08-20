import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  padding?: boolean;
};

export function Card({ children, className, padding = true, ...props }: Props) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-canvas-line bg-canvas-card shadow-card",
        padding && "p-5 md:p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
