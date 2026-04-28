import Link from "next/link";
import type { Metadata } from "next";
import AdSlot, { SideAdSlot } from "@/components/AdSlot";
import CalculatorNav from "@/components/CalculatorNav";
import YearEndTaxCalculator from "@/components/YearEndTaxCalculator";

export const metadata: Metadata = {
  title: "연말정산 계산기 — 환급액 추정 1초",
  description:
    "연봉·부양가족·신용카드·의료비·교육비·기부금·연금저축 입력만으로 2026년 연말정산 환급/추납 예상액을 즉시 계산합니다.",
  keywords: [
    "연말정산 계산기",
    "연말정산 환급",
    "연말정산 미리보기",
    "환급액 계산",
    "13월의 월급",
    "신용카드 공제",
    "연금저축 세액공제",
  ],
  alternates: { canonical: "/year-end-tax" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "연말정산 계산기 — 환급액 추정",
    description: "연봉·공제 항목만 입력하면 환급/추납 예상액 즉시 산출",
  },
};

export default function YearEndTaxPage() {
  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-base font-bold text-brand sm:text-lg">
            ← 연봉 실수령액 계산기
          </Link>
          <span className="text-xs text-slate-500">연말정산 계산기</span>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
        <SideAdSlot id="ad-tax-side-left" side="left" />

        <main className="min-w-0 flex-1">
          <section className="mb-6 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              연말정산 계산기 · 환급액 추정
            </h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              연봉과 주요 공제 항목 입력만으로 환급/추납 예상액을 즉시 계산합니다 (단순화 모델,
              실제와 ±10% 오차).
            </p>
          </section>

          <CalculatorNav currentHref="/year-end-tax" />

          <AdSlot id="ad-tax-top" variant="horizontal" />

          <YearEndTaxCalculator />

          <AdSlot id="ad-tax-after-calc" variant="rectangle" />

          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900">자주 묻는 질문</h2>
            <div className="space-y-2">
              <FaqItem
                q="왜 '13월의 월급'이라고 부르나요?"
                a="매월 회사가 원천징수한 세금은 간이세액표에 따른 추정치입니다. 연말이 되면 1년치 실제 소득과 공제 항목을 종합해 결정세액을 다시 계산하는데, 매월 떼인 세금이 더 많았다면 그 차액을 1~2월에 돌려받습니다. 이게 '13월의 월급'입니다."
              />
              <FaqItem
                q="환급을 가장 크게 받는 방법은?"
                a="(1) 연금저축·IRP — 한도 900만원, 총급여 5,500만 이하 16.5% 세액공제(최대 약 148만원), (2) 의료비·교육비 — 본인뿐 아니라 부양가족 합산, (3) 신용카드보다 체크카드·현금영수증(공제율 2배), (4) 기부금 — 종교·정치·일반 단체별 한도 다름. 본 계산기에서 입력해보면 항목별 효과를 즉시 확인 가능합니다."
              />
              <FaqItem
                q="신용카드 공제가 왜 0원으로 나오나요?"
                a="신용카드·체크카드·현금영수증 공제는 총급여의 25%를 초과해서 사용한 금액에 대해서만 적용됩니다. 예컨대 연봉 5천만원이면 약 1,200만원을 초과하는 사용분에 대해서만 공제가 시작됩니다. 그 미만 사용액은 공제 대상이 아닙니다."
              />
              <FaqItem
                q="의료비도 마찬가지로 일정 금액 이상만 공제되나요?"
                a="네. 의료비 세액공제는 총급여의 3% 초과분에 대해서만 15% 세액공제가 적용됩니다. 연봉 5천만 기준 약 142만원 이상 의료비를 지출했을 때부터 공제가 시작됩니다. 본인·부양가족 의료비 합산이 가능합니다."
              />
              <FaqItem
                q="이 계산기 결과를 그대로 믿어도 되나요?"
                a="단순화 모델이라 실제 결과와 ±10% 오차가 있을 수 있습니다. 누락된 항목으로는 월세 세액공제, 주택자금 차입금 이자공제, 장기집합투자증권저축, 청약저축 등이 있습니다. 정확한 미리보기는 매년 11월 이후 국세청 홈택스의 '연말정산 미리보기' 서비스를 이용하세요."
              />
              <FaqItem
                q="추가 납부가 나왔어요. 왜죠?"
                a="회사가 원천징수한 매월 세금이 실제 결정세액보다 적었다는 의미입니다. 주요 원인: (1) 연중 부양가족 변동(이혼·자녀 출가) (2) 부업·이자배당 등 추가 소득 (3) 회사가 부양가족 정보를 정확히 반영하지 않은 경우 등. 추가 납부도 1~2월 급여에서 차감되며, 분납 신청도 가능합니다."
              />
            </div>
          </section>

          <AdSlot id="ad-tax-bottom" variant="rectangle" />
        </main>

        <SideAdSlot id="ad-tax-side-right" side="right" />
      </div>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-500">
          <p>
            본 계산기는 핵심 공제 항목만 반영한 추정치이며, 정확한 환급액은 국세청 홈택스
            연말정산 미리보기 서비스를 이용하세요.
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
            <Link href="/hourly" className="hover:text-brand">
              시급/주급/월급 계산기
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
