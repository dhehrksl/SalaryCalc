"use client";

import { useMemo, useState } from "react";
import { calculateSalary, formatKRW } from "@/lib/salary";

type InputMode = "annual" | "monthly";

export default function Calculator() {
  const [mode, setMode] = useState<InputMode>("annual");
  const [salaryInput, setSalaryInput] = useState<string>("50000000");
  const [nonTaxableInput, setNonTaxableInput] = useState<string>("200000");
  const [dependents, setDependents] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);

  const annualSalary = useMemo(() => {
    const n = Number(salaryInput.replace(/[^\d]/g, "")) || 0;
    return mode === "annual" ? n : n * 12;
  }, [salaryInput, mode]);

  const monthlyNonTaxable = useMemo(() => Number(nonTaxableInput.replace(/[^\d]/g, "")) || 0, [
    nonTaxableInput,
  ]);

  const result = useMemo(
    () =>
      calculateSalary({
        annualSalary,
        monthlyNonTaxable,
        dependents,
        childrenAged8to20: children,
      }),
    [annualSalary, monthlyNonTaxable, dependents, children],
  );

  const totalDeduction = result.insurance.total + result.tax.monthlyIncomeTax + result.tax.monthlyLocalTax;

  const handleSalaryChange = (v: string) => {
    const cleaned = v.replace(/[^\d]/g, "");
    setSalaryInput(cleaned);
  };

  const presetSalaries = [25_000_000, 30_000_000, 40_000_000, 50_000_000, 70_000_000, 100_000_000];

  return (
    <div className="space-y-6">
      {/* 입력 카드 */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-5 text-lg font-bold text-slate-800">기본 정보 입력</h2>

        {/* 모드 토글 */}
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("annual")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              mode === "annual"
                ? "bg-brand text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            연봉으로 입력
          </button>
          <button
            type="button"
            onClick={() => setMode("monthly")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              mode === "monthly"
                ? "bg-brand text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            월급으로 입력
          </button>
        </div>

        {/* 급여 */}
        <label className="mb-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {mode === "annual" ? "세전 연봉 (원)" : "세전 월급 (원)"}
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={salaryInput ? Number(salaryInput).toLocaleString("ko-KR") : ""}
            onChange={(e) => handleSalaryChange(e.target.value)}
            placeholder={mode === "annual" ? "예: 50,000,000" : "예: 4,000,000"}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-right font-mono text-lg focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          {mode === "annual" && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {presetSalaries.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSalaryInput(String(s))}
                  className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600 hover:bg-brand-light hover:text-brand"
                >
                  {(s / 10_000_000).toFixed(0)}천
                </button>
              ))}
            </div>
          )}
        </label>

        {/* 비과세 (식대) */}
        <label className="mb-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            월 비과세액 (식대 등, 최대 20만원)
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={nonTaxableInput ? Number(nonTaxableInput).toLocaleString("ko-KR") : ""}
            onChange={(e) => setNonTaxableInput(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="예: 200,000"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-right font-mono focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>

        {/* 부양가족 / 자녀 */}
        <div className="grid grid-cols-2 gap-3">
          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              부양가족 수 (본인 포함)
            </span>
            <input
              type="number"
              min={1}
              max={20}
              value={dependents}
              onChange={(e) => setDependents(Math.max(1, Number(e.target.value) || 1))}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-center font-mono focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              8~20세 자녀 수
            </span>
            <input
              type="number"
              min={0}
              max={10}
              value={children}
              onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-center font-mono focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </label>
        </div>
      </div>

      {/* 결과 — 큰 숫자 */}
      <div className="rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-6 text-white shadow-lg">
        <div className="text-sm font-medium opacity-90">월 실수령액</div>
        <div className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {formatKRW(result.monthlyTakeHome)}
          <span className="ml-2 text-lg opacity-80">원</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-white/10 p-3">
            <div className="opacity-80">연 실수령</div>
            <div className="mt-0.5 font-bold">{formatKRW(result.annualTakeHome)}원</div>
          </div>
          <div className="rounded-lg bg-white/10 p-3">
            <div className="opacity-80">월 공제 합계</div>
            <div className="mt-0.5 font-bold">{formatKRW(totalDeduction)}원</div>
          </div>
        </div>

        {/* 공제 비중 막대 */}
        {result.monthlyGross > 0 && (
          <div className="mt-4">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="bg-emerald-300"
                style={{ width: `${(result.monthlyTakeHome / result.monthlyGross) * 100}%` }}
                title={`실수령 ${formatKRW(result.monthlyTakeHome)}원`}
              />
              <div
                className="bg-amber-300"
                style={{ width: `${(result.insurance.total / result.monthlyGross) * 100}%` }}
                title={`4대보험 ${formatKRW(result.insurance.total)}원`}
              />
              <div
                className="bg-rose-300"
                style={{
                  width: `${
                    ((result.tax.monthlyIncomeTax + result.tax.monthlyLocalTax) /
                      result.monthlyGross) *
                    100
                  }%`,
                }}
                title={`세금 ${formatKRW(result.tax.monthlyIncomeTax + result.tax.monthlyLocalTax)}원`}
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <LegendDot color="bg-emerald-300">
                실수령 {((result.monthlyTakeHome / result.monthlyGross) * 100).toFixed(1)}%
              </LegendDot>
              <LegendDot color="bg-amber-300">
                4대보험 {((result.insurance.total / result.monthlyGross) * 100).toFixed(1)}%
              </LegendDot>
              <LegendDot color="bg-rose-300">
                세금{" "}
                {(
                  ((result.tax.monthlyIncomeTax + result.tax.monthlyLocalTax) /
                    result.monthlyGross) *
                  100
                ).toFixed(1)}
                %
              </LegendDot>
            </div>
          </div>
        )}
      </div>

      {/* 4대보험 상세 */}
      <details className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200" open>
        <summary className="cursor-pointer text-base font-bold text-slate-800">
          4대보험 (월) — {formatKRW(result.insurance.total)}원
        </summary>
        <div className="mt-4 space-y-2 text-sm">
          <Row label="국민연금 (4.5%)" value={result.insurance.nationalPension} />
          <Row label="건강보험 (3.545%)" value={result.insurance.healthInsurance} />
          <Row label="장기요양 (건강보험 × 12.95%)" value={result.insurance.longTermCare} />
          <Row label="고용보험 (0.9%)" value={result.insurance.employmentInsurance} />
          <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 font-bold">
            <span>합계</span>
            <span className="font-mono">{formatKRW(result.insurance.total)}원</span>
          </div>
        </div>
      </details>

      {/* 소득세 상세 */}
      <details className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200" open>
        <summary className="cursor-pointer text-base font-bold text-slate-800">
          소득세 (월) — {formatKRW(result.tax.monthlyIncomeTax + result.tax.monthlyLocalTax)}원
        </summary>
        <div className="mt-4 space-y-2 text-sm">
          <Row label="과세 표준 (연)" value={result.tax.taxableIncome} suffix="원" />
          <Row label="산출세액 (연)" value={result.tax.calculatedTax} suffix="원" />
          <Row
            label="근로소득세액공제 (연)"
            value={-result.tax.earnedTaxCredit}
            suffix="원"
            negative
          />
          {result.tax.childTaxCredit > 0 && (
            <Row
              label={`자녀세액공제 (연)`}
              value={-result.tax.childTaxCredit}
              suffix="원"
              negative
            />
          )}
          <div className="mt-2 flex justify-between border-t border-slate-200 pt-2">
            <span className="font-bold">결정세액 (연)</span>
            <span className="font-mono font-bold">{formatKRW(result.tax.determinedTax)}원</span>
          </div>
          <Row label="지방소득세 (연, 결정세 × 10%)" value={result.tax.localTax} suffix="원" />
          <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3">
            <div>
              <div className="text-xs text-slate-500">월 근로소득세</div>
              <div className="font-mono font-bold">{formatKRW(result.tax.monthlyIncomeTax)}원</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">월 지방소득세</div>
              <div className="font-mono font-bold">{formatKRW(result.tax.monthlyLocalTax)}원</div>
            </div>
          </div>
        </div>
      </details>

      {/* 공제 분해 */}
      <details className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <summary className="cursor-pointer text-base font-bold text-slate-800">
          공제 내역 자세히 보기
        </summary>
        <div className="mt-4 space-y-2 text-sm">
          <Row label="근로소득공제 (연)" value={result.tax.earnedIncomeDeduction} suffix="원" />
          <Row
            label={`인적공제 (${dependents}명 × 150만원)`}
            value={result.tax.personalDeduction}
            suffix="원"
          />
          <Row
            label="4대보험료 소득공제 (연)"
            value={result.tax.insuranceDeduction}
            suffix="원"
          />
        </div>
      </details>

      {/* 사업주(회사) 부담분 */}
      <details className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <summary className="cursor-pointer text-base font-bold text-slate-800">
          사업주(회사) 부담 4대보험 (월) — {formatKRW(result.employerInsurance.total)}원
        </summary>
        <p className="mt-2 text-xs text-slate-500">
          회사가 본인 인건비 외에 추가로 매월 납부하는 금액입니다. 산재보험은 업종별 요율이
          달라 제외했습니다.
        </p>
        <div className="mt-4 space-y-2 text-sm">
          <Row label="국민연금 (4.5%)" value={result.employerInsurance.nationalPension} />
          <Row label="건강보험 (3.545%)" value={result.employerInsurance.healthInsurance} />
          <Row label="장기요양 (건강 × 12.95%)" value={result.employerInsurance.longTermCare} />
          <Row label="고용보험 실업급여 (0.9%)" value={result.employerInsurance.employmentInsurance} />
          <Row
            label="고용안정·직업능력개발 (0.25%)"
            value={result.employerInsurance.employmentStability}
          />
          <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 font-bold">
            <span>합계 (월)</span>
            <span className="font-mono">{formatKRW(result.employerInsurance.total)}원</span>
          </div>
          <div className="flex justify-between text-slate-700">
            <span>회사가 본인에게 쓰는 총 비용 (월)</span>
            <span className="font-mono font-bold text-brand">
              {formatKRW(result.monthlyGross + result.employerInsurance.total)}원
            </span>
          </div>
        </div>
      </details>
    </div>
  );
}

function LegendDot({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-white/90">
      <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
      {children}
    </span>
  );
}

function Row({
  label,
  value,
  suffix = "원",
  negative = false,
}: {
  label: string;
  value: number;
  suffix?: string;
  negative?: boolean;
}) {
  return (
    <div className="flex justify-between text-slate-700">
      <span>{label}</span>
      <span className={`font-mono ${negative ? "text-rose-600" : ""}`}>
        {formatKRW(value)}
        {suffix}
      </span>
    </div>
  );
}
