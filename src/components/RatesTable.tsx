export default function RatesTable() {
  const items = [
    { name: "국민연금", rate: "4.5%", note: "기준소득월액 상한 617만원 (2025.7~2026.6)" },
    { name: "건강보험", rate: "3.545%", note: "2025년 동결, 2026년 시행 예정" },
    { name: "장기요양", rate: "건강 × 12.95%", note: "건강보험료의 12.95%" },
    { name: "고용보험", rate: "0.9%", note: "150인 미만 사업장 근로자 부담" },
  ];

  const taxBrackets = [
    { range: "1,400만원 이하", rate: "6%", deduct: "-" },
    { range: "1,400 ~ 5,000만", rate: "15%", deduct: "126만" },
    { range: "5,000 ~ 8,800만", rate: "24%", deduct: "576만" },
    { range: "8,800 ~ 1.5억", rate: "35%", deduct: "1,544만" },
    { range: "1.5억 ~ 3억", rate: "38%", deduct: "1,994만" },
    { range: "3억 ~ 5억", rate: "40%", deduct: "2,594만" },
    { range: "5억 ~ 10억", rate: "42%", deduct: "3,594만" },
    { range: "10억 초과", rate: "45%", deduct: "6,594만" },
  ];

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-slate-900">2026년 4대보험료율</h2>
      <div className="overflow-hidden rounded-xl ring-1 ring-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">항목</th>
              <th className="px-4 py-3 text-left">근로자 부담</th>
              <th className="px-4 py-3 text-left">비고</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {items.map((it) => (
              <tr key={it.name} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold text-slate-800">{it.name}</td>
                <td className="px-4 py-3 font-mono text-brand">{it.rate}</td>
                <td className="px-4 py-3 text-slate-600">{it.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-4 mt-10 text-xl font-bold text-slate-900">근로소득세 누진세율</h2>
      <div className="overflow-hidden rounded-xl ring-1 ring-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">과세표준</th>
              <th className="px-4 py-3 text-left">세율</th>
              <th className="px-4 py-3 text-left">누진공제</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {taxBrackets.map((b) => (
              <tr key={b.range} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-700">{b.range}</td>
                <td className="px-4 py-3 font-mono font-semibold text-brand">{b.rate}</td>
                <td className="px-4 py-3 font-mono text-slate-600">{b.deduct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
