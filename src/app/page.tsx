import AdSlot, { SideAdSlot } from "@/components/AdSlot";
import Calculator from "@/components/Calculator";
import Faq from "@/components/Faq";
import HowItWorks from "@/components/HowItWorks";
import RatesTable from "@/components/RatesTable";
import StructuredData from "@/components/StructuredData";

export default function HomePage() {
  return (
    <>
      <StructuredData />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-base font-bold text-brand sm:text-lg">
            연봉 실수령액 계산기
          </h1>
          <span className="text-xs text-slate-500">2026년 기준</span>
        </div>
      </header>

      {/* 3-column layout: [좌측 광고] [본문] [우측 광고]
          모바일/태블릿(lg 미만)에서는 사이드 자동 숨김 → 본문만 노출됨 */}
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
        <SideAdSlot id="ad-side-left" side="left" />

        <main className="min-w-0 flex-1">
          {/* 인트로 */}
          <section className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              세전 연봉으로 월 실수령액을 1초 만에
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              2026년 시행 4대보험료율과 근로소득세 기준으로 월/연 실수령액, 소득세, 4대보험을 한 번에 계산합니다.
            </p>
          </section>

          {/* 상단 광고 (계산기 위) */}
          <AdSlot id="ad-top" variant="horizontal" />

          {/* 계산기 */}
          <Calculator />

          {/* 중간 광고 (계산기 직후 — 가장 노출 많은 자리) */}
          <AdSlot id="ad-after-calc" variant="rectangle" />

          {/* 작동 방식 */}
          <HowItWorks />

          {/* 광고 (작동 방식 뒤) */}
          <AdSlot id="ad-after-how" variant="horizontal" />

          {/* 4대보험 요율표 */}
          <RatesTable />

          {/* 광고 (요율표 뒤) */}
          <AdSlot id="ad-after-rates" variant="horizontal" />

          {/* FAQ */}
          <Faq />

          {/* 하단 광고 (FAQ 뒤) */}
          <AdSlot id="ad-bottom" variant="rectangle" />
        </main>

        <SideAdSlot id="ad-side-right" side="right" />
      </div>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-500">
          <p>
            본 계산기는 2025~2026년 시행 기준 4대보험료율·소득세법을 바탕으로 한 추정치이며, 실제 원천징수액과는 ±3% 내외 차이가 있을 수 있습니다.
          </p>
          <p className="mt-2">
            <a href="/retirement" className="hover:text-brand">퇴직금 계산기</a>
            <span className="mx-2">·</span>
            <a href="/privacy" className="hover:text-brand">개인정보처리방침</a>
            <span className="mx-2">·</span>
            <span>© {new Date().getFullYear()} Salary Calc</span>
          </p>
        </div>
      </footer>
    </>
  );
}
