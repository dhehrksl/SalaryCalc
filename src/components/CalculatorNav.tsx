import Link from "next/link";

const CALCULATORS = [
  {
    href: "/",
    title: "연봉 실수령액",
    desc: "4대보험·소득세 빼고 월/연 실수령",
    icon: "💰",
  },
  {
    href: "/retirement",
    title: "퇴직금",
    desc: "평균임금·재직기간으로 법정 퇴직금",
    icon: "🏖",
  },
  {
    href: "/annual-leave",
    title: "연차/연차수당",
    desc: "발생 일수와 미사용 수당",
    icon: "📅",
  },
  {
    href: "/hourly",
    title: "시급/주급/월급",
    desc: "시급↔월급↔연봉 양방향 변환",
    icon: "⏱",
  },
  {
    href: "/year-end-tax",
    title: "연말정산 환급",
    desc: "공제 항목 입력으로 환급액 추정",
    icon: "🧾",
  },
] as const;

export default function CalculatorNav({ currentHref }: { currentHref: string }) {
  return (
    <nav aria-label="다른 계산기" className="my-8">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">다른 계산기 둘러보기</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {CALCULATORS.map((c) => {
          const isCurrent = c.href === currentHref;
          if (isCurrent) {
            return (
              <div
                key={c.href}
                aria-current="page"
                className="rounded-xl border-2 border-brand bg-brand-light/40 p-4 text-left"
              >
                <div className="text-2xl">{c.icon}</div>
                <div className="mt-2 text-sm font-bold text-brand">{c.title}</div>
                <div className="mt-0.5 text-xs text-slate-600">현재 페이지</div>
              </div>
            );
          }
          return (
            <Link
              key={c.href}
              href={c.href}
              className="group block rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-brand hover:shadow-md"
            >
              <div className="text-2xl">{c.icon}</div>
              <div className="mt-2 text-sm font-bold text-slate-800 group-hover:text-brand">
                {c.title}
              </div>
              <div className="mt-0.5 text-xs text-slate-500">{c.desc}</div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
