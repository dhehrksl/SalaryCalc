/**
 * 주택청약 가점 계산 — 국토교통부 주택공급규칙 기준
 *
 * 총 84점 만점 (3개 항목 합산):
 *   1) 무주택 기간          — 32점
 *   2) 부양가족 수          — 35점
 *   3) 청약통장 가입 기간   — 17점
 *
 * 점수 산정 규칙:
 *   - 무주택: 1년 미만 2점, 1년 단위 +2점씩 가산, 15년 이상 32점 상한
 *   - 부양가족: 0명 5점, 1명당 +5점, 6명 이상 35점 상한
 *   - 통장: 6개월 미만 1점, 6개월 이상 2점, 1년 이상부터 1년 단위 +1점, 15년 이상 17점
 *
 * 만 30세 이전이거나 결혼 전이면 무주택 기간은 0년부터 산정 (제도상 만 30세 또는 혼인일 중 빠른 날부터 기산).
 */

export const SCORE_CAP = {
  homeless: 32,
  dependents: 35,
  account: 17,
  total: 84,
} as const;

export interface AptScoreInput {
  /** 무주택 기간 (년) — 만 30세 또는 혼인일 이후 무주택 보유 기간 */
  homelessYears: number;
  /** 부양가족 수 (본인 제외) — 배우자, 직계존속/비속, 형제자매 등 */
  dependents: number;
  /** 청약통장 가입 기간 (년) */
  accountYears: number;
}

export interface AptScoreResult {
  /** 무주택 기간 점수 (0~32) */
  homelessScore: number;
  /** 부양가족 점수 (5~35) */
  dependentsScore: number;
  /** 청약통장 점수 (1~17) */
  accountScore: number;
  /** 총점 (0~84) */
  totalScore: number;
  /** 등급 텍스트 */
  grade: string;
  /** 등급 설명 */
  gradeNote: string;
}

/** 무주택 기간 점수 — 1년 미만 2점, 1년 단위 +2점, 최대 32점 */
export function calcHomelessScore(years: number): number {
  if (!Number.isFinite(years) || years < 0) return 0;
  if (years < 1) return 2;
  const score = 2 + Math.floor(years) * 2;
  return Math.min(SCORE_CAP.homeless, score);
}

/** 부양가족 수 점수 — 0명 5점, 1명당 +5점, 최대 35점 */
export function calcDependentsScore(count: number): number {
  if (!Number.isFinite(count) || count < 0) return 5;
  const score = 5 + Math.floor(count) * 5;
  return Math.min(SCORE_CAP.dependents, score);
}

/** 청약통장 가입 점수 — 6개월 미만 1점, 6개월 이상 2점, 1년 이상부터 1년당 +1점, 최대 17점 */
export function calcAccountScore(years: number): number {
  if (!Number.isFinite(years) || years < 0) return 1;
  if (years < 0.5) return 1;
  if (years < 1) return 2;
  // 1년 이상 — 2년 3점, 3년 4점 ... 15년 17점
  const score = 2 + Math.floor(years);
  return Math.min(SCORE_CAP.account, score);
}

function gradeFor(total: number): { grade: string; note: string } {
  if (total >= 70)
    return {
      grade: "최상위 (만점권)",
      note: "수도권 1순위 청약에서 거의 모든 단지 당첨권 — 인기 단지도 노려볼 만합니다.",
    };
  if (total >= 60)
    return {
      grade: "상위권",
      note: "수도권 일반 단지 1순위 당첨 가능, 강남·과천 같은 초인기 단지는 경쟁이 치열합니다.",
    };
  if (total >= 50)
    return {
      grade: "중상위권",
      note: "수도권 외곽·지방 광역시 인기 단지 1순위 당첨 가능 수준입니다.",
    };
  if (total >= 40)
    return {
      grade: "평균권",
      note: "지방 단지나 비인기 평형 위주로 도전해볼 수 있습니다.",
    };
  return {
    grade: "초기/저점수",
    note: "추첨제 비율이 높은 특별공급(신혼부부·생애최초 등)이나 미분양 단지를 노리세요. 가점은 시간이 약입니다.",
  };
}

export function calculateAptScore(input: AptScoreInput): AptScoreResult {
  const homelessScore = calcHomelessScore(input.homelessYears);
  const dependentsScore = calcDependentsScore(input.dependents);
  const accountScore = calcAccountScore(input.accountYears);
  const totalScore = homelessScore + dependentsScore + accountScore;
  const { grade, note } = gradeFor(totalScore);

  return {
    homelessScore,
    dependentsScore,
    accountScore,
    totalScore,
    grade,
    gradeNote: note,
  };
}
