/**
 * 한국 연차휴가·연차수당 계산 — 근로기준법 제60조 기준
 *
 * 연차 발생 규칙:
 *   - 1년 미만: 1개월 개근 시 1일씩, 최대 11일
 *   - 1년 이상 출근율 80% 이상: 15일
 *   - 3년 이상부터 매 2년마다 1일 추가, 최대 25일 (21년차에 도달)
 *   - 출근율 80% 미만: 1개월 개근 시 1일 (월차 방식)
 *
 * 연차수당 계산:
 *   통상시급 = 월 통상임금 / 209시간 (주 40시간 + 유급주휴 8시간 × 4.345주)
 *   1일 통상임금 = 통상시급 × 8시간
 *   미사용 연차수당 = 1일 통상임금 × 미사용 연차일수
 */

export const STANDARD_MONTHLY_HOURS = 209;
export const DAILY_HOURS = 8;
export const MAX_ANNUAL_LEAVE_DAYS = 25;

export interface AnnualLeaveInput {
  /** 입사일 (YYYY-MM-DD) */
  startDate: string;
  /** 기준일 (YYYY-MM-DD) — 보통 오늘 또는 회계연도 말일 */
  asOfDate: string;
  /** 출근율 (0~1). 1년 미만 또는 8할 미만일 때 영향 */
  attendanceRate: number;
  /** 월 통상임금 (원) — 기본급 + 고정수당. 0이면 수당 미산출 */
  monthlyOrdinaryWage: number;
  /** 사용한 연차일수 (이미 쓴 일수). 미사용분 = 발생분 - 사용분 */
  usedDays: number;
}

export interface AnnualLeaveResult {
  /** 재직 일수 */
  workingDays: number;
  /** 재직 연수 (소수) */
  workingYears: number;
  /** 발생한 연차 일수 */
  totalDays: number;
  /** 사용한 일수 (입력 그대로, 발생분 초과 시 발생분으로 캡) */
  usedDays: number;
  /** 미사용 일수 */
  remainingDays: number;
  /** 통상시급 (원, 소수점 버림) */
  hourlyOrdinaryWage: number;
  /** 1일 통상임금 (원) */
  dailyOrdinaryWage: number;
  /** 미사용 연차수당 (원) */
  unusedAllowance: number;
  /** 안내 메시지 (예: 1년 미만 케이스 설명) */
  note: string;
}

const MS_PER_DAY = 86_400_000;

function parseDateUTC(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== mo - 1 ||
    date.getUTCDate() !== d
  ) {
    return null;
  }
  return date;
}

/**
 * 발생 연차 일수 산출.
 * 1년 미만: 만월 개근 1일씩, 최대 11일
 * 1년 이상 8할 이상: 15 + floor((years-1)/2), 최대 25
 * 1년 이상 8할 미만: 0 (월차 방식은 단순화)
 */
export function calcAnnualLeaveDays(
  workingDays: number,
  attendanceRate: number,
): { days: number; note: string } {
  if (workingDays <= 0) {
    return { days: 0, note: "재직 기간이 없거나 입력값이 잘못되었습니다." };
  }

  // 만월(완전한 달) 개수 — 30일 단위 근사. 정확히는 입사 응당월 기준이지만 UI 단순화.
  if (workingDays < 365) {
    const fullMonths = Math.floor(workingDays / 30);
    const days = Math.min(11, Math.max(0, fullMonths));
    return {
      days,
      note: `재직 1년 미만 — 만 1개월 개근마다 1일씩 발생 (최대 11일). 현재 ${fullMonths}개월 만근 기준.`,
    };
  }

  // 1년 이상
  if (attendanceRate < 0.8) {
    return {
      days: 0,
      note: "출근율이 80% 미만이면 익년 연차(15일+)가 발생하지 않습니다. 만월 개근별 월차로 별도 산정됩니다.",
    };
  }

  const years = workingDays / 365;
  const wholeYears = Math.floor(years);
  // 3년차부터 가산: floor((년수 - 1) / 2)
  const additional = Math.max(0, Math.floor((wholeYears - 1) / 2));
  const days = Math.min(MAX_ANNUAL_LEAVE_DAYS, 15 + additional);

  let note = `재직 ${wholeYears}년차 — 기본 15일`;
  if (additional > 0) {
    note += ` + 가산 ${additional}일 = ${days}일`;
  }
  if (days >= MAX_ANNUAL_LEAVE_DAYS) {
    note += " (법정 상한 25일 도달)";
  }
  return { days, note };
}

export function calculateAnnualLeave(input: AnnualLeaveInput): AnnualLeaveResult {
  const start = parseDateUTC(input.startDate);
  const asOf = parseDateUTC(input.asOfDate);
  const attendanceRate = Math.max(0, Math.min(1, input.attendanceRate));
  const monthlyWage = Math.max(0, Math.floor(input.monthlyOrdinaryWage || 0));
  const usedRaw = Math.max(0, Math.floor(input.usedDays || 0));

  if (!start || !asOf || asOf.getTime() <= start.getTime()) {
    return {
      workingDays: 0,
      workingYears: 0,
      totalDays: 0,
      usedDays: 0,
      remainingDays: 0,
      hourlyOrdinaryWage: 0,
      dailyOrdinaryWage: 0,
      unusedAllowance: 0,
      note: "입사일과 기준일을 정확히 입력해주세요.",
    };
  }

  const workingDays = Math.round((asOf.getTime() - start.getTime()) / MS_PER_DAY);
  const workingYears = workingDays / 365;

  const { days: totalDays, note } = calcAnnualLeaveDays(workingDays, attendanceRate);

  const usedDays = Math.min(usedRaw, totalDays);
  const remainingDays = Math.max(0, totalDays - usedDays);

  const hourlyOrdinaryWage =
    monthlyWage > 0 ? Math.floor(monthlyWage / STANDARD_MONTHLY_HOURS) : 0;
  const dailyOrdinaryWage = hourlyOrdinaryWage * DAILY_HOURS;
  const unusedAllowance = dailyOrdinaryWage * remainingDays;

  return {
    workingDays,
    workingYears,
    totalDays,
    usedDays,
    remainingDays,
    hourlyOrdinaryWage,
    dailyOrdinaryWage,
    unusedAllowance,
    note,
  };
}
