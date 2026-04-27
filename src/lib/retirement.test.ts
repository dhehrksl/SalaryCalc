import { describe, it, expect } from "vitest";
import { calculateRetirement } from "./retirement";

describe("calculateRetirement — 경계", () => {
  it("입사일/퇴사일이 잘못되면 not eligible", () => {
    const r = calculateRetirement({
      startDate: "",
      endDate: "",
      last3MonthsWage: 0,
      annualBonus: 0,
      annualLeaveAllowance: 0,
    });
    expect(r.notEligible).toBe(true);
    expect(r.severancePay).toBe(0);
  });

  it("퇴사일이 입사일보다 빠르면 not eligible", () => {
    const r = calculateRetirement({
      startDate: "2025-01-01",
      endDate: "2024-12-31",
      last3MonthsWage: 9_000_000,
      annualBonus: 0,
      annualLeaveAllowance: 0,
    });
    expect(r.notEligible).toBe(true);
  });

  it("재직 1년 미만이면 퇴직금 0원 (법정 미지급 대상)", () => {
    const r = calculateRetirement({
      startDate: "2025-01-01",
      endDate: "2025-06-30",
      last3MonthsWage: 9_000_000,
      annualBonus: 0,
      annualLeaveAllowance: 0,
    });
    expect(r.notEligible).toBe(true);
    expect(r.severancePay).toBe(0);
    expect(r.workingDays).toBeGreaterThan(0);
  });
});

describe("calculateRetirement — 표준 케이스", () => {
  it("월급 300만원 × 1년 근무 → 약 300만원 퇴직금 (오차 5% 이내)", () => {
    // 1년 근무, 직전 3개월 임금 900만원 (월 300만원)
    const r = calculateRetirement({
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      last3MonthsWage: 9_000_000,
      annualBonus: 0,
      annualLeaveAllowance: 0,
    });
    expect(r.notEligible).toBe(false);
    expect(r.severancePay).toBeGreaterThan(2_900_000);
    expect(r.severancePay).toBeLessThan(3_100_000);
  });

  it("근속 연수 비례 — 5년이면 약 5배", () => {
    const r1 = calculateRetirement({
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      last3MonthsWage: 9_000_000,
      annualBonus: 0,
      annualLeaveAllowance: 0,
    });
    const r5 = calculateRetirement({
      startDate: "2020-01-01",
      endDate: "2025-01-01",
      last3MonthsWage: 9_000_000,
      annualBonus: 0,
      annualLeaveAllowance: 0,
    });
    expect(r5.severancePay / r1.severancePay).toBeGreaterThan(4.9);
    expect(r5.severancePay / r1.severancePay).toBeLessThan(5.1);
  });

  it("상여금·연차수당이 추가되면 퇴직금 증가", () => {
    const base = calculateRetirement({
      startDate: "2020-01-01",
      endDate: "2025-01-01",
      last3MonthsWage: 9_000_000,
      annualBonus: 0,
      annualLeaveAllowance: 0,
    });
    const withBonus = calculateRetirement({
      startDate: "2020-01-01",
      endDate: "2025-01-01",
      last3MonthsWage: 9_000_000,
      annualBonus: 6_000_000,
      annualLeaveAllowance: 1_500_000,
    });
    expect(withBonus.severancePay).toBeGreaterThan(base.severancePay);
  });

  it("세후 = 퇴직금 - 추정 세금", () => {
    const r = calculateRetirement({
      startDate: "2020-01-01",
      endDate: "2025-01-01",
      last3MonthsWage: 9_000_000,
      annualBonus: 0,
      annualLeaveAllowance: 0,
    });
    expect(r.afterTaxAmount).toBe(r.severancePay - r.estimatedTax);
  });

  it("음수 입력은 0으로 클램핑", () => {
    const r = calculateRetirement({
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      last3MonthsWage: -1_000_000,
      annualBonus: -500_000,
      annualLeaveAllowance: -100_000,
    });
    expect(r.severancePay).toBe(0);
  });
});
