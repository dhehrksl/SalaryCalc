import Link from "next/link";

const CALCULATORS = [
  { href: "/", title: "연봉 실수령액", icon: "💰" },
  { href: "/retirement", title: "퇴직금", icon: "🏖" },
  { href: "/annual-leave", title: "연차/연차수당", icon: "📅" },
  { href: "/hourly", title: "시급/주급/월급", icon: "⏱" },
  { href: "/year-end-tax", title: "연말정산 환급", icon: "🧾" },
  { href: "/apt-score", title: "청약 가점", icon: "🏠" },
] as const;

export default function CalculatorNav({ currentHref }: { currentHref: string }) {
  return (
    <nav aria-label="다른 계산기" className="mb-6">
      <div className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        <span>다른 계산기 둘러보기</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [scrollbar-width:thin]">
        {CALCULATORS.map((c) => {
          const isCurrent = c.href === currentHref;
          const base =
            "flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition";
          if (isCurrent) {
            return (
              <span
                key={c.href}
                aria-current="page"
                className={`${base} bg-brand text-white shadow-sm shadow-brand/20`}
              >
                <span aria-hidden>{c.icon}</span>
                <span>{c.title}</span>
              </span>
            );
          }
          return (
            <Link
              key={c.href}
              href={c.href}
              className={`${base} bg-white text-slate-600 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:bg-brand-light/60 hover:text-brand hover:ring-brand/40`}
            >
              <span aria-hidden>{c.icon}</span>
              <span>{c.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
