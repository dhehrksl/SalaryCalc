import { describe, it, expect } from "vitest";
import {
  calculateAptScore,
  calcHomelessScore,
  calcDependentsScore,
  calcAccountScore,
  SCORE_CAP,
} from "./aptScore";

describe("calcHomelessScore — 무주택 기간 점수", () => {
  it("0년 → 1년 미만 2점", () => {
    expect(calcHomelessScore(0)).toBe(2);
    expect(calcHomelessScore(0.5)).toBe(2);
  });

  it("1년 → 4점", () => {
    expect(calcHomelessScore(1)).toBe(4);
  });

  it("5년 → 12점", () => {
    expect(calcHomelessScore(5)).toBe(12);
  });

  it("15년 이상 → 상한 32점", () => {
    expect(calcHomelessScore(15)).toBe(32);
    expect(calcHomelessScore(30)).toBe(32);
  });

  it("음수/잘못된 입력 → 0", () => {
    expect(calcHomelessScore(-1)).toBe(0);
    expect(calcHomelessScore(NaN)).toBe(0);
  });
});

describe("calcDependentsScore — 부양가족 점수", () => {
  it("0명 → 기본 5점", () => {
    expect(calcDependentsScore(0)).toBe(5);
  });

  it("1명 → 10점", () => {
    expect(calcDependentsScore(1)).toBe(10);
  });

  it("3명 → 20점", () => {
    expect(calcDependentsScore(3)).toBe(20);
  });

  it("6명 이상 → 상한 35점", () => {
    expect(calcDependentsScore(6)).toBe(35);
    expect(calcDependentsScore(10)).toBe(35);
  });

  it("음수 → 기본 5점", () => {
    expect(calcDependentsScore(-1)).toBe(5);
  });
});

describe("calcAccountScore — 청약통장 가입 점수", () => {
  it("6개월 미만 → 1점", () => {
    expect(calcAccountScore(0)).toBe(1);
    expect(calcAccountScore(0.4)).toBe(1);
  });

  it("6개월~1년 → 2점", () => {
    expect(calcAccountScore(0.5)).toBe(2);
    expect(calcAccountScore(0.9)).toBe(2);
  });

  it("1년 → 3점", () => {
    expect(calcAccountScore(1)).toBe(3);
  });

  it("5년 → 7점", () => {
    expect(calcAccountScore(5)).toBe(7);
  });

  it("15년 이상 → 상한 17점", () => {
    expect(calcAccountScore(15)).toBe(17);
    expect(calcAccountScore(25)).toBe(17);
  });
});

describe("calculateAptScore — 통합", () => {
  it("만점 84점 — 15년 무주택 + 6명 부양 + 15년 통장", () => {
    const r = calculateAptScore({
      homelessYears: 15,
      dependents: 6,
      accountYears: 15,
    });
    expect(r.homelessScore).toBe(32);
    expect(r.dependentsScore).toBe(35);
    expect(r.accountScore).toBe(17);
    expect(r.totalScore).toBe(84);
    expect(r.grade).toContain("최상위");
  });

  it("일반 케이스 — 5년 무주택 + 자녀 2명(부양 3명) + 5년 통장 = 12 + 20 + 7 = 39", () => {
    const r = calculateAptScore({
      homelessYears: 5,
      dependents: 3,
      accountYears: 5,
    });
    expect(r.totalScore).toBe(39);
    expect(r.grade).toContain("초기");
  });

  it("총점이 항목 점수의 합과 일치", () => {
    const r = calculateAptScore({
      homelessYears: 8,
      dependents: 2,
      accountYears: 3,
    });
    expect(r.totalScore).toBe(r.homelessScore + r.dependentsScore + r.accountScore);
  });

  it("등급 경계 — 60점 상위권, 70점+ 최상위", () => {
    // 무주택 13년 28점 + 부양 4명 25점 + 통장 5년 7점 = 60
    const r60 = calculateAptScore({ homelessYears: 13, dependents: 4, accountYears: 5 });
    expect(r60.totalScore).toBe(60);
    expect(r60.grade).toContain("상위");

    const r70 = calculateAptScore({ homelessYears: 15, dependents: 4, accountYears: 12 });
    expect(r70.totalScore).toBeGreaterThanOrEqual(70);
    expect(r70.grade).toContain("최상위");
  });

  it("SCORE_CAP 합 = 84", () => {
    expect(SCORE_CAP.homeless + SCORE_CAP.dependents + SCORE_CAP.account).toBe(SCORE_CAP.total);
  });
});
