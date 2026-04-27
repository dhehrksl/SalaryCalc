/**
 * 한국 퇴직금 계산 — 근로자퇴직급여보장법 기준
 *
 * 핵심 산식:
 *   1일 평균임금 = 직전 3개월 임금 총액 / 직전 3개월 일수
 *   평균임금 가산분 = (직전 1년 상여금 × 3/12 + 직전 1년 연차수당 × 3/12) / 직전 3개월 일수
 *   퇴직금 = (1일 평균임금 + 가산분) × 30일 × (재직일수 / 365)
 *
 * 1년 미만 근속자는 법정 지급 대상이 아니므로 0원.
 *
 * 퇴직소득세는 별도 누진세율(이연·환산급여 방식)이며 정확 계산은 매우 복잡하므로
 * 본 함수는 "퇴직금 산정"에 집중하고 세금은 대략 추정만 제공.
 */

export interface RetirementInput {
  /** 입사일 (YYYY-MM-DD) */
  startDate: string;
  /** 퇴사일 (YYYY-MM-DD). 마지막 근무일 다음 날 = 퇴사일 */
  endDate: string;
  /** 직전 3개월 동안 받은 임금 총액 (원). 기본급 + 고정수당 포함 */
  last3MonthsWage: number;
  /** 직전 1년 상여금 총액 (원). 정기 상여만 — 일회성 인센티브는 제외 */
  annualBonus: number;
  /** 직전 1년 미사용 연차수당 (원) */
  annualLeaveAllowance: number;
}

export interface RetirementResult {
  /** 재직일수 */
  workingDays: number;
  /** 재직 연수 (소수점 포함) */
  workingYears: number;
  /** 1일 평균임금 (원) */
  avgDailyWage: number;
  /** 상여·연차수당 가산분 (1일분, 원) */
  dailyAddition: number;
  /** 평균임금 합계 = 1일 평균임금 + 가산분 (원) */
  totalAvgDailyWage: number;
  /** 퇴직금 (원) */
  severancePay: number;
  /** 1년 미만 등 사유로 지급 대상 아님 */
  notEligible: boolean;
  /** 퇴직소득세 추정 (원) — 매우 단순 근사 */
  estimatedTax: number;
  /** 세후 수령 추정 (원) */
  afterTaxAmount: number;
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
 * 직전 3개월 일수 — 퇴사일 기준 3개월 전부터 퇴사 전날까지의 달력 일수
 * (예: 7/1 입사~12/31 퇴사 → 직전 3개월은 10/1~12/30, 91일 또는 92일)
 */
function daysInLast3Months(endDate: Date): number {
  const start = new Date(
    Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth() - 3, endDate.getUTCDate()),
  );
  return Math.round((endDate.getTime() - start.getTime()) / MS_PER_DAY);
}

export function calculateRetirement(input: RetirementInput): RetirementResult {
  const start = parseDateUTC(input.startDate);
  const end = parseDateUTC(input.endDate);

  const last3 = Math.max(0, Math.floor(input.last3MonthsWage || 0));
  const bonus = Math.max(0, Math.floor(input.annualBonus || 0));
  const leave = Math.max(0, Math.floor(input.annualLeaveAllowance || 0));

  if (!start || !end || end.getTime() <= start.getTime()) {
    return {
      workingDays: 0,
      workingYears: 0,
      avgDailyWage: 0,
      dailyAddition: 0,
      totalAvgDailyWage: 0,
      severancePay: 0,
      notEligible: true,
      estimatedTax: 0,
      afterTaxAmount: 0,
    };
  }

  const workingDays = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
  const workingYears = workingDays / 365;

  // 1년 미만은 법정 퇴직금 미지급
  if (workingDays < 365) {
    return {
      workingDays,
      workingYears,
      avgDailyWage: 0,
      dailyAddition: 0,
      totalAvgDailyWage: 0,
      severancePay: 0,
      notEligible: true,
      estimatedTax: 0,
      afterTaxAmount: 0,
    };
  }

  const last3Days = daysInLast3Months(end);
  const avgDailyWage = last3Days > 0 ? last3 / last3Days : 0;

  // 상여·연차수당 1년치를 3개월분(3/12)만큼 평균임금에 산입한 뒤 일할 환산
  const additionTotal = (bonus + leave) * (3 / 12);
  const dailyAddition = last3Days > 0 ? additionTotal / last3Days : 0;

  const totalAvgDailyWage = avgDailyWage + dailyAddition;

  const severancePay = Math.floor(totalAvgDailyWage * 30 * (workingDays / 365));

  // 퇴직소득세 매우 단순 근사 — 환산급여 6% 가정 + 지방세 10%
  // 실제는 근속연수공제·환산급여공제·누진세율로 계산. 사용자에게 "추정치"라고 명시.
  const estimatedTax = Math.floor(severancePay * 0.06 * 1.1);
  const afterTaxAmount = severancePay - estimatedTax;

  return {
    workingDays,
    workingYears,
    avgDailyWage: Math.floor(avgDailyWage),
    dailyAddition: Math.floor(dailyAddition),
    totalAvgDailyWage: Math.floor(totalAvgDailyWage),
    severancePay,
    notEligible: false,
    estimatedTax,
    afterTaxAmount,
  };
}
