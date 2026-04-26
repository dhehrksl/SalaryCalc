import { FAQ_ITEMS } from "./Faq";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://salary-calc.example.com";

export default function StructuredData() {
  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "연봉 실수령액 계산기",
    url: SITE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    inLanguage: "ko",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    description:
      "2026년 4대보험·소득세 기준으로 연봉 실수령액과 월 공제액을 즉시 계산하는 무료 계산기.",
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
