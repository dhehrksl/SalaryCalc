"use client";

import { useMemo, useState } from "react";
import { calculateAptScore, SCORE_CAP } from "@/lib/aptScore";

export default function AptScoreCalculator() {
  const [homelessYears, setHomelessYears] = useState<number>(5);
  const [dependents, setDependents] = useState<number>(2);
  const [accountYears, setAccountYears] = useState<number>(5);

  const result = useMemo(
    () => calculateAptScore({ homelessYears, dependents, accountYears }),
    [homelessYears, dependents, accountYears],
  );

  const totalPercent = (result.totalScore / SCORE_CAP.total) * 100;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-5 text-lg font-bold text-slate-800">청약 정보 입력</h2>

        <SliderField
          label="무주택 기간"
          unit="년"
          value={homelessYears}
          onChange={setHomelessYears}
          min={0}
          max={20}
          step={1}
          hint="만 30세 또는 혼인일 이후 무주택 보유 기간 (최대 32점)"
        />

        <SliderField
          label="부양가족 수 (본인 제외)"
          unit="명"
          value={dependents}
          onChange={setDependents}
          min={0}
          max={8}
          step={1}
          hint="배우자 + 직계존속(60세 이상 동거 부모) + 직계비속(자녀) (최대 35점)"
        />

        <SliderField
          label="청약통장 가입 기간"
          unit="년"
          value={accountYears}
          onChange={setAccountYears}
          min={0}
          max={20}
          step={1}
          hint="주택청약종합저축 또는 청약저축 가입 기간 (최대 17점)"
        />
      </div>

      {/* 결과 카드 */}
      <div className="rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-6 text-white shadow-lg">
        <div className="text-sm font-medium opacity-90">청약 가점 총점</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            {result.totalScore}
          </span>
          <span className="text-2xl opacity-80">/ {SCORE_CAP.total}점</span>
        </div>

        {/* 진행 바 */}
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full bg-white transition-all"
            style={{ width: `${Math.min(100, totalPercent)}%` }}
          />
        </div>

        <div className="mt-4 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-bold">
          {result.grade}
        </div>
        <p className="mt-2 text-sm opacity-90">{result.gradeNote}</p>
      </div>

      {/* 항목별 점수 */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h3 className="mb-4 text-base font-bold text-slate-800">항목별 점수</h3>
        <div className="space-y-4">
          <ScoreBar
            label={`무주택 기간 (${homelessYears}년)`}
            score={result.homelessScore}
            cap={SCORE_CAP.homeless}
          />
          <ScoreBar
            label={`부양가족 (${dependents}명)`}
            score={result.dependentsScore}
            cap={SCORE_CAP.dependents}
          />
          <ScoreBar
            label={`청약통장 (${accountYears}년)`}
            score={result.accountScore}
            cap={SCORE_CAP.account}
          />
        </div>
      </div>

      {/* 점수 산정 기준 */}
      <details className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <summary className="cursor-pointer text-base font-bold text-slate-800">
          가점 산정 기준 자세히
        </summary>
        <div className="mt-4 space-y-4 text-sm text-slate-600">
          <div>
            <h4 className="font-semibold text-slate-800">1. 무주택 기간 (32점 만점)</h4>
            <ul className="mt-1 list-disc space-y-0.5 pl-5">
              <li>1년 미만: 2점 / 1년 이상~2년 미만: 4점</li>
              <li>1년 단위로 +2점씩 가산</li>
              <li>15년 이상: 32점 (상한)</li>
              <li>* 무주택 기간은 만 30세 또는 혼인신고일 중 빠른 날부터 기산</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">2. 부양가족 수 (35점 만점)</h4>
            <ul className="mt-1 list-disc space-y-0.5 pl-5">
              <li>0명: 5점 / 1명: 10점 / 2명: 15점</li>
              <li>1명당 +5점씩 가산</li>
              <li>6명 이상: 35점 (상한)</li>
              <li>* 본인은 제외. 배우자·직계존속(60세 이상 동거 부모)·자녀가 인정됨</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">3. 청약통장 가입 기간 (17점 만점)</h4>
            <ul className="mt-1 list-disc space-y-0.5 pl-5">
              <li>6개월 미만: 1점 / 6개월~1년: 2점</li>
              <li>1년 이상부터 1년 단위로 +1점씩</li>
              <li>15년 이상: 17점 (상한)</li>
              <li>* 주택청약종합저축·청약저축·청약예금·청약부금 모두 인정</li>
            </ul>
          </div>
        </div>
      </details>
    </div>
  );
}

function SliderField({
  label,
  unit,
  value,
  onChange,
  min,
  max,
  step,
  hint,
}: {
  label: string;
  unit: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  hint: string;
}) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-lg font-bold text-brand">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand"
      />
      <div className="mt-1 flex justify-between text-xs text-slate-400">
        <span>{min}</span>
        <span>{max}+</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

function ScoreBar({ label, score, cap }: { label: string; score: number; cap: number }) {
  const percent = (score / cap) * 100;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-mono font-bold text-slate-900">
          {score} <span className="text-xs text-slate-400">/ {cap}점</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-brand transition-all"
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
    </div>
  );
}
