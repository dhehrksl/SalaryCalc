"use client";

import { useMemo, useState } from "react";
import { calculateRetirement } from "@/lib/retirement";
import { formatKRW } from "@/lib/salary";

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function yearsAgoISO(years: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function RetirementCalculator() {
  const [startDate, setStartDate] = useState<string>(yearsAgoISO(3));
  const [endDate, setEndDate] = useState<string>(todayISO());
  const [last3, setLast3] = useState<string>("9000000");
  const [bonus, setBonus] = useState<string>("0");
  const [leave, setLeave] = useState<string>("0");

  const result = useMemo(
    () =>
      calculateRetirement({
        startDate,
        endDate,
        last3MonthsWage: Number(last3.replace(/[^\d]/g, "")) || 0,
        annualBonus: Number(bonus.replace(/[^\d]/g, "")) || 0,
        annualLeaveAllowance: Number(leave.replace(/[^\d]/g, "")) || 0,
      }),
    [startDate, endDate, last3, bonus, leave],
  );

  const handleNumeric = (setter: (v: string) => void) => (v: string) =>
    setter(v.replace(/[^\d]/g, ""));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-5 text-lg font-bold text-slate-800">퇴직금 정보 입력</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">입사일</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 font-mono focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">퇴사일</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 font-mono focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            직전 3개월 임금 총액 (원, 기본급 + 고정수당)
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={last3 ? Number(last3).toLocaleString("ko-KR") : ""}
            onChange={(e) => handleNumeric(setLast3)(e.target.value)}
            placeholder="예: 9,000,000 (월 300만원 × 3)"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-right font-mono text-lg focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              직전 1년 상여금 총액 (원)
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={bonus ? Number(bonus).toLocaleString("ko-KR") : ""}
              onChange={(e) => handleNumeric(setBonus)(e.target.value)}
              placeholder="예: 6,000,000"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-right font-mono focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              직전 1년 연차수당 (원)
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={leave ? Number(leave).toLocaleString("ko-KR") : ""}
              onChange={(e) => handleNumeric(setLeave)(e.target.value)}
              placeholder="예: 1,500,000"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-right font-mono focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </label>
        </div>
      </div>

      {/* 결과 */}
      <div className="rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-6 text-white shadow-lg">
        <div className="text-sm font-medium opacity-90">예상 퇴직금</div>
        {result.notEligible ? (
          <>
            <div className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
              지급 대상 아님
            </div>
            <p className="mt-2 text-sm opacity-90">
              {result.workingDays > 0
                ? `재직일수 ${result.workingDays}일 — 1년(365일) 이상 근무 시 법정 퇴직금 지급 대상이 됩니다.`
                : "입사일과 퇴사일을 정확히 입력해주세요."}
            </p>
          </>
        ) : (
          <>
            <div className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {formatKRW(result.severancePay)}
              <span className="ml-2 text-lg opacity-80">원</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-white/10 p-3">
                <div className="opacity-80">재직 기간</div>
                <div className="mt-0.5 font-bold">
                  {result.workingYears.toFixed(2)}년 ({result.workingDays}일)
                </div>
              </div>
              <div className="rounded-lg bg-white/10 p-3">
                <div className="opacity-80">세후 추정 (-6.6%)</div>
                <div className="mt-0.5 font-bold">{formatKRW(result.afterTaxAmount)}원</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 상세 */}
      {!result.notEligible && (
        <details className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200" open>
          <summary className="cursor-pointer text-base font-bold text-slate-800">
            계산 상세
          </summary>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <Row label="1일 평균임금 (3개월 임금 ÷ 일수)" value={result.avgDailyWage} />
            <Row label="상여·연차수당 1일 가산분" value={result.dailyAddition} />
            <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold">
              <span>1일 평균임금 합계</span>
              <span className="font-mono">{formatKRW(result.totalAvgDailyWage)}원</span>
            </div>
            <Row label="× 30일 × (재직일수 / 365)" value={result.severancePay} highlight />
            <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
              퇴직소득세는 근속연수공제·환산급여공제 등이 적용되어 누진 산출됩니다. 본 화면의
              세후 금액은 약 6.6%로 단순 추정한 값이며 실제 원천징수액과는 차이가 있을 수
              있습니다. 정확한 세액은 회사 인사팀 또는 국세청 홈택스에서 확인하세요.
            </div>
          </div>
        </details>
      )}

      {/* 안내 */}
      <details className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <summary className="cursor-pointer text-base font-bold text-slate-800">
          퇴직금 계산 방법
        </summary>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <p>
            <strong className="text-slate-800">법정 퇴직금</strong>은 근로자퇴직급여보장법 제8조에
            따라 1년 이상 계속 근로한 근로자가 퇴직할 때 30일분 이상의 평균임금을 1년 근속에
            대해 지급받는 제도입니다.
          </p>
          <p>
            <strong className="text-slate-800">평균임금</strong>은 퇴직 직전 3개월간 받은 임금
            총액을 그 기간의 총일수로 나눈 금액입니다. 정기 상여금과 연차수당은 직전 1년 분의
            3/12를 평균임금에 산입합니다.
          </p>
          <p>
            <strong className="text-slate-800">계산식</strong>: 1일 평균임금 × 30일 × (재직일수 ÷
            365)
          </p>
          <p className="text-xs text-slate-500">
            ※ 1년 미만 근속자는 법정 지급 대상이 아닙니다 (단, 회사 사규로 별도 지급 가능). 또한
            DC형 퇴직연금은 본 산식과 다르게 적립금 운용 결과에 따라 결정됩니다.
          </p>
        </div>
      </details>
    </div>
  );
}

function Row({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className={`flex justify-between ${highlight ? "font-bold text-brand" : ""}`}>
      <span>{label}</span>
      <span className="font-mono">{formatKRW(value)}원</span>
    </div>
  );
}
