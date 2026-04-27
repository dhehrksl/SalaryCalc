/**
 * 시급/일급/주급/월급/연봉 양방향 변환.
 *
 * 한국 표준 통상임금 환산:
 *   - 1일 = 8시간 (법정 근로시간)
 *   - 1주 유급시간 = 40시간 + 유급 주휴 8시간 = 48시간
 *   - 1개월 유급시간 = 48 × 4.345주 ≈ 209시간
 *   - 1년 = 12개월
 *
 * 즉 월 통상임금 = 시급 × 209.
 */

export const HOURS_PER_DAY = 8;
export const PAID_HOURS_PER_WEEK = 48; // 40 + 주휴 8
export const PAID_HOURS_PER_MONTH = 209;
export const MONTHS_PER_YEAR = 12;

export type Unit = "hourly" | "daily" | "weekly" | "monthly" | "annual";

export interface HourlyResult {
  hourly: number;
  daily: number;
  weekly: number;
  monthly: number;
  annual: number;
}

/**
 * 입력 단위와 금액으로부터 시급을 도출한 뒤, 모든 단위로 환산해 반환.
 */
export function convertWage(amount: number, unit: Unit): HourlyResult {
  const value = Math.max(0, Math.floor(amount || 0));

  let hourly: number;
  switch (unit) {
    case "hourly":
      hourly = value;
      break;
    case "daily":
      hourly = value / HOURS_PER_DAY;
      break;
    case "weekly":
      hourly = value / PAID_HOURS_PER_WEEK;
      break;
    case "monthly":
      hourly = value / PAID_HOURS_PER_MONTH;
      break;
    case "annual":
      hourly = value / (PAID_HOURS_PER_MONTH * MONTHS_PER_YEAR);
      break;
  }

  // 시급은 소수점 버림 (원화 단위)
  const hourlyFloor = Math.floor(hourly);

  return {
    hourly: hourlyFloor,
    daily: Math.floor(hourly * HOURS_PER_DAY),
    weekly: Math.floor(hourly * PAID_HOURS_PER_WEEK),
    monthly: Math.floor(hourly * PAID_HOURS_PER_MONTH),
    annual: Math.floor(hourly * PAID_HOURS_PER_MONTH * MONTHS_PER_YEAR),
  };
}

/**
 * 한국 최저시급 — 정부 발표 기준
 * 2025년: 10,030원, 2026년: 10,320원 (참고용, 사용자 검증 권장)
 */
export const MINIMUM_WAGE = {
  2024: 9_860,
  2025: 10_030,
  2026: 10_320,
} as const;

/**
 * 시급이 최저시급 미만인지 판정 (가장 최근 연도 기준).
 */
export function isBelowMinimumWage(hourly: number, year: keyof typeof MINIMUM_WAGE = 2026): boolean {
  return hourly > 0 && hourly < MINIMUM_WAGE[year];
}
