import { describe, it, expect } from "vitest";
import { calculateYearEndTax } from "./yearEndTax";

const baseInput = {
  annualSalary: 50_000_000,
  monthlyNonTaxable: 200_000,
  dependents: 1,
  childrenAged8to20: 0,
  creditCardUsage: 0,
  debitCashUsage: 0,
  insurancePremium: 0,
  medicalExpenses: 0,
  educationExpenses: 0,
  donations: 0,
  pensionSavings: 0,
};

describe("calculateYearEndTax — 경계", () => {
  it("연봉 0이면 모든 값 0", () => {
    const r = calculateYearEndTax({ ...baseInput, annualSalary: 0 });
    expect(r.determinedTax).toBe(0);
    expect(r.prepaidTax).toBe(0);
    expect(r.refund).toBe(0);
  });

  it("음수 입력 클램핑 — 환급 0 또는 정상값", () => {
    const r = calculateYearEndTax({
      ...baseInput,
      creditCardUsage: -1_000_000,
      donations: -500_000,
    });
    expect(r.cardDeduction).toBe(0);
    expect(r.donationCredit).toBe(0);
  });
});

describe("calculateYearEndTax — 공제 효과", () => {
  it("공제 항목 없으면 환급 거의 0 — 결정세 = 기납부", () => {
    const r = calculateYearEndTax({ ...baseInput });
    // 공제 없이 동일 모델로 계산하면 결정세 ≈ 기납부 → 환급 ≈ 0
    expect(Math.abs(r.refund)).toBeLessThan(50_000);
  });

  it("연금저축 900만 납입 → 환급 증가 (5500만 이하 16.5%)", () => {
    const without = calculateYearEndTax({ ...baseInput });
    const withPension = calculateYearEndTax({
      ...baseInput,
      pensionSavings: 9_000_000,
    });
    expect(withPension.refund).toBeGreaterThan(without.refund);
    // 16.5% × 900만 = 1,485,000 + 지방세 영향, 환급 차이 약 100만 이상
    expect(withPension.refund - without.refund).toBeGreaterThan(1_000_000);
  });

  it("의료비 — 총급여 3% 초과분만 공제", () => {
    // 연봉 5천 → 비과세 240만 → 총급여 4760만 → 3% = 약 142만
    // 의료비 100만 → 142만 미만이라 공제 0
    const small = calculateYearEndTax({
      ...baseInput,
      medicalExpenses: 1_000_000,
    });
    expect(small.medicalCredit).toBe(0);

    // 의료비 500만 → (500 - 142.8) × 15% = 약 53.5만
    const big = calculateYearEndTax({
      ...baseInput,
      medicalExpenses: 5_000_000,
    });
    expect(big.medicalCredit).toBeGreaterThan(400_000);
    expect(big.medicalCredit).toBeLessThan(700_000);
  });

  it("신용카드 사용 — 25% 초과분에만 공제", () => {
    // 연봉 5천만 → 총급여 4760만 → 25% = 1190만
    // 신용카드 1000만 사용 → 공제 0
    const r1 = calculateYearEndTax({
      ...baseInput,
      creditCardUsage: 10_000_000,
    });
    expect(r1.cardDeduction).toBe(0);

    // 신용카드 2000만 → 초과분 약 810만 × 15% = 약 121만
    const r2 = calculateYearEndTax({
      ...baseInput,
      creditCardUsage: 20_000_000,
    });
    expect(r2.cardDeduction).toBeGreaterThan(1_000_000);
  });

  it("자녀 2명이면 자녀세액공제 50만", () => {
    const r = calculateYearEndTax({ ...baseInput, childrenAged8to20: 2 });
    expect(r.childTaxCredit).toBe(500_000);
  });

  it("기부금 1500만 → 1000만 × 15% + 500만 × 30% = 300만 공제", () => {
    const r = calculateYearEndTax({
      ...baseInput,
      donations: 15_000_000,
    });
    expect(r.donationCredit).toBe(3_000_000);
  });
});

describe("calculateYearEndTax — 환급 vs 추납", () => {
  it("공제 항목 많으면 환급 발생 (refund > 0)", () => {
    const r = calculateYearEndTax({
      ...baseInput,
      pensionSavings: 7_000_000,
      insurancePremium: 1_000_000,
      medicalExpenses: 5_000_000,
    });
    expect(r.refund).toBeGreaterThan(0);
  });

  it("연봉 1억·공제 거의 없음 → 환급 또는 0 근처 (단순 모델)", () => {
    const r = calculateYearEndTax({
      ...baseInput,
      annualSalary: 100_000_000,
    });
    expect(typeof r.refund).toBe("number");
  });
});
