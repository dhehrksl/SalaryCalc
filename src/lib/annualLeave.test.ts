import { describe, it, expect } from "vitest";
import { calculateAnnualLeave, calcAnnualLeaveDays } from "./annualLeave";

describe("calcAnnualLeaveDays — 발생 일수", () => {
  it("재직일수 0이면 0일", () => {
    const r = calcAnnualLeaveDays(0, 1.0);
    expect(r.days).toBe(0);
  });

  it("입사 6개월 (180일)이면 6일", () => {
    const r = calcAnnualLeaveDays(180, 1.0);
    expect(r.days).toBe(6);
  });

  it("입사 1년 미만 최대 11일", () => {
    const r = calcAnnualLeaveDays(360, 1.0);
    expect(r.days).toBe(11);
  });

  it("재직 1년 (365일) 8할 이상 → 15일", () => {
    const r = calcAnnualLeaveDays(365, 1.0);
    expect(r.days).toBe(15);
  });

  it("재직 3년 → 16일 (1일 가산)", () => {
    const r = calcAnnualLeaveDays(365 * 3, 1.0);
    expect(r.days).toBe(16);
  });

  it("재직 5년 → 17일", () => {
    const r = calcAnnualLeaveDays(365 * 5, 1.0);
    expect(r.days).toBe(17);
  });

  it("재직 21년 이상 → 상한 25일", () => {
    const r = calcAnnualLeaveDays(365 * 25, 1.0);
    expect(r.days).toBe(25);
  });

  it("출근율 80% 미만 → 0일 (월차 방식 별도)", () => {
    const r = calcAnnualLeaveDays(365 * 5, 0.5);
    expect(r.days).toBe(0);
  });
});

describe("calculateAnnualLeave — 통합", () => {
  const base = {
    startDate: "2020-01-01",
    asOfDate: "2025-01-01",
    attendanceRate: 1.0,
    monthlyOrdinaryWage: 0,
    usedDays: 0,
  };

  it("입력 잘못 → 모두 0", () => {
    const r = calculateAnnualLeave({ ...base, startDate: "", asOfDate: "" });
    expect(r.totalDays).toBe(0);
    expect(r.unusedAllowance).toBe(0);
  });

  it("재직 5년·통상임금 300만원·미사용 5일 → 수당 = 일급 × 5", () => {
    const r = calculateAnnualLeave({
      ...base,
      monthlyOrdinaryWage: 3_000_000,
      usedDays: 12,
    });
    // 5년차 = 17일, 사용 12일 → 미사용 5일
    expect(r.totalDays).toBe(17);
    expect(r.remainingDays).toBe(5);
    // 시급 = 3,000,000 / 209 = 14,354.x → floor 14,354
    // 일급 = 14,354 × 8 = 114,832
    // 수당 = 114,832 × 5 = 574,160
    expect(r.hourlyOrdinaryWage).toBe(Math.floor(3_000_000 / 209));
    expect(r.dailyOrdinaryWage).toBe(Math.floor(3_000_000 / 209) * 8);
    expect(r.unusedAllowance).toBe(r.dailyOrdinaryWage * 5);
  });

  it("사용 일수가 발생 일수보다 크면 발생분으로 캡 → 미사용 0", () => {
    const r = calculateAnnualLeave({
      ...base,
      monthlyOrdinaryWage: 3_000_000,
      usedDays: 100,
    });
    expect(r.usedDays).toBe(r.totalDays);
    expect(r.remainingDays).toBe(0);
    expect(r.unusedAllowance).toBe(0);
  });

  it("월 통상임금 0이면 수당 0 (일수만 안내)", () => {
    const r = calculateAnnualLeave({
      ...base,
      monthlyOrdinaryWage: 0,
      usedDays: 0,
    });
    expect(r.totalDays).toBeGreaterThan(0);
    expect(r.unusedAllowance).toBe(0);
  });

  it("음수·잘못된 입력 클램핑", () => {
    const r = calculateAnnualLeave({
      startDate: "2020-01-01",
      asOfDate: "2025-01-01",
      attendanceRate: -0.5,
      monthlyOrdinaryWage: -1_000_000,
      usedDays: -3,
    });
    expect(r.unusedAllowance).toBe(0);
    expect(r.usedDays).toBe(0);
  });
});
