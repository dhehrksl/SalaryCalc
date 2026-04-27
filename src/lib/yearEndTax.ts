/**
 * 연말정산 환급/추납 추정 — 단순화 모델
 *
 * 정확한 연말정산은 수십 가지 공제·세액공제 규정과 한도가 얽혀 있어 본 계산기는
 * 핵심 항목만 반영하는 추정치입니다 (실제 결과와 ±10% 오차).
 *
 * 흐름:
 *   총급여
 *     - 비과세
 *     - 근로소득공제          (소득세법 제47조)
 *     - 인적공제              (1인당 150만)
 *     - 4대보험료 소득공제     (실효 부담 추정)
 *     - 신용/체크/현금 사용 공제 (총급여 25% 초과분)
 *     = 과세표준
 *   × 누진세율 → 산출세액
 *     - 근로소득세액공제      (점진 감소)
 *     - 자녀세액공제
 *     - 보장성보험료 세액공제 (12%, 한도 100만 보험료)
 *     - 의료비 세액공제       (총급여 3% 초과분의 15%, 한도 700만)
 *     - 교육비 세액공제       (15%)
 *     - 기부금 세액공제       (15%, 1천만 초과 30%)
 *     - 연금저축/IRP 세액공제 (총급여 5,500만 이하 16.5%, 초과 13.2%, 한도 900만)
 *   = 결정세액 (지방세 10% 별도 가산)
 *
 *   환급액 = 기납부세액(매월 원천징수 합계) - 결정세액
 *     양수 → 환급, 음수 → 추가납부
 */

import { calculateSalary, RATES, MEAL_NONTAX_MONTHLY_CAP } from "./salary";

// 누진세율 — salary.ts와 동일
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

function applyTax(taxable: number): number {
  if (taxable <= 0) return 0;
  for (const b of TAX_BRACKETS) {
    if (taxable <= b.upTo) {
      return Math.max(0, Math.floor(taxable * b.rate - b.deduct));
    }
  }
  return 0;
}

export interface YearEndTaxInput {
  /** 세전 연봉 (원) */
  annualSalary: number;
  /** 월 비과세 (식대 등) */
  monthlyNonTaxable: number;
  /** 부양가족 수 (본인 포함) */
  dependents: number;
  /** 8~20세 자녀 수 */
  childrenAged8to20: number;
  /** 신용카드 연 사용액 */
  creditCardUsage: number;
  /** 체크카드·현금영수증 연 사용액 */
  debitCashUsage: number;
  /** 보장성보험료 연 납입액 (자동차/생명/건강 등) */
  insurancePremium: number;
  /** 의료비 연 지출액 (본인·부양가족) */
  medicalExpenses: number;
  /** 교육비 연 지출액 */
  educationExpenses: number;
  /** 기부금 연 지출액 */
  donations: number;
  /** 연금저축·IRP 연 납입액 */
  pensionSavings: number;
}

export interface YearEndTaxResult {
  /** 총급여 (비과세 제외) */
  taxableSalary: number;
  /** 근로소득공제 */
  earnedIncomeDeduction: number;
  /** 인적공제 */
  personalDeduction: number;
  /** 4대보험료 소득공제 */
  insuranceDeduction: number;
  /** 신용/체크/현금 사용 공제 */
  cardDeduction: number;
  /** 과세표준 */
  taxableIncome: number;
  /** 산출세액 */
  calculatedTax: number;
  /** 근로소득세액공제 */
  earnedTaxCredit: number;
  /** 자녀세액공제 */
  childTaxCredit: number;
  /** 보험료 세액공제 */
  insuranceCredit: number;
  /** 의료비 세액공제 */
  medicalCredit: number;
  /** 교육비 세액공제 */
  educationCredit: number;
  /** 기부금 세액공제 */
  donationCredit: number;
  /** 연금저축 세액공제 */
  pensionCredit: number;
  /** 결정세액 (소득세 + 지방세) */
  determinedTax: number;
  /** 기납부세액 추정 (매월 원천징수 합계) */
  prepaidTax: number;
  /** 환급액 — 양수면 환급, 음수면 추가납부 */
  refund: number;
}

function calcEarnedIncomeDeduction(grossAnnual: number): number {
  let d: number;
  if (grossAnnual <= 5_000_000) d = grossAnnual * 0.7;
  else if (grossAnnual <= 15_000_000)
    d = 3_500_000 + (grossAnnual - 5_000_000) * 0.4;
  else if (grossAnnual <= 45_000_000)
    d = 7_500_000 + (grossAnnual - 15_000_000) * 0.15;
  else if (grossAnnual <= 100_000_000)
    d = 12_000_000 + (grossAnnual - 45_000_000) * 0.05;
  else d = 14_750_000 + (grossAnnual - 100_000_000) * 0.02;
  return Math.min(d, 20_000_000);
}

function calcEarnedTaxCreditLimit(grossAnnual: number): number {
  if (grossAnnual <= 33_000_000) return 740_000;
  if (grossAnnual <= 70_000_000)
    return Math.max(660_000, 740_000 - (grossAnnual - 33_000_000) * 0.008);
  if (grossAnnual <= 120_000_000)
    return Math.max(500_000, 660_000 - (grossAnnual - 70_000_000) * 0.005);
  return Math.max(200_000, 500_000 - (grossAnnual - 120_000_000) * 0.005);
}

function calcChildTaxCredit(children: number): number {
  if (children <= 0) return 0;
  if (children === 1) return 250_000;
  if (children === 2) return 500_000;
  return 500_000 + (children - 2) * 350_000;
}

/**
 * 신용/체크/현금 사용 공제 — 총급여 25% 초과분에 대해 카드별 공제율 적용.
 * 한도: 총급여 7천만 이하 300만, 7천만~1.2억 250만, 1.2억 초과 200만
 */
function calcCardDeduction(
  grossAnnual: number,
  credit: number,
  debitCash: number,
): number {
  const threshold = grossAnnual * 0.25;
  const totalUsage = credit + debitCash;
  if (totalUsage <= threshold) return 0;

  const excess = totalUsage - threshold;
  // 단순화: 신용카드와 체크/현금이 비례적으로 초과분에 기여
  const creditRatio = totalUsage > 0 ? credit / totalUsage : 0;
  const debitRatio = totalUsage > 0 ? debitCash / totalUsage : 0;

  const rawDeduction = excess * (creditRatio * 0.15 + debitRatio * 0.3);

  let limit: number;
  if (grossAnnual <= 70_000_000) limit = 3_000_000;
  else if (grossAnnual <= 120_000_000) limit = 2_500_000;
  else limit = 2_000_000;

  return Math.min(Math.floor(rawDeduction), limit);
}

/** 연 4대보험료 소득공제 추정 (salary.ts에서 정확 계산) */
function estimateAnnualInsurance(monthlyTaxable: number): number {
  if (monthlyTaxable <= 0) return 0;
  const pensionBase = Math.min(
    Math.max(monthlyTaxable, RATES.pensionBaseLower),
    RATES.pensionBaseUpper,
  );
  const np = Math.floor(pensionBase * RATES.nationalPension);
  const hi = Math.floor(monthlyTaxable * RATES.healthInsurance);
  const ltc = Math.floor(hi * RATES.longTermCareOfHealth);
  const ei = Math.floor(monthlyTaxable * RATES.employmentInsurance);
  return (np + hi + ltc + ei) * 12;
}

export function calculateYearEndTax(input: YearEndTaxInput): YearEndTaxResult {
  const annualSalary = Math.max(0, Math.floor(input.annualSalary || 0));
  const monthlyNonTaxable = Math.max(0, Math.floor(input.monthlyNonTaxable || 0));
  const dependents = Math.max(1, Math.floor(input.dependents || 1));
  const children = Math.max(0, Math.floor(input.childrenAged8to20 || 0));
  const credit = Math.max(0, Math.floor(input.creditCardUsage || 0));
  const debitCash = Math.max(0, Math.floor(input.debitCashUsage || 0));
  const insurancePremium = Math.max(0, Math.floor(input.insurancePremium || 0));
  const medical = Math.max(0, Math.floor(input.medicalExpenses || 0));
  const education = Math.max(0, Math.floor(input.educationExpenses || 0));
  const donations = Math.max(0, Math.floor(input.donations || 0));
  const pension = Math.max(0, Math.floor(input.pensionSavings || 0));

  // 총급여 (비과세 제외)
  const effectiveNonTaxable = Math.min(monthlyNonTaxable, MEAL_NONTAX_MONTHLY_CAP);
  const taxableSalary = Math.max(0, annualSalary - effectiveNonTaxable * 12);
  const monthlyTaxable = Math.floor(taxableSalary / 12);

  // 소득공제 단계
  const earnedIncomeDeduction = Math.floor(calcEarnedIncomeDeduction(taxableSalary));
  const personalDeduction = dependents * 1_500_000;
  const insuranceDeduction = estimateAnnualInsurance(monthlyTaxable);
  const cardDeduction = calcCardDeduction(taxableSalary, credit, debitCash);

  const taxableIncome = Math.max(
    0,
    taxableSalary -
      earnedIncomeDeduction -
      personalDeduction -
      insuranceDeduction -
      cardDeduction,
  );

  const calculatedTax = applyTax(taxableIncome);

  // 세액공제
  // 근로소득세액공제
  let rawEarnedCredit: number;
  if (calculatedTax <= 1_300_000) rawEarnedCredit = calculatedTax * 0.55;
  else rawEarnedCredit = 715_000 + (calculatedTax - 1_300_000) * 0.3;
  const earnedTaxCredit = Math.floor(
    Math.min(rawEarnedCredit, calcEarnedTaxCreditLimit(taxableSalary)),
  );

  const childTaxCredit = calcChildTaxCredit(children);

  // 보장성보험료 — 한도 100만, 12%
  const insuranceCredit = Math.floor(Math.min(insurancePremium, 1_000_000) * 0.12);

  // 의료비 — 총급여 3% 초과분의 15%, 한도 700만
  const medicalThreshold = taxableSalary * 0.03;
  const medicalCredit = Math.floor(
    Math.max(0, Math.min(medical, 7_000_000) - medicalThreshold) * 0.15,
  );

  // 교육비 — 15%, 단순화로 한도 미적용
  const educationCredit = Math.floor(education * 0.15);

  // 기부금 — 1천만 이하 15%, 초과분 30%
  const donationCredit = Math.floor(
    donations <= 10_000_000
      ? donations * 0.15
      : 10_000_000 * 0.15 + (donations - 10_000_000) * 0.3,
  );

  // 연금저축/IRP — 총급여 5500만 이하 16.5%, 초과 13.2%, 한도 900만
  const pensionRate = taxableSalary <= 55_000_000 ? 0.165 : 0.132;
  const pensionCredit = Math.floor(Math.min(pension, 9_000_000) * pensionRate);

  const totalCredits =
    earnedTaxCredit +
    childTaxCredit +
    insuranceCredit +
    medicalCredit +
    educationCredit +
    donationCredit +
    pensionCredit;

  const incomeTax = Math.max(0, calculatedTax - totalCredits);
  const localTax = Math.floor(incomeTax * 0.1);
  const determinedTax = incomeTax + localTax;

  // 기납부세액 추정 — salary.ts의 매월 원천징수 모델 재사용
  const monthly = calculateSalary({
    annualSalary,
    monthlyNonTaxable,
    dependents,
    childrenAged8to20: children,
  });
  const prepaidTax = monthly.tax.determinedTax + monthly.tax.localTax;

  const refund = prepaidTax - determinedTax;

  return {
    taxableSalary,
    earnedIncomeDeduction,
    personalDeduction,
    insuranceDeduction,
    cardDeduction,
    taxableIncome,
    calculatedTax,
    earnedTaxCredit,
    childTaxCredit,
    insuranceCredit,
    medicalCredit,
    educationCredit,
    donationCredit,
    pensionCredit,
    determinedTax,
    prepaidTax,
    refund,
  };
}
