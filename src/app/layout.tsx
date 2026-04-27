import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "2026 연봉 실수령액 계산기 | 4대보험·소득세 한 번에",
    template: "%s | 연봉 실수령액 계산기",
  },
  description:
    "2026년 최신 4대보험료율과 근로소득세 간이세액표 기반으로 연봉 실수령액을 1초 만에 계산합니다. 부양가족·자녀·비과세 입력 지원.",
  keywords: [
    "연봉 실수령액",
    "연봉 계산기",
    "월급 계산기",
    "실수령액 계산",
    "4대보험 계산기",
    "근로소득세",
    "2026 연봉",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "연봉 실수령액 계산기",
    title: "2026 연봉 실수령액 계산기",
    description:
      "2026년 최신 세율 기준 연봉 실수령액·4대보험·소득세를 한 번에 계산하세요.",
  },
  twitter: {
    card: "summary",
    title: "2026 연봉 실수령액 계산기",
    description: "최신 세율 기준 1초 계산",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  verification: {
    google: "x66DRnGBmdW806wz2JSJemgr7sBQNNFE-wPVOslQCoU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
