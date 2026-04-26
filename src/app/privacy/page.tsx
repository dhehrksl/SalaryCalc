import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "연봉 실수령액 계산기의 개인정보 수집·이용·광고 정책 안내",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-base font-bold text-brand sm:text-lg">
            ← 연봉 실수령액 계산기
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-extrabold text-slate-900">개인정보처리방침</h1>
        <p className="mb-8 text-sm text-slate-500">
          최종 업데이트: 2026-04-27
        </p>

        <Section title="1. 개인정보 수집 항목 및 이용">
          <p>
            본 사이트는 회원가입 절차가 없으며, 사용자가 입력한 연봉·부양가족 등의 정보는 <strong>전적으로 사용자의 브라우저 안에서만 처리</strong>되고 서버에 저장·전송되지 않습니다. 따라서 개인을 식별할 수 있는 정보는 수집하지 않습니다.
          </p>
        </Section>

        <Section title="2. 자동 수집 정보 (분석 및 통계 목적)">
          <p>
            방문자 통계와 사이트 개선을 위해 다음 정보가 자동 수집될 수 있습니다.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>접속 기기 정보 (브라우저 종류, 운영체제, 기기 유형)</li>
            <li>방문 일시 및 페이지 이동 경로</li>
            <li>접속 IP의 일부 (지역 통계 목적, 식별 정보로 저장하지 않음)</li>
            <li>유입 검색어 또는 추천 사이트 (Referrer)</li>
          </ul>
          <p className="mt-2">
            이 정보는 Google Analytics 등 통계 도구를 통해 익명으로 집계되며, 개별 사용자를 식별하는 용도로 사용되지 않습니다.
          </p>
        </Section>

        <Section title="3. 광고 게재 및 쿠키 사용">
          <p>
            본 사이트는 운영 비용 충당을 위해 Google AdSense 등 제3자 광고 네트워크의 광고를 게재할 수 있습니다. 이러한 광고 제공자는 사용자의 관심사에 맞는 광고를 노출하기 위해 다음 정보를 활용할 수 있습니다.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>쿠키 (Cookies) 또는 광고 식별자(Advertising ID)</li>
            <li>방문한 페이지·검색어 등 비식별 행동 정보</li>
            <li>대략적 위치 정보 (도시 단위)</li>
          </ul>
          <p className="mt-2">
            Google의 광고 쿠키 사용은{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline"
            >
              Google 광고 정책
            </a>
            을 따르며, 사용자는{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline"
            >
              Google 광고 설정
            </a>
            에서 맞춤 광고를 비활성화할 수 있습니다.
          </p>
        </Section>

        <Section title="4. 쿠키 거부 방법">
          <p>
            사용자는 브라우저 설정에서 모든 쿠키를 거부하거나, 광고용 쿠키만 선택적으로 차단할 수 있습니다. 단, 쿠키를 거부할 경우 일부 기능 사용에 제약이 있을 수 있습니다.
          </p>
        </Section>

        <Section title="5. 개인정보 보호책임자 및 연락처">
          <p>
            본 사이트와 관련된 개인정보 관련 문의 및 신고는 사이트 운영자에게 문의하시기 바랍니다.
          </p>
          <p className="mt-2 text-slate-500">
            ※ 이메일은 운영자 정보 등록 후 이곳에 표기됩니다.
          </p>
        </Section>

        <Section title="6. 정책 변경">
          <p>
            본 개인정보처리방침은 법령 및 정책 변경에 따라 수정될 수 있으며, 변경 시 본 페이지를 통해 공지합니다.
          </p>
        </Section>

        <div className="mt-10 text-center">
          <Link href="/" className="text-sm text-brand hover:underline">
            ← 계산기로 돌아가기
          </Link>
        </div>
      </main>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 text-sm leading-relaxed text-slate-700">
      <h2 className="mb-2 text-base font-bold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}
