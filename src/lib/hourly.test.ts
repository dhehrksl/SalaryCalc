import { describe, it, expect } from "vitest";
import { convertWage, isBelowMinimumWage, MINIMUM_WAGE } from "./hourly";

describe("convertWage — 시급 입력", () => {
  it("시급 10,000원 → 일급 80,000 / 주급 480,000 / 월급 2,090,000 / 연봉 25,080,000", () => {
    const r = convertWage(10_000, "hourly");
    expect(r.hourly).toBe(10_000);
    expect(r.daily).toBe(80_000);
    expect(r.weekly).toBe(480_000);
    expect(r.monthly).toBe(2_090_000);
    expect(r.annual).toBe(25_080_000);
  });

  it("시급 0 → 모두 0", () => {
    const r = convertWage(0, "hourly");
    expect(r.hourly).toBe(0);
    expect(r.monthly).toBe(0);
    expect(r.annual).toBe(0);
  });
});

describe("convertWage — 월급 입력", () => {
  it("월급 209만원 → 시급 10,000원 (정확히 209시간 기준)", () => {
    const r = convertWage(2_090_000, "monthly");
    expect(r.hourly).toBe(10_000);
    expect(r.monthly).toBe(2_090_000);
    expect(r.annual).toBe(25_080_000);
  });

  it("월급 300만원 → 시급 14,354원, 연봉 36,000,000원", () => {
    const r = convertWage(3_000_000, "monthly");
    expect(r.hourly).toBe(Math.floor(3_000_000 / 209));
    expect(r.annual).toBe(36_000_000);
  });
});

describe("convertWage — 연봉 입력", () => {
  it("연봉 5천만원 → 월급 약 416만원 → 시급 약 19,936원", () => {
    const r = convertWage(50_000_000, "annual");
    // 시급 = 50_000_000 / (209 × 12) = 19,936.x → floor 19,936
    expect(r.hourly).toBe(Math.floor(50_000_000 / (209 * 12)));
    // 월급 = 시급 × 209
    expect(r.monthly).toBe(Math.floor((50_000_000 / (209 * 12)) * 209));
    // 연봉 환산 결과는 시급 × 209 × 12 (반올림 손실 발생)
    expect(r.annual).toBeLessThanOrEqual(50_000_000);
  });
});

describe("convertWage — 일급/주급 입력", () => {
  it("일급 80,000원 → 시급 10,000원", () => {
    const r = convertWage(80_000, "daily");
    expect(r.hourly).toBe(10_000);
  });

  it("주급 480,000원 → 시급 10,000원 (48시간 기준)", () => {
    const r = convertWage(480_000, "weekly");
    expect(r.hourly).toBe(10_000);
  });
});

describe("convertWage — 음수 클램핑", () => {
  it("음수 입력 → 0 처리", () => {
    const r = convertWage(-50_000, "monthly");
    expect(r.hourly).toBe(0);
    expect(r.annual).toBe(0);
  });
});

describe("isBelowMinimumWage", () => {
  it("2026년 기준 9,000원은 미달", () => {
    expect(isBelowMinimumWage(9_000, 2026)).toBe(true);
  });

  it("2026년 기준 10,320원은 정상", () => {
    expect(isBelowMinimumWage(10_320, 2026)).toBe(false);
  });

  it("2026년 기준 0원은 false (입력 없음)", () => {
    expect(isBelowMinimumWage(0, 2026)).toBe(false);
  });

  it("최저시급 상수 존재", () => {
    expect(MINIMUM_WAGE[2026]).toBeGreaterThan(MINIMUM_WAGE[2025]);
  });
});
