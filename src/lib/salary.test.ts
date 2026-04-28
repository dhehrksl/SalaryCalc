import { describe, it, expect } from "vitest";
import { calculateSalary, RATES, MEAL_NONTAX_MONTHLY_CAP } from "./salary";

const baseInput = {
  annualSalary: 0,
  monthlyNonTaxable: 0,
  dependents: 1,
  childrenAged8to20: 0,
};

describe("calculateSalary — 경계", () => {
  it("연봉 0이면 모든 값 0", () => {
    const r = calculateSalary({ ...baseInput });
    expect(r.monthlyTakeHome).toBe(0);
    expect(r.annualTakeHome).toBe(0);
    expect(r.insurance.total).toBe(0);
    expect(r.tax.determinedTax).toBe(0);
  });

  it("실수령 = 세전 - 4대보험 - 결정세 - 지방세", () => {
    const r = calculateSalary({ ...baseInput, annualSalary: 50_000_000 });
    const reconstructed =
      50_000_000 -
      r.insurance.total * 12 -
      r.tax.determinedTax -
      r.tax.localTax;
    expect(reconstructed).toBe(r.annualTakeHome);
  });

  it("부양가족 많을수록 세금 줄어듦", () => {
    const a = calculateSalary({ ...baseInput, annualSalary: 60_000_000, dependents: 1 });
    const b = calculateSalary({ ...baseInput, annualSalary: 60_000_000, dependents: 4 });
    expect(b.tax.determinedTax).toBeLessThan(a.tax.determinedTax);
    expect(b.annualTakeHome).toBeGreaterThan(a.annualTakeHome);
  });

  it("자녀세액공제 — 1명 25만, 2명 50만, 3명 85만", () => {
    const r1 = calculateSalary({ ...baseInput, annualSalary: 60_000_000, childrenAged8to20: 1 });
    const r2 = calculateSalary({ ...baseInput, annualSalary: 60_000_000, childrenAged8to20: 2 });
    const r3 = calculateSalary({ ...baseInput, annualSalary: 60_000_000, childrenAged8to20: 3 });
    expect(r1.tax.childTaxCredit).toBe(250_000);
    expect(r2.tax.childTaxCredit).toBe(500_000);
    expect(r3.tax.childTaxCredit).toBe(850_000);
  });

  it("비과세 식대 월 20만원 한도", () => {
    const a = calculateSalary({ ...baseInput, annualSalary: 60_000_000, monthlyNonTaxable: 200_000 });
    const b = calculateSalary({ ...baseInput, annualSalary: 60_000_000, monthlyNonTaxable: 500_000 });
    // 한도 초과해도 결과 동일해야 함
    expect(a.annualTakeHome).toBe(b.annualTakeHome);
    expect(a.tax.determinedTax).toBe(b.tax.determinedTax);
  });

  it("국민연금 기준소득월액 상한 적용", () => {
    // 월급이 상한(617만) 넘어가면 국민연금은 상한액 × 4.5%로 cap
    const r = calculateSalary({ ...baseInput, annualSalary: 200_000_000 });
    const expectedNP = Math.floor(RATES.pensionBaseUpper * RATES.nationalPension);
    expect(r.insurance.nationalPension).toBe(expectedNP);
  });
});

describe("calculateSalary — 실수령액 합리성 (다른 계산기 사이트와 ±5% 범위)", () => {
  // 참고: 잡코리아·사람인 등 주요 사이트의 결과 범위 (부양가족 1, 비과세 0).
  // 사이트별로 ±3% 차이가 일반적이라 윈도우는 ±5% 잡음.
  const cases: Array<{ annual: number; expectedMonthlyMin: number; expectedMonthlyMax: number }> = [
    { annual: 25_000_000, expectedMonthlyMin: 1_800_000, expectedMonthlyMax: 1_990_000 },
    { annual: 30_000_000, expectedMonthlyMin: 2_150_000, expectedMonthlyMax: 2_360_000 },
    { annual: 40_000_000, expectedMonthlyMin: 2_800_000, expectedMonthlyMax: 3_080_000 },
    { annual: 50_000_000, expectedMonthlyMin: 3_440_000, expectedMonthlyMax: 3_770_000 },
    { annual: 60_000_000, expectedMonthlyMin: 4_030_000, expectedMonthlyMax: 4_400_000 },
    { annual: 70_000_000, expectedMonthlyMin: 4_580_000, expectedMonthlyMax: 5_010_000 },
    { annual: 80_000_000, expectedMonthlyMin: 5_140_000, expectedMonthlyMax: 5_650_000 },
    { annual: 100_000_000, expectedMonthlyMin: 6_280_000, expectedMonthlyMax: 6_900_000 },
    { annual: 150_000_000, expectedMonthlyMin: 8_950_000, expectedMonthlyMax: 9_850_000 },
  ];

  cases.forEach(({ annual, expectedMonthlyMin, expectedMonthlyMax }) => {
    it(`연봉 ${annual.toLocaleString()}원 → 월 ${expectedMonthlyMin.toLocaleString()} ~ ${expectedMonthlyMax.toLocaleString()} 범위`, () => {
      const r = calculateSalary({ ...baseInput, annualSalary: annual });
      expect(r.monthlyTakeHome).toBeGreaterThanOrEqual(expectedMonthlyMin);
      expect(r.monthlyTakeHome).toBeLessThanOrEqual(expectedMonthlyMax);
    });
  });
});

describe("calculateSalary — 누진성", () => {
  it("연봉이 늘어나면 한계세율도 늘어남 (실수령 증가율 < 세전 증가율)", () => {
    const a = calculateSalary({ ...baseInput, annualSalary: 50_000_000 });
    const b = calculateSalary({ ...baseInput, annualSalary: 100_000_000 });
    const grossRatio = 100_000_000 / 50_000_000;
    const takeHomeRatio = b.annualTakeHome / a.annualTakeHome;
    expect(takeHomeRatio).toBeLessThan(grossRatio);
  });
});

describe("MEAL_NONTAX_MONTHLY_CAP", () => {
  it("식대 비과세 한도는 월 20만원", () => {
    expect(MEAL_NONTAX_MONTHLY_CAP).toBe(200_000);
  });
});

describe("calculateSalary — 사업주 부담분", () => {
  it("연봉 0이면 사업주 부담도 0", () => {
    const r = calculateSalary({ ...baseInput });
    expect(r.employerInsurance.total).toBe(0);
  });

  it("국민연금·건강·장기요양·고용 실업분은 근로자 부담과 동일", () => {
    const r = calculateSalary({ ...baseInput, annualSalary: 50_000_000 });
    expect(r.employerInsurance.nationalPension).toBe(r.insurance.nationalPension);
    expect(r.employerInsurance.healthInsurance).toBe(r.insurance.healthInsurance);
    expect(r.employerInsurance.longTermCare).toBe(r.insurance.longTermCare);
    expect(r.employerInsurance.employmentInsurance).toBe(r.insurance.employmentInsurance);
  });

  it("사업주는 고용안정·직업능력개발 0.25% 추가", () => {
    const r = calculateSalary({ ...baseInput, annualSalary: 50_000_000 });
    // 비과세 0이면 monthlyTaxableGross == monthlyGross
    const expected = Math.floor(r.monthlyTaxableGross * 0.0025);
    expect(r.employerInsurance.employmentStability).toBe(expected);
  });

  it("사업주 부담 합계 > 근로자 부담 합계 (고용안정 가산분만큼)", () => {
    const r = calculateSalary({ ...baseInput, annualSalary: 50_000_000 });
    expect(r.employerInsurance.total).toBeGreaterThan(r.insurance.total);
    expect(r.employerInsurance.total - r.insurance.total).toBe(
      r.employerInsurance.employmentStability,
    );
  });
});
