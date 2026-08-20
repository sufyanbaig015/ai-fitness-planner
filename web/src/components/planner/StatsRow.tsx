type Stat = {
  label: string;
  value: string;
};

type Props = {
  stats: Stat[];
};

export function StatsRow({ stats }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-2xl border border-canvas-line bg-white px-4 py-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-md"
          style={{ animationDelay: `${index * 40}ms` }}
        >
          <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-coral/5 transition group-hover:bg-coral/10" />
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">
            {stat.label}
          </p>
          <p className="mt-1.5 text-xl font-extrabold tracking-tight text-ink">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
