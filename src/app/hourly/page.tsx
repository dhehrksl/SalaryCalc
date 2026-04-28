import Link from "next/link";
import type { Metadata } from "next";
import AdSlot, { SideAdSlot } from "@/components/AdSlot";
import CalculatorNav from "@/components/CalculatorNav";
import HourlyCalculator from "@/components/HourlyCalculator";

export const metadata: Metadata = {
  title: "시급 계산기·월급 계산기 — 시급↔월급↔연봉 변환 1초",
  description:
    "시급·일급·주급·월급·연봉을 209시간 기준으로 즉시 양방향 변환합니다. 2026년 최저시급 미달 여부도 자동 확인.",
  keywords: [
    "시급 계산기",
    "월급 계산기",
    "주급 계산기",
    "연봉 계산기",
    "시급 월급 환산",
    "최저시급 2026",
    "통상임금 209시간",
  ],
  alternates: { canonical: "/hourly" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "시급 계산기·월급 계산기 — 시급↔월급↔연봉 변환",
    description: "209시간 기준 양방향 환산, 최저시급 자동 검증",
  },
};

export default function HourlyPage() {
  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-base font-bold text-brand sm:text-lg">
            ← 연봉 실수령액 계산기
          </Link>
          <span className="text-xs text-slate-500">시급/주급/월급 계산기</span>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
        <SideAdSlot id="ad-hourly-side-left" side="left" />

        <main className="min-w-0 flex-1">
          <section className="mb-8 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              시급 계산기 · 월급 계산기
            </h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              시급↔일급↔주급↔월급↔연봉을 209시간 기준 통상임금으로 양방향 환산합니다.
            </p>
          </section>

          <AdSlot id="ad-hourly-top" variant="horizontal" />

          <HourlyCalculator />

          <CalculatorNav currentHref="/hourly" />

          <AdSlot id="ad-hourly-after-calc" variant="rectangle" />

          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900">자주 묻는 질문</h2>
            <div className="space-y-2">
              <FaqItem
                q="왜 월급을 209시간으로 나누나요?"
                a="법정 근로시간 주 40시간에 유급 주휴시간 8시간을 더하면 주 48시간입니다. 한 달 평균 4.345주를 곱하면 약 209시간(48 × 4.345)이 되어 월급제 근로자의 통상시급 환산 표준값으로 사용됩니다."
              />
              <FaqItem
                q="주휴수당이 시급에 포함되나요?"
                a="네. 1주 15시간 이상 근로하고 소정 근로일을 개근한 경우 주휴수당(8시간분 통상임금)을 받을 권리가 있습니다. 본 계산기의 주급 48시간·월급 209시간은 모두 주휴수당이 포함된 금액입니다."
              />
              <FaqItem
                q="실제 실수령액은 다르지 않나요?"
                a="맞습니다. 본 환산은 세전 금액 기준입니다. 실수령액은 4대보험(약 9~10%)과 근로소득세(누진)가 차감되어 연봉 5천만원 기준 약 85%, 1억 기준 약 78% 수준입니다. 정확한 실수령액은 연봉 실수령액 계산기를 이용하세요."
              />
              <FaqItem
                q="2026년 최저시급은 얼마인가요?"
                a="2026년 최저시급은 10,320원입니다(시간당, 모든 업종 동일). 월 환산 시 209시간 기준 약 215만 6,880원입니다. 최저시급에 미달하는 시급으로 근로계약을 체결하면 최저임금법 위반입니다."
              />
              <FaqItem
                q="알바·시간제 근로자에게도 동일하게 적용되나요?"
                a="기본 환산식은 동일합니다. 다만 1주 15시간 미만 단시간 근로자는 주휴수당 적용 대상이 아니므로, 그 경우 주급 = 시급 × 실 근로시간(주휴 미포함)으로 계산해야 합니다."
              />
              <FaqItem
                q="연장·야간·휴일 근로 가산은 포함되나요?"
                a="아니요. 본 계산기는 통상임금 기준 환산이며, 연장근로(50% 가산)·야간근로(50%)·휴일근로(50~100%)는 별도로 합산해야 합니다. 5인 미만 사업장은 가산수당 의무 적용 대상이 아닙니다."
              />
            </div>
          </section>

          <AdSlot id="ad-hourly-bottom" variant="rectangle" />
        </main>

        <SideAdSlot id="ad-hourly-side-right" side="right" />
      </div>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-500">
          <p>
            본 계산기는 통상임금 209시간 기준 세전 환산값이며, 연장·야간·휴일근로 가산수당과
            세후 실수령액은 별도 산정이 필요합니다.
          </p>
          <p className="mt-2">
            <Link href="/" className="hover:text-brand">
              연봉 실수령액 계산기
            </Link>
            <span className="mx-2">·</span>
            <Link href="/retirement" className="hover:text-brand">
              퇴직금 계산기
            </Link>
            <span className="mx-2">·</span>
            <Link href="/annual-leave" className="hover:text-brand">
              연차/연차수당 계산기
            </Link>
            <span className="mx-2">·</span>
            <Link href="/year-end-tax" className="hover:text-brand">
              연말정산 계산기
            </Link>
            <span className="mx-2">·</span>
            <Link href="/apt-score" className="hover:text-brand">
              청약 가점 계산기
            </Link>
            <span className="mx-2">·</span>
            <Link href="/privacy" className="hover:text-brand">
              개인정보처리방침
            </Link>
            <span className="mx-2">·</span>
            <span>© {new Date().getFullYear()} Salary Calc</span>
          </p>
        </div>
      </footer>
    </>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <summary className="cursor-pointer list-none font-semibold text-slate-800 marker:hidden">
        <span className="text-brand">Q. </span>
        {q}
      </summary>
      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">{a}</p>
    </details>
  );
}
