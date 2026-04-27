# SalaryCalc — 한국 직장인 종합 계산기 모음

2026년 시행 4대보험·소득세·근로기준법 기준 **6개 계산기 통합 정적 사이트**.
검색 유입 → 광고 수익을 노리는 micro 프로젝트입니다.

- **Live**: https://salary-calc-coral.vercel.app
- **Repo**: https://github.com/dhehrksl/SalaryCalc
- **스택**: Next.js 14 (App Router) + TypeScript + Tailwind + vitest + Vercel Analytics

---

## 운영 중인 계산기 6종

| 경로 | 페이지 | 핵심 키워드 | 상태 |
|-----|------|-----------|-----|
| `/` | 연봉 실수령액 | `연봉 실수령액`, `월급 계산기` | ✅ |
| `/retirement` | 퇴직금 | `퇴직금 계산`, `평균임금` | ✅ |
| `/annual-leave` | 연차/연차수당 | `연차수당 계산`, `연차 발생` | ✅ |
| `/hourly` | 시급/주급/월급 변환 | `시급 계산기`, `최저시급 2026` | ✅ |
| `/year-end-tax` | 연말정산 환급 | `연말정산`, `13월의 월급` | ✅ |
| `/apt-score` | 청약 가점 | `청약 가점`, `주택청약` | ✅ |

전 페이지에 **CalculatorNav 공통 컴포넌트**가 삽입되어 어느 계산기에서든 1클릭으로 다른 계산기로 이동 가능.

---

## 빠른 시작

```bash
npm install        # 최초 1회 (peer 충돌 시 --legacy-peer-deps)
npm run dev        # 개발 서버 (http://localhost:3000)
npm run build      # 프로덕션 빌드
npm test           # 단위 테스트 80개 (vitest)
```

## 환경 변수

- `NEXT_PUBLIC_SITE_URL` — 커스텀 도메인 연결 후 갱신 (선택)
- 미설정 시 `VERCEL_PROJECT_PRODUCTION_URL` 자동 fallback (Vercel이 빌드 시 주입)
- 둘 다 없으면 placeholder. sitemap·robots·OG·canonical에 사용됨

---

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx              # 메타 + Search Console verification + Vercel Analytics
│   ├── page.tsx                # 메인 — 연봉 실수령액
│   ├── retirement/page.tsx     # 퇴직금
│   ├── annual-leave/page.tsx   # 연차/연차수당
│   ├── hourly/page.tsx         # 시급/주급/월급
│   ├── year-end-tax/page.tsx   # 연말정산 환급
│   ├── apt-score/page.tsx      # 청약 가점
│   ├── privacy/page.tsx        # 개인정보처리방침 (AdSense 필수)
│   ├── sitemap.ts              # /sitemap.xml 자동 생성 (6페이지 + privacy)
│   ├── robots.ts               # /robots.txt 자동 생성
│   └── globals.css
├── components/
│   ├── Calculator.tsx              # 연봉 실수령
│   ├── RetirementCalculator.tsx    # 퇴직금
│   ├── AnnualLeaveCalculator.tsx   # 연차/연차수당
│   ├── HourlyCalculator.tsx        # 시급 변환
│   ├── YearEndTaxCalculator.tsx    # 연말정산
│   ├── AptScoreCalculator.tsx      # 청약 가점
│   ├── CalculatorNav.tsx           # 6개 계산기 카드 네비 (모든 페이지 공통)
│   ├── AdSlot.tsx                  # 광고 슬롯 placeholder
│   ├── HowItWorks.tsx
│   ├── RatesTable.tsx
│   ├── Faq.tsx
│   └── StructuredData.tsx
└── lib/
    ├── salary.ts (+ test)        # 연봉 실수령액 — 17 tests
    ├── retirement.ts (+ test)    # 퇴직금 — 8 tests
    ├── annualLeave.ts (+ test)   # 연차 — 13 tests
    ├── hourly.ts (+ test)        # 시급 환산 — 12 tests
    ├── yearEndTax.ts (+ test)    # 연말정산 — 10 tests
    ├── aptScore.ts (+ test)      # 청약 가점 — 20 tests
    └── site.ts                   # SITE_URL fallback
```

**총 80개 단위 테스트, 모두 통과.**

---

## 적용된 인프라

- ✅ **Vercel 자동 배포** (`main` push → 자동 빌드)
- ✅ **Vercel Web Analytics** (`@vercel/analytics/next`) — 방문자수·페이지뷰 추적
- ✅ **Google Search Console** 등록 + 소유권 인증 완료
  - verification token: `x66DRnGBmdW806wz2JSJemgr7sBQNNFE-wPVOslQCoU`
- ✅ **Sitemap 제출** (`/sitemap.xml`)
- ✅ **JSON-LD 구조화 데이터** (WebApplication + FAQPage)
- ✅ **광고 슬롯 placeholder** — AdSense 승인 후 `<ins>` 코드 삽입 위치만 만들어둠
- ✅ **6개 페이지 footer 상호 링크** — 내부 링크 그래프 = SEO 도움

---

## 다음 단계 체크리스트

### A. 검색 노출 (지금 우선) ⏳

- [x] 메인 페이지 색인 요청
- [x] `/privacy` 색인 요청
- [ ] **`/retirement` 색인 요청** ← 지금 진행
- [ ] **`/annual-leave` 색인 요청**
- [ ] **`/hourly` 색인 요청**
- [ ] **`/year-end-tax` 색인 요청** (12~2월 검색량 폭발 키워드)
- [ ] **`/apt-score` 색인 요청** (CPC 가장 높은 부동산 키워드)

> Search Console → URL 검사 → 각 URL 입력 → "색인 생성 요청"
> 색인까지 24시간~7일, 검색 노출은 1~3개월 소요

### B. 트래픽 검증 (2~4주 후)

색인 후 Search Console **"실적"** 탭에서 확인:
- 노출수 (impression) — 검색 결과에 표시된 횟수
- 클릭수 — 사용자가 실제 클릭한 횟수
- 평균 게재순위 — 평균 검색 순위

> 노출이 한 자릿수라도 잡히면 → 도메인 구입 단계로
> 노출 0 → 콘텐츠 보강 또는 백링크 작업 필요

### C. 도메인 구입 (트래픽 검증 후)

- [ ] Porkbun에서 `.shop` 또는 `.xyz` 1,000~3,000원 (가성비)
  또는 `.com` 1.5만원 (본격)
- [ ] Vercel → Settings → Domains에 도메인 등록
- [ ] 네임서버 변경 (Porkbun → Vercel 4개)
- [ ] 환경변수 `NEXT_PUBLIC_SITE_URL` 갱신 + 재배포

### D. AdSense 신청 (도메인 + 일일 방문자 30~50 안정 후)

- [ ] AdSense 가입
- [ ] 사이트 추가 → 본인 도메인
- [ ] 검증 코드 `<head>` 삽입
- [ ] 승인 대기 (1~14일, 거절되어도 보완 후 재신청)
- [ ] 승인되면 `src/components/AdSlot.tsx`에 광고 단위 코드 삽입

> Vercel Hobby 플랜은 약관상 비상업적이므로, 트래픽 폭발 시 Cloudflare Pages로 마이그레이션 가능 (영구 무료 + 상업 OK)

### E. 콘텐츠 확장 (월 1~2개 추가, 우선순위)

- [ ] **자동차세 계산기** (`/car-tax`) — 6/12월 시즌
- [ ] **취득세 계산기** (`/acquisition-tax`) — 부동산 거래
- [ ] **양도소득세 계산기** (`/capital-gains-tax`) — 부동산·주식
- [ ] **종합소득세 계산기** (`/comprehensive-tax`) — 5월 시즌
- [ ] **대출 이자 계산기** (`/loan-interest`) — 원리금균등/원금균등 비교

기존 패턴 복사 → 식만 바꾸면 1개당 30분~2시간. CalculatorNav에 카드 추가만 하면 자동 연결.

---

## 계산 정확도

각 계산기는 해당 법령·제도를 정확하게 반영하도록 설계됐고 단위 테스트로 검증합니다.

- **연봉 실수령액**: 4대보험료율, 근로소득공제, 인적공제, 누진세율, 근로소득세액공제 (소득세법 제47·55·59조)
- **퇴직금**: 평균임금 산식 + 상여·연차수당 3/12 가산 (근로자퇴직급여보장법 제8조)
- **연차/연차수당**: 1년 미만 월차, 1년 이상 15+가산일, 통상시급 209시간 환산 (근로기준법 제60조)
- **시급 변환**: 209시간 표준, 2026 최저시급(10,320원) 미달 자동 검증
- **연말정산**: 신용카드·의료비·교육비·기부금·연금저축 핵심 공제 + 결정세액 vs 기납부세액 (단순 모델, ±10% 오차)
- **청약 가점**: 무주택 32 + 부양가족 35 + 통장 17 = 84점 (주택공급규칙)

**알려진 단순화** (다른 계산기들도 동일):
- 매월 간이세액표 정확 적용 → 누진세율 근사 (연 단위 정산은 동일)
- 연말정산: 월세 세액공제, 주택자금 차입금, 청약저축 등 누락
- 보너스·일회성 인센티브 등 비정기 지급 미반영

---

## 현실적 수익 기대치 (비슷 규모 한국어 계산기 평균)

- **3개월 후**: 일 방문 50~100, AdSense 미승인 또는 월 1~3만 원
- **6개월 후**: 일 방문 200~500, 월 5~30만 원
- **12개월 후**: 일 방문 500~2,000, 월 30~100만 원
- **24개월 후 (콘텐츠 30+)**: 월 100~500만 원도 가능

폭발적이지 않지만 한 번 만들면 거의 손 안 가고, 계산기 1개 추가할 때마다 수익이 누적되는 구조입니다.

---

## 자주 쓰는 명령

```bash
cd "C:/Users/동환리/Desktop/SalaryCalc"

npm run dev              # 로컬 (http://localhost:3000)
npm test                 # 80개 테스트
npm run build            # 빌드 검증

# Vercel 자동 배포는 main push로
git add . && git commit -m "..." && git push
```

---

## 라이선스

본 코드는 사용자 본인 프로젝트 용도로 자유롭게 사용 가능합니다.
