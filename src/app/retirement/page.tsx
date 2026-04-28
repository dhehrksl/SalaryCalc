import Link from "next/link";
import type { Metadata } from "next";
import AdSlot, { SideAdSlot } from "@/components/AdSlot";
import CalculatorNav from "@/components/CalculatorNav";
import RetirementCalculator from "@/components/RetirementCalculator";

export const metadata: Metadata = {
  title: "퇴직금 계산기 — 평균임금·재직기간으로 1초 산출",
  description:
    "근로자퇴직급여보장법 기준 평균임금과 재직기간으로 법정 퇴직금을 1초 만에 계산합니다. 상여금·연차수당 산입 지원.",
  keywords: [
    "퇴직금 계산기",
    "퇴직금 계산",
    "평균임금",
    "법정 퇴직금",
    "근로자퇴직급여보장법",
    "퇴직금 산정",
  ],
  alternates: { canonical: "/retirement" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "퇴직금 계산기 — 평균임금·재직기간으로 1초 산출",
    description: "법정 퇴직금을 평균임금 산식으로 즉시 계산",
  },
};

export default function RetirementPage() {
  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-base font-bold text-brand sm:text-lg">
            ← 연봉 실수령액 계산기
          </Link>
          <span className="text-xs text-slate-500">퇴직금 계산기</span>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
        <SideAdSlot id="ad-retirement-side-left" side="left" />

        <main className="min-w-0 flex-1">
          <section className="mb-6 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              퇴직금 계산기
            </h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              근로자퇴직급여보장법에 따른 법정 퇴직금을 평균임금·재직일수 기준으로 즉시
              계산합니다.
            </p>
          </section>

          <CalculatorNav currentHref="/retirement" />

          <AdSlot id="ad-retirement-top" variant="horizontal" />

          <RetirementCalculator />

          <AdSlot id="ad-retirement-after-calc" variant="rectangle" />

          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900">자주 묻는 질문</h2>
            <div className="space-y-2">
              <FaqItem
                q="DC형 퇴직연금에 가입되어 있어요. 이 계산이 맞나요?"
                a="DC(확정기여)형은 회사가 매년 적립한 부담금과 운용수익에 따라 결정되어 본 산식과 다릅니다. 본 계산기는 DB(확정급여)형 또는 법정 퇴직금 기준입니다. DC형 가입자는 가입한 퇴직연금 사업자(은행·증권사) 앱에서 적립금 잔액을 확인하세요."
              />
              <FaqItem
                q="1년 미만 근무자는 정말 퇴직금이 없나요?"
                a="법정 퇴직금은 근로자퇴직급여보장법상 '1년 이상 계속 근로'한 근로자에게만 지급 의무가 있습니다. 다만 회사 사규나 근로계약으로 1년 미만에도 별도 퇴직금을 지급하는 경우가 있으니 회사 인사팀에 확인하세요."
              />
              <FaqItem
                q="상여금은 어떻게 평균임금에 포함되나요?"
                a="정기 상여금(설·추석·정기 보너스 등)은 직전 1년치 총액의 3/12를 평균임금에 산입합니다. 즉 1년 상여 600만원이면 150만원이 직전 3개월 임금에 가산되어 평균임금이 올라갑니다. 일회성 인센티브(MBO 등)는 통상 제외됩니다."
              />
              <FaqItem
                q="평균임금과 통상임금 중 큰 쪽으로 계산하나요?"
                a="네, 법령상 평균임금이 통상임금보다 적은 경우 통상임금을 평균임금으로 봅니다. 본 계산기는 입력된 임금이 평균임금이라고 가정합니다. 통상임금이 더 높은 케이스(예: 근무 마지막 3개월에 무급휴직)에는 별도 산정이 필요합니다."
              />
              <FaqItem
                q="퇴직소득세는 어떻게 계산되나요?"
                a="퇴직소득세는 근속연수공제·환산급여공제 후 누진세율(6~45%)이 적용됩니다. 근속이 길수록 공제가 커져 실효세율이 낮아집니다. 본 화면의 '세후 추정'은 약 6.6%로 단순 근사한 값이며, 정확한 세액은 회사가 발급하는 퇴직소득세 영수증에 표기됩니다."
              />
            </div>
          </section>

          <AdSlot id="ad-retirement-bottom" variant="rectangle" />
        </main>

        <SideAdSlot id="ad-retirement-side-right" side="right" />
      </div>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-500">
          <p>
            본 계산기는 근로자퇴직급여보장법 기준 법정 퇴직금 추정치이며, DC형 퇴직연금이나
            회사 사규에 따라 실제 지급액은 달라질 수 있습니다.
          </p>
          <p className="mt-2">
            <Link href="/" className="hover:text-brand">
              연봉 실수령액 계산기
            </Link>
            <span className="mx-2">·</span>
            <Link href="/annual-leave" className="hover:text-brand">
              연차/연차수당 계산기
            </Link>
            <span className="mx-2">·</span>
            <Link href="/hourly" className="hover:text-brand">
              시급/주급/월급 계산기
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
