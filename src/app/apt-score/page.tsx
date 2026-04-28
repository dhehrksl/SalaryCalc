import Link from "next/link";
import type { Metadata } from "next";
import AdSlot, { SideAdSlot } from "@/components/AdSlot";
import AptScoreCalculator from "@/components/AptScoreCalculator";
import CalculatorNav from "@/components/CalculatorNav";

export const metadata: Metadata = {
  title: "청약 가점 계산기 — 무주택·부양가족·통장 84점 만점",
  description:
    "주택청약 가점을 무주택 기간(32점) + 부양가족(35점) + 청약통장 가입기간(17점) 합산 84점으로 즉시 계산. 등급별 당첨 가능권 안내.",
  keywords: [
    "청약 가점 계산기",
    "주택청약 가점",
    "청약 점수",
    "무주택 기간",
    "부양가족 가점",
    "청약통장 가점",
    "청약 가점표",
  ],
  alternates: { canonical: "/apt-score" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "청약 가점 계산기 — 84점 만점 즉시 산출",
    description: "무주택·부양가족·통장 가입기간으로 청약 가점 즉시 계산",
  },
};

export default function AptScorePage() {
  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-base font-bold text-brand sm:text-lg">
            ← 연봉 실수령액 계산기
          </Link>
          <span className="text-xs text-slate-500">청약 가점 계산기</span>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
        <SideAdSlot id="ad-apt-side-left" side="left" />

        <main className="min-w-0 flex-1">
          <section className="mb-6 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              청약 가점 계산기
            </h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              무주택 기간 · 부양가족 수 · 청약통장 가입기간 3개 항목을 합산한 84점 만점 가점을
              즉시 산출합니다.
            </p>
          </section>

          <CalculatorNav currentHref="/apt-score" />

          <AdSlot id="ad-apt-top" variant="horizontal" />

          <AptScoreCalculator />

          <AdSlot id="ad-apt-after-calc" variant="rectangle" />

          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900">자주 묻는 질문</h2>
            <div className="space-y-2">
              <FaqItem
                q="청약 가점은 어떻게 만점 84점이 되나요?"
                a="무주택 기간 32점 + 부양가족 수 35점 + 청약통장 가입기간 17점의 합산입니다. 모두 만점을 받으려면 15년 이상 무주택 + 부양가족 6명 이상 + 청약통장 15년 이상 가입이 필요합니다."
              />
              <FaqItem
                q="무주택 기간은 언제부터 계산되나요?"
                a="만 30세가 된 날과 혼인신고일 중 빠른 날부터 무주택 기간이 기산됩니다. 즉 만 30세 이전 미혼이면 무주택 기간은 0년부터 시작합니다. 결혼이 빠르면 그만큼 가점 축적도 빨라집니다. 단 중간에 주택을 보유한 적이 있으면 그 기간은 제외됩니다."
              />
              <FaqItem
                q="부양가족에 누가 포함되나요?"
                a="배우자, 직계존속(60세 이상 동거 부모·조부모), 직계비속(자녀, 손자녀), 그리고 일정 조건의 형제자매가 포함됩니다. 본인은 제외입니다. 모두 동일 세대를 이루며 주민등록상 등재되어 있어야 합니다."
              />
              <FaqItem
                q="청약통장은 어떤 종류여도 되나요?"
                a="네. 주택청약종합저축, 청약저축, 청약예금, 청약부금 모두 가입기간이 인정됩니다. 다만 신규 가입은 주택청약종합저축만 가능합니다(2015년 이후 다른 종류는 신규 불가). 통장을 해지하면 가입기간이 사라지므로 주의하세요."
              />
              <FaqItem
                q="당첨되려면 몇 점은 되어야 하나요?"
                a="단지마다 천차만별이지만, 수도권 인기 단지는 60점 이상, 강남 등 초인기 단지는 70점 이상이 일반적입니다. 지방·외곽 단지는 40~50점대로도 당첨됩니다. 한국부동산원 청약홈에서 과거 단지별 당첨 가점 커트라인을 확인할 수 있습니다."
              />
              <FaqItem
                q="가점이 낮으면 청약 당첨이 불가능한가요?"
                a="아니요. 추첨제 비율이 일정 부분 있고, 신혼부부·생애최초·다자녀·노부모 부양 등 특별공급은 가점과 별도로 추첨됩니다. 가점이 낮을수록 추첨제·특별공급 위주로 노리고, 통장 유지·무주택 유지로 시간을 두면 가점은 자연 증가합니다."
              />
            </div>
          </section>

          <AdSlot id="ad-apt-bottom" variant="rectangle" />
        </main>

        <SideAdSlot id="ad-apt-side-right" side="right" />
      </div>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-500">
          <p>
            본 계산기는 국토교통부 주택공급규칙 기준 청약 가점 산정식이며, 단지별 자격 조건·우선
            순위는 한국부동산원 청약홈에서 별도로 확인하세요.
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
            <Link href="/year-end-tax" className="hover:text-brand">
              연말정산 계산기
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
