"use client";

import { useMemo, useState } from "react";
import { calculateYearEndTax } from "@/lib/yearEndTax";
import { formatKRW } from "@/lib/salary";

export default function YearEndTaxCalculator() {
  const [annualSalary, setAnnualSalary] = useState<string>("50000000");
  const [monthlyNonTaxable, setMonthlyNonTaxable] = useState<string>("200000");
  const [dependents, setDependents] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);

  const [creditCard, setCreditCard] = useState<string>("0");
  const [debitCash, setDebitCash] = useState<string>("0");
  const [insurance, setInsurance] = useState<string>("0");
  const [medical, setMedical] = useState<string>("0");
  const [education, setEducation] = useState<string>("0");
  const [donations, setDonations] = useState<string>("0");
  const [pension, setPension] = useState<string>("0");

  const num = (s: string) => Number(s.replace(/[^\d]/g, "")) || 0;

  const result = useMemo(
    () =>
      calculateYearEndTax({
        annualSalary: num(annualSalary),
        monthlyNonTaxable: num(monthlyNonTaxable),
        dependents,
        childrenAged8to20: children,
        creditCardUsage: num(creditCard),
        debitCashUsage: num(debitCash),
        insurancePremium: num(insurance),
        medicalExpenses: num(medical),
        educationExpenses: num(education),
        donations: num(donations),
        pensionSavings: num(pension),
      }),
    [
      annualSalary,
      monthlyNonTaxable,
      dependents,
      children,
      creditCard,
      debitCash,
      insurance,
      medical,
      education,
      donations,
      pension,
    ],
  );

  const isRefund = result.refund > 0;

  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-5 text-lg font-bold text-slate-800">1. 기본 정보</h2>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            세전 연봉 (원)
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={annualSalary ? Number(annualSalary).toLocaleString("ko-KR") : ""}
            onChange={(e) => setAnnualSalary(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="예: 50,000,000"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-right font-mono text-lg focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            월 비과세 (식대 등, 최대 20만원)
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={monthlyNonTaxable ? Number(monthlyNonTaxable).toLocaleString("ko-KR") : ""}
            onChange={(e) => setMonthlyNonTaxable(e.target.value.replace(/[^\d]/g, ""))}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-right font-mono focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>

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

      {/* 카드 사용액 */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-5 text-lg font-bold text-slate-800">2. 카드 사용액 (연)</h2>
        <p className="mb-4 text-xs text-slate-500">
          총급여의 25% 초과분에 대해 신용카드 15%·체크카드 30% 공제 (한도 200~300만원)
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MoneyInput label="신용카드" value={creditCard} onChange={setCreditCard} />
          <MoneyInput
            label="체크카드 + 현금영수증"
            value={debitCash}
            onChange={setDebitCash}
          />
        </div>
      </div>

      {/* 세액공제 항목 */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-5 text-lg font-bold text-slate-800">3. 세액공제 항목 (연)</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MoneyInput
            label="보장성보험료 (한도 100만)"
            value={insurance}
            onChange={setInsurance}
          />
          <MoneyInput
            label="의료비 (총급여 3% 초과분만)"
            value={medical}
            onChange={setMedical}
          />
          <MoneyInput label="교육비" value={education} onChange={setEducation} />
          <MoneyInput label="기부금" value={donations} onChange={setDonations} />
          <MoneyInput
            label="연금저축 + IRP (한도 900만)"
            value={pension}
            onChange={setPension}
          />
        </div>
      </div>

      {/* 결과 카드 */}
      <div
        className={`rounded-2xl p-6 text-white shadow-lg ${
          isRefund
            ? "bg-gradient-to-br from-emerald-500 to-emerald-700"
            : "bg-gradient-to-br from-rose-500 to-rose-700"
        }`}
      >
        <div className="text-sm font-medium opacity-90">
          {isRefund ? "예상 환급액" : "예상 추가 납부액"}
        </div>
        <div className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {formatKRW(Math.abs(result.refund))}
          <span className="ml-2 text-lg opacity-80">원</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-white/15 p-3">
            <div className="opacity-80">결정세액 (연)</div>
            <div className="mt-0.5 font-bold">{formatKRW(result.determinedTax)}원</div>
          </div>
          <div className="rounded-lg bg-white/15 p-3">
            <div className="opacity-80">기납부세액 (연)</div>
            <div className="mt-0.5 font-bold">{formatKRW(result.prepaidTax)}원</div>
          </div>
        </div>
        <p className="mt-3 text-xs opacity-90">
          {isRefund
            ? "매월 원천징수된 세금이 결정세액보다 많아 환급이 발생합니다."
            : "결정세액이 기납부세액보다 많아 추가 납부가 필요합니다."}
        </p>
      </div>

      {/* 상세 */}
      <details className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <summary className="cursor-pointer text-base font-bold text-slate-800">
          공제 내역 자세히 보기
        </summary>
        <div className="mt-4 space-y-2 text-sm">
          <Group title="소득공제">
            <Row label="근로소득공제" value={result.earnedIncomeDeduction} />
            <Row label="인적공제" value={result.personalDeduction} />
            <Row label="4대보험료" value={result.insuranceDeduction} />
            <Row label="신용·체크·현금 사용 공제" value={result.cardDeduction} />
          </Group>

          <Row label="과세표준" value={result.taxableIncome} highlight />
          <Row label="산출세액 (누진세율)" value={result.calculatedTax} />

          <Group title="세액공제">
            <Row label="근로소득세액공제" value={result.earnedTaxCredit} negative />
            <Row label="자녀세액공제" value={result.childTaxCredit} negative />
            <Row label="보험료 (12%)" value={result.insuranceCredit} negative />
            <Row label="의료비 (15%)" value={result.medicalCredit} negative />
            <Row label="교육비 (15%)" value={result.educationCredit} negative />
            <Row label="기부금 (15~30%)" value={result.donationCredit} negative />
            <Row label="연금저축 (13.2~16.5%)" value={result.pensionCredit} negative />
          </Group>

          <Row label="결정세액 (지방세 포함)" value={result.determinedTax} highlight />
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            ※ 본 결과는 핵심 공제 항목만 반영한 단순 추정치이며, 실제 연말정산 결과와 ±10%
            오차가 있을 수 있습니다. 정확한 환급액은 국세청 홈택스의 연말정산 미리보기
            서비스를 이용하세요.
          </p>
        </div>
      </details>
    </div>
  );
}

function MoneyInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        value={value && value !== "0" ? Number(value).toLocaleString("ko-KR") : ""}
        onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
        placeholder="0"
        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-right font-mono focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  negative = false,
  highlight = false,
}: {
  label: string;
  value: number;
  negative?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between text-slate-700 ${
        highlight ? "border-t border-slate-200 pt-2 font-bold" : ""
      }`}
    >
      <span>{label}</span>
      <span className={`font-mono ${negative ? "text-rose-600" : ""}`}>
        {negative && value > 0 ? "-" : ""}
        {formatKRW(value)}원
      </span>
    </div>
  );
}
