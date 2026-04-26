/**
 * 한국 연봉 실수령액 계산 — 2025~2026년 시행 기준
 *
 * 출처:
 * - 국민연금공단 (기준소득월액 상·하한 2025.7~2026.6)
 * - 국민건강보험공단 (보험료율 2025년 동결)
 * - 고용보험 (근로자 부담 0.9%, 150인 미만 기준)
 * - 소득세법 제47조 (근로소득공제), 제55조 (세율), 제59조 (근로소득세액공제)
 *
 * 정부가 2026년 요율을 변경 발표하면 RATES 상수만 갱신.
 */

export const RATES = {
  // 국민연금 (근로자 부담)
  nationalPension: 0.045,
  pensionBaseUpper: 6_170_000, // 2025.7 ~ 2026.6 기준소득월액 상한
  pensionBaseLower: 390_000, // 기준소득월액 하한
  // 건강보험 (근로자 부담)
  healthInsurance: 0.03545,
  // 장기요양 = 건강보험료 × 12.95%
  longTermCareOfHealth: 0.1295,
  // 고용보험 (근로자 부담, 150인 미만 사업장 기준)
  employmentInsurance: 0.009,
} as const;

// 종합소득세율 — 누진공제 방식
const TAX_BRACKETS: Array<{ upTo: number; rate: number; deduct: number }> = [
  { upTo: 14_000_000, rate: 0.06, deduct: 0 },
  { upTo: 50_000_000, rate: 0.15, deduct: 1_260_000 },
  { upTo: 88_000_000, rate: 0.24, deduct: 5_760_000 },
  { upTo: 150_000_000, rate: 0.35, deduct: 15_440_000 },
  { upTo: 300_000_000, rate: 0.38, deduct: 19_940_000 },
  { upTo: 500_000_000, rate: 0.40, deduct: 25_940_000 },
  { upTo: 1_000_000_000, rate: 0.42, deduct: 35_940_000 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.45, deduct: 65_940_000 },
];

// 식대 비과세 한도 (월 20만원, 2023년 개정)
export const MEAL_NONTAX_MONTHLY_CAP = 200_000;

export interface CalcInput {
  /** 세전 연봉 (원). 정수, 0 이상 */
  annualSalary: number;
  /** 월 비과세 (식대 등). 식대는 월 20만원까지만 인정 */
  monthlyNonTaxable: number;
  /** 부양가족 수 (본인 포함). 1 이상 */
  dependents: number;
  /** 8~20세 자녀 수 */
  childrenAged8to20: number;
}

export interface InsuranceBreakdown {
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  total: number;
}

export interface TaxBreakdown {
  /** 근로소득공제 (연) */
  earnedIncomeDeduction: number;
  /** 인적공제 (연) */
  personalDeduction: number;
  /** 4대보험료 소득공제 (연) */
  insuranceDeduction: number;
  /** 과세표준 (연) */
  taxableIncome: number;
  /** 산출세액 (연, 누진세율 적용 후) */
  calculatedTax: number;
  /** 근로소득세액공제 (연) */
  earnedTaxCredit: number;
  /** 자녀세액공제 (연) */
  childTaxCredit: number;
  /** 결정세액 = 산출세액 - 세액공제 (연) */
  determinedTax: number;
  /** 지방소득세 = 결정세액 × 10% (연) */
  localTax: number;
  /** 월 근로소득세 */
  monthlyIncomeTax: number;
  /** 월 지방소득세 */
  monthlyLocalTax: number;
}

export interface CalcResult {
  /** 월 실수령액 */
  monthlyTakeHome: number;
  /** 연 실수령액 */
  annualTakeHome: number;
  /** 월 세전 (총 월급) */
  monthlyGross: number;
  /** 월 과세 대상 급여 (비과세 제외) */
  monthlyTaxableGross: number;
  /** 4대보험 (월 단위) */
  insurance: InsuranceBreakdown;
  /** 소득세 상세 */
  tax: TaxBreakdown;
}

function calcEarnedIncomeDeduction(grossAnnual: number): number {
  let d: number;
  if (grossAnnual <= 5_000_000) d = grossAnnual * 0.7;
  else if (grossAnnual <= 15_000_000) d = 3_500_000 + (grossAnnual - 5_000_000) * 0.4;
  else if (grossAnnual <= 45_000_000) d = 7_500_000 + (grossAnnual - 15_000_000) * 0.15;
  else if (grossAnnual <= 100_000_000) d = 12_000_000 + (grossAnnual - 45_000_000) * 0.05;
  else d = 14_750_000 + (grossAnnual - 100_000_000) * 0.02;
  return Math.min(d, 20_000_000); // 한도 2,000만원
}

function calcEarnedTaxCreditLimit(grossAnnual: number): number {
  // 소득세법 제59조 — 점진 감소식 (66만/50만/20만 floor)
  if (grossAnnual <= 33_000_000) return 740_000;
  if (grossAnnual <= 70_000_000) {
    return Math.max(660_000, 740_000 - (grossAnnual - 33_000_000) * 0.008);
  }
  if (grossAnnual <= 120_000_000) {
    return Math.max(500_000, 660_000 - (grossAnnual - 70_000_000) * 0.005);
  }
  return Math.max(200_000, 500_000 - (grossAnnual - 120_000_000) * 0.005);
}

function calcChildTaxCredit(children: number): number {
  if (children <= 0) return 0;
  if (children === 1) return 250_000;
  if (children === 2) return 500_000;
  // 셋째 이상 1명당 35만원 추가
  return 500_000 + (children - 2) * 350_000;
}

function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  for (const b of TAX_BRACKETS) {
    if (taxableIncome <= b.upTo) {
      return Math.max(0, Math.floor(taxableIncome * b.rate - b.deduct));
    }
  }
  return 0;
}

function calcInsurance(monthlyTaxable: number): InsuranceBreakdown {
  if (monthlyTaxable <= 0) {
    return {
      nationalPension: 0,
      healthInsurance: 0,
      longTermCare: 0,
      employmentInsurance: 0,
      total: 0,
    };
  }
  const pensionBase = Math.min(
    Math.max(monthlyTaxable, RATES.pensionBaseLower),
    RATES.pensionBaseUpper,
  );
  const nationalPension = Math.floor(pensionBase * RATES.nationalPension);
  const healthInsurance = Math.floor(monthlyTaxable * RATES.healthInsurance);
  const longTermCare = Math.floor(healthInsurance * RATES.longTermCareOfHealth);
  const employmentInsurance = Math.floor(monthlyTaxable * RATES.employmentInsurance);
  return {
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    total: nationalPension + healthInsurance + longTermCare + employmentInsurance,
  };
}

export function calculateSalary(input: CalcInput): CalcResult {
  const annualSalary = Math.max(0, Math.floor(input.annualSalary || 0));
  const monthlyNonTaxable = Math.max(0, Math.floor(input.monthlyNonTaxable || 0));
  const dependents = Math.max(1, Math.floor(input.dependents || 1));
  const childrenAged8to20 = Math.max(0, Math.floor(input.childrenAged8to20 || 0));

  // 비과세 (식대는 월 20만원까지)
  const effectiveNonTaxable = Math.min(monthlyNonTaxable, MEAL_NONTAX_MONTHLY_CAP);
  const annualNonTaxable = effectiveNonTaxable * 12;

  // 과세 총급여
  const taxableAnnual = Math.max(0, annualSalary - annualNonTaxable);
  const monthlyGross = Math.floor(annualSalary / 12);
  const monthlyTaxableGross = Math.floor(taxableAnnual / 12);

  // 4대보험 (월 과세급여 기준)
  const monthlyInsurance = calcInsurance(monthlyTaxableGross);
  const annualInsurance = monthlyInsurance.total * 12;

  // 소득공제
  const earnedIncomeDeduction = Math.floor(calcEarnedIncomeDeduction(taxableAnnual));
  const personalDeduction = dependents * 1_500_000;
  const insuranceDeduction = annualInsurance;
  const taxableIncome = Math.max(
    0,
    taxableAnnual - earnedIncomeDeduction - personalDeduction - insuranceDeduction,
  );

  // 산출세액
  const calculatedTax = calcIncomeTax(taxableIncome);

  // 근로소득세액공제
  let rawEarnedCredit: number;
  if (calculatedTax <= 1_300_000) {
    rawEarnedCredit = calculatedTax * 0.55;
  } else {
    rawEarnedCredit = 715_000 + (calculatedTax - 1_300_000) * 0.3;
  }
  const earnedTaxCredit = Math.floor(
    Math.min(rawEarnedCredit, calcEarnedTaxCreditLimit(taxableAnnual)),
  );

  const childTaxCredit = calcChildTaxCredit(childrenAged8to20);

  const determinedTax = Math.max(0, calculatedTax - earnedTaxCredit - childTaxCredit);
  const localTax = Math.floor(determinedTax * 0.1);

  const monthlyIncomeTax = Math.floor(determinedTax / 12);
  const monthlyLocalTax = Math.floor(localTax / 12);

  const annualTakeHome = annualSalary - annualInsurance - determinedTax - localTax;
  const monthlyTakeHome = Math.floor(annualTakeHome / 12);

  return {
    monthlyTakeHome,
    annualTakeHome,
    monthlyGross,
    monthlyTaxableGross,
    insurance: monthlyInsurance,
    tax: {
      earnedIncomeDeduction,
      personalDeduction,
      insuranceDeduction,
      taxableIncome,
      calculatedTax,
      earnedTaxCredit,
      childTaxCredit,
      determinedTax,
      localTax,
      monthlyIncomeTax,
      monthlyLocalTax,
    },
  };
}

// 표시용 헬퍼
export function formatKRW(n: number): string {
  return new Intl.NumberFormat("ko-KR").format(Math.round(n));
}
export function formatPercent(n: number, fractionDigits = 2): string {
  return `${(n * 100).toFixed(fractionDigits)}%`;
}
