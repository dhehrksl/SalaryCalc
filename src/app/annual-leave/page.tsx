import Link from "next/link";
import type { Metadata } from "next";
import AdSlot, { SideAdSlot } from "@/components/AdSlot";
import AnnualLeaveCalculator from "@/components/AnnualLeaveCalculator";
import CalculatorNav from "@/components/CalculatorNav";

export const metadata: Metadata = {
  title: "연차 계산기·연차수당 계산기 — 발생 일수와 미사용 수당 1초",
  description:
    "근로기준법 제60조 기준 연차 발생 일수와 미사용 연차수당을 1초 만에 계산합니다. 입사일·통상임금·사용일수 입력만으로 즉시 산출.",
  keywords: [
    "연차 계산기",
    "연차수당 계산기",
    "연차수당 계산",
    "연차 발생 일수",
    "연차휴가",
    "근로기준법 60조",
    "통상임금",
  ],
  alternates: { canonical: "/annual-leave" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "연차 계산기·연차수당 계산기",
    description: "연차 발생 일수와 미사용 수당을 즉시 계산",
  },
};

export default function AnnualLeavePage() {
  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-base font-bold text-brand sm:text-lg">
            ← 연봉 실수령액 계산기
          </Link>
          <span className="text-xs text-slate-500">연차/연차수당 계산기</span>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
        <SideAdSlot id="ad-leave-side-left" side="left" />

        <main className="min-w-0 flex-1">
          <section className="mb-8 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              연차 계산기 · 연차수당 계산기
            </h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              입사일·통상임금만 입력하면 발생 연차 일수와 미사용 수당을 1초 만에 계산합니다.
            </p>
          </section>

          <AdSlot id="ad-leave-top" variant="horizontal" />

          <AnnualLeaveCalculator />

          <AdSlot id="ad-leave-after-calc" variant="rectangle" />

          <CalculatorNav currentHref="/annual-leave" />

          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900">자주 묻는 질문</h2>
            <div className="space-y-2">
              <FaqItem
                q="연차수당은 언제 받을 수 있나요?"
                a="연차 사용 가능 기간(보통 발생일로부터 1년)이 만료되면 미사용 연차에 대한 임금 청구권이 발생합니다. 즉 만료일 다음 날 회사는 미사용 연차일수 × 1일 통상임금을 임금 명세에 산입해 지급할 의무가 있습니다. 단 연차사용촉진제(서면 통보)를 적법하게 시행한 경우 수당 지급 의무가 면제될 수 있습니다."
              />
              <FaqItem
                q="통상임금이 무엇인가요?"
                a="통상임금은 근로의 대가로 정기·일률·고정적으로 지급되는 임금입니다. 기본급과 정기 직책수당·기술수당·식대(고정) 등이 포함되며, 변동성 있는 성과급·시간외근로수당은 일반적으로 제외됩니다. 회사 임금명세서의 '통상임금' 항목 또는 인사팀에 문의해 정확한 금액을 확인하세요."
              />
              <FaqItem
                q="왜 209시간으로 나누나요?"
                a="법정 근로시간 주 40시간에 유급 주휴시간 8시간을 더하면 주 48시간이 유급 시간입니다. 한 달 평균 4.345주를 곱하면 약 209시간(48 × 4.345)이 되어, 월급제 근로자의 통상시급 환산 표준값으로 사용됩니다."
              />
              <FaqItem
                q="회계연도와 입사일 기준 중 어느 것이 맞나요?"
                a="법정 기준은 입사일 기준입니다. 다만 회사가 노사합의로 회계연도(1/1~12/31) 기준 일괄 부여 방식을 채택한 경우, 입사 첫해는 비례 일수가 발생하고 다음 해부터 15일 부여됩니다. 본 계산기는 입사일 기준으로 산정합니다."
              />
              <FaqItem
                q="5인 미만 사업장도 연차가 있나요?"
                a="아니요. 근로기준법 제11조에 따라 상시 근로자 5인 미만 사업장은 연차휴가(제60조)가 의무 적용 대상이 아닙니다. 다만 회사 사규에 별도 연차 규정이 있으면 그에 따릅니다."
              />
              <FaqItem
                q="연차수당에도 세금이 붙나요?"
                a="네. 연차수당은 근로소득에 해당하므로 일반 임금과 동일하게 4대보험료와 근로소득세가 원천징수됩니다. 본 페이지의 계산값은 세전 금액 기준이며, 실수령액은 약 8~15% 낮을 수 있습니다 (소득 구간에 따라 다름)."
              />
            </div>
          </section>

          <AdSlot id="ad-leave-bottom" variant="rectangle" />
        </main>

        <SideAdSlot id="ad-leave-side-right" side="right" />
      </div>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-500">
          <p>
            본 계산기는 근로기준법 제60조 기준 연차휴가 발생 일수와 통상임금 기반 수당
            추정치이며, 회사 사규나 노사합의에 따라 실제 적용은 다를 수 있습니다.
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
            <Link href="/hourly" className="hover:text-brand">
              시급/주급/월급 계산기
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
