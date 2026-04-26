export default function HowItWorks() {
  const steps = [
    {
      n: 1,
      title: "총급여에서 비과세 제외",
      desc: "식대 등 비과세 항목(월 20만원 한도)을 빼면 과세 대상 총급여가 나옵니다.",
    },
    {
      n: 2,
      title: "4대보험료 계산",
      desc: "국민연금 4.5% · 건강보험 3.545% · 장기요양(건강 × 12.95%) · 고용보험 0.9%를 월 과세급여 기준으로 공제합니다.",
    },
    {
      n: 3,
      title: "근로소득공제·인적공제·보험료 공제",
      desc: "총급여 구간별 근로소득공제(최대 2,000만원), 부양가족 1인당 150만원 인적공제, 4대보험료 전액 소득공제를 합쳐 과세표준을 산출합니다.",
    },
    {
      n: 4,
      title: "누진세율로 산출세액",
      desc: "1,400만 이하 6% → 5,000만 이하 15% → 8,800만 이하 24% → 1.5억 이하 35% → … → 10억 초과 45%까지 누진 적용합니다.",
    },
    {
      n: 5,
      title: "근로소득세액공제·자녀세액공제",
      desc: "산출세액의 55%(130만원 이하) 또는 71.5만+초과분의 30%를 공제하고 한도(74만/66만/50만/20만)를 적용. 자녀(8~20세)별 추가 공제도 차감합니다.",
    },
    {
      n: 6,
      title: "지방소득세 + 월 환산",
      desc: "결정세액 × 10%를 지방소득세로 더한 뒤, 12로 나눠 월 부담액을 계산합니다. 세전 - 4대보험 - 결정세 - 지방세 = 실수령액.",
    },
  ];

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-slate-900">계산 방식</h2>
      <ol className="space-y-3">
        {steps.map((s) => (
          <li key={s.n} className="flex gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-light text-sm font-bold text-brand">
              {s.n}
            </div>
            <div>
              <div className="font-semibold text-slate-800">{s.title}</div>
              <div className="mt-0.5 text-sm text-slate-600">{s.desc}</div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
