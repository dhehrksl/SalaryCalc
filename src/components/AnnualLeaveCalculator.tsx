"use client";

import { useMemo, useState } from "react";
import { calculateAnnualLeave } from "@/lib/annualLeave";
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

export default function AnnualLeaveCalculator() {
  const [startDate, setStartDate] = useState<string>(yearsAgoISO(3));
  const [asOfDate, setAsOfDate] = useState<string>(todayISO());
  const [monthlyWage, setMonthlyWage] = useState<string>("3000000");
  const [usedDays, setUsedDays] = useState<number>(0);
  const [attendanceFull, setAttendanceFull] = useState<boolean>(true);

  const result = useMemo(
    () =>
      calculateAnnualLeave({
        startDate,
        asOfDate,
        attendanceRate: attendanceFull ? 1.0 : 0.7,
        monthlyOrdinaryWage: Number(monthlyWage.replace(/[^\d]/g, "")) || 0,
        usedDays,
      }),
    [startDate, asOfDate, attendanceFull, monthlyWage, usedDays],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-5 text-lg font-bold text-slate-800">연차 정보 입력</h2>

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
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              기준일 (오늘 또는 회계연도 말일)
            </span>
            <input
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 font-mono focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            월 통상임금 (원, 기본급 + 고정수당)
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={monthlyWage ? Number(monthlyWage).toLocaleString("ko-KR") : ""}
            onChange={(e) => setMonthlyWage(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="예: 3,000,000"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-right font-mono text-lg focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              올해 사용한 연차 일수
            </span>
            <input
              type="number"
              min={0}
              max={30}
              value={usedDays}
              onChange={(e) => setUsedDays(Math.max(0, Number(e.target.value) || 0))}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-center font-mono focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <label className="flex flex-col">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">출근율</span>
            <div className="flex h-full gap-2">
              <button
                type="button"
                onClick={() => setAttendanceFull(true)}
                className={`flex-1 rounded-lg py-3 text-sm font-semibold transition ${
                  attendanceFull
                    ? "bg-brand text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                80% 이상
              </button>
              <button
                type="button"
                onClick={() => setAttendanceFull(false)}
                className={`flex-1 rounded-lg py-3 text-sm font-semibold transition ${
                  !attendanceFull
                    ? "bg-brand text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                80% 미만
              </button>
            </div>
          </label>
        </div>
      </div>

      {/* 결과 — 발생 일수 */}
      <div className="rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-6 text-white shadow-lg">
        <div className="text-sm font-medium opacity-90">올해 발생 연차</div>
        <div className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {result.totalDays}
          <span className="ml-2 text-lg opacity-80">일</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg bg-white/10 p-3">
            <div className="opacity-80">사용</div>
            <div className="mt-0.5 font-bold">{result.usedDays}일</div>
          </div>
          <div className="rounded-lg bg-white/10 p-3">
            <div className="opacity-80">미사용</div>
            <div className="mt-0.5 font-bold">{result.remainingDays}일</div>
          </div>
          <div className="rounded-lg bg-white/10 p-3">
            <div className="opacity-80">재직</div>
            <div className="mt-0.5 font-bold">{result.workingYears.toFixed(1)}년</div>
          </div>
        </div>
        <p className="mt-3 text-xs opacity-90">{result.note}</p>
      </div>

      {/* 결과 — 미사용 수당 */}
      {result.remainingDays > 0 && result.dailyOrdinaryWage > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="text-sm font-medium text-slate-500">미사용 연차수당 (예상)</div>
          <div className="mt-1 text-3xl font-extrabold tracking-tight text-brand sm:text-4xl">
            {formatKRW(result.unusedAllowance)}
            <span className="ml-2 text-base text-slate-500">원</span>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <Row label="통상시급 (월급 ÷ 209시간)" value={result.hourlyOrdinaryWage} />
            <Row label="1일 통상임금 (시급 × 8시간)" value={result.dailyOrdinaryWage} />
            <Row
              label={`× 미사용 ${result.remainingDays}일`}
              value={result.unusedAllowance}
              highlight
            />
          </div>
          <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            연차수당은 연차 사용 가능 기간이 만료된 다음 날 임금 채권으로 전환됩니다. 회사가
            연차사용촉진제도(서면 통보 등)를 시행한 경우 미사용분에 대한 수당 지급 의무가
            면제될 수 있으니 사규를 확인하세요.
          </p>
        </div>
      )}

      {/* 발생 규칙 안내 */}
      <details className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <summary className="cursor-pointer text-base font-bold text-slate-800">
          연차 발생 규칙
        </summary>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong className="text-slate-800">1년 미만</strong>: 1개월 개근 시 1일씩, 최대
              11일까지 발생
            </li>
            <li>
              <strong className="text-slate-800">1년 이상 (출근율 80%+)</strong>: 기본 15일
            </li>
            <li>
              <strong className="text-slate-800">3년 이상</strong>: 매 2년마다 1일 가산 (3년차
              16일, 5년차 17일, 7년차 18일 …)
            </li>
            <li>
              <strong className="text-slate-800">상한</strong>: 21년차에 25일 도달 후 동결
            </li>
            <li>
              <strong className="text-slate-800">출근율 80% 미만</strong>: 기본 15일 연차는
              발생하지 않고, 만월 개근 시 1일씩 월차로만 발생
            </li>
          </ul>
          <p className="text-xs text-slate-500">
            ※ 5인 미만 사업장은 연차휴가 의무 적용 대상이 아닙니다 (근로기준법 제11조).
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
    <div className={`flex justify-between ${highlight ? "font-bold text-brand" : "text-slate-700"}`}>
      <span>{label}</span>
      <span className="font-mono">{formatKRW(value)}원</span>
    </div>
  );
}
