"use client";

import { useMemo, useState } from "react";
import {
  convertWage,
  isBelowMinimumWage,
  MINIMUM_WAGE,
  type Unit,
} from "@/lib/hourly";
import { formatKRW } from "@/lib/salary";

const UNITS: Array<{ key: Unit; label: string }> = [
  { key: "hourly", label: "시급" },
  { key: "daily", label: "일급" },
  { key: "weekly", label: "주급" },
  { key: "monthly", label: "월급" },
  { key: "annual", label: "연봉" },
];

export default function HourlyCalculator() {
  const [unit, setUnit] = useState<Unit>("monthly");
  const [amount, setAmount] = useState<string>("3000000");

  const result = useMemo(() => {
    const n = Number(amount.replace(/[^\d]/g, "")) || 0;
    return convertWage(n, unit);
  }, [amount, unit]);

  const belowMin = isBelowMinimumWage(result.hourly, 2026);

  const presets: Array<{ label: string; value: number; unit: Unit }> = [
    { label: "최저시급", value: MINIMUM_WAGE[2026], unit: "hourly" },
    { label: "월 250만", value: 2_500_000, unit: "monthly" },
    { label: "월 300만", value: 3_000_000, unit: "monthly" },
    { label: "월 400만", value: 4_000_000, unit: "monthly" },
    { label: "연봉 5천", value: 50_000_000, unit: "annual" },
    { label: "연봉 7천", value: 70_000_000, unit: "annual" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-5 text-lg font-bold text-slate-800">기준 단위 선택 후 금액 입력</h2>

        {/* 단위 선택 */}
        <div className="mb-4 grid grid-cols-5 gap-1.5">
          {UNITS.map((u) => (
            <button
              key={u.key}
              type="button"
              onClick={() => setUnit(u.key)}
              className={`rounded-lg py-2 text-sm font-semibold transition ${
                unit === u.key
                  ? "bg-brand text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>

        {/* 금액 입력 */}
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {UNITS.find((u) => u.key === unit)?.label} (원)
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={amount ? Number(amount).toLocaleString("ko-KR") : ""}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="금액 입력"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-right font-mono text-lg focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>

        {/* 프리셋 */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setUnit(p.unit);
                setAmount(String(p.value));
              }}
              className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600 hover:bg-brand-light hover:text-brand"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 결과 카드 */}
      <div className="rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-6 text-white shadow-lg">
        <div className="text-sm font-medium opacity-90">환산 결과 (세전)</div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ResultBox label="시급" value={result.hourly} />
          <ResultBox label="일급 (8시간)" value={result.daily} />
          <ResultBox label="주급 (48시간)" value={result.weekly} />
          <ResultBox label="월급 (209시간)" value={result.monthly} />
          <ResultBox label="연봉" value={result.annual} highlight />
        </div>
        {belowMin && (
          <div className="mt-4 rounded-lg bg-rose-500/30 p-3 text-sm">
            ⚠️ 시급 {formatKRW(result.hourly)}원은 2026년 최저시급(
            {formatKRW(MINIMUM_WAGE[2026])}원) 미만입니다. 최저임금법 위반 가능성이 있습니다.
          </div>
        )}
      </div>

      {/* 환산식 안내 */}
      <details className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200" open>
        <summary className="cursor-pointer text-base font-bold text-slate-800">환산 기준</summary>
        <div className="mt-4 space-y-2 text-sm text-slate-700">
          <Row label="1일 근로시간" value="8시간 (법정)" />
          <Row label="1주 유급시간" value="48시간 (40 + 주휴 8)" />
          <Row label="1개월 유급시간" value="209시간 (48 × 4.345주)" />
          <Row label="2026년 최저시급" value={`${formatKRW(MINIMUM_WAGE[2026])}원`} />
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            본 환산값은 통상임금 기준 세전 금액입니다. 실수령액(4대보험·소득세 차감 후)은
            연봉 5천만원 기준 약 85%, 1억 기준 약 78% 수준입니다. 정확한 실수령액은{" "}
            <a href="/" className="text-brand hover:underline">
              연봉 실수령액 계산기
            </a>
            를 이용하세요.
          </p>
        </div>
      </details>
    </div>
  );
}

function ResultBox({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-3 ${
        highlight ? "bg-white/20 ring-2 ring-white/40" : "bg-white/10"
      }`}
    >
      <div className="text-xs opacity-80">{label}</div>
      <div className="mt-1 font-mono text-xl font-bold">
        {formatKRW(value)}
        <span className="ml-1 text-xs opacity-80">원</span>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="font-mono font-semibold">{value}</span>
    </div>
  );
}
