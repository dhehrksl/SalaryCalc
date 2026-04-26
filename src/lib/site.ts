/**
 * 사이트 베이스 URL 결정 우선순위:
 *   1) NEXT_PUBLIC_SITE_URL — 사용자가 명시적으로 등록한 커스텀 도메인
 *   2) VERCEL_PROJECT_PRODUCTION_URL — Vercel이 빌드 시 자동 주입하는 production 도메인
 *   3) placeholder — 로컬 빌드 등 fallback
 *
 * 커스텀 도메인 연결 후에는 1) 환경변수만 갱신하면 됨.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProd) return `https://${vercelProd.replace(/^https?:\/\//, "")}`;

  return "https://salary-calc.example.com";
}

export const SITE_URL = getSiteUrl();
