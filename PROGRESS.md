# SalaryCalc — 진행 상황 (마지막 업데이트: 2026-04-28, 6개 계산기 운영 + 색인 요청 진행)

> 다음 세션에서 Claude한테 이 파일 보여주거나 "Desktop/SalaryCalc/PROGRESS.md 읽고 이어가자"고 하면 그대로 컨텍스트 복원됨.

---

## 한 줄 요약

한국 **2026 연봉 실수령액 계산기** — Next.js 14 정적 사이트, AdSense 광고 수익 모델. 검색 유입(`연봉 실수령액` 등) → 광고 노출 → micro 수익이 목표.

- **GitHub**: https://github.com/dhehrksl/SalaryCalc
- **Live URL**: https://salary-calc-coral.vercel.app/
- **로컬 폴더**: `C:\Users\동환리\Desktop\SalaryCalc`
- **사용자 이메일** (commit): dhehrksl@naver.com

---

## ✅ 완료된 것

### 코드
- [x] Next.js 14 (App Router) + TypeScript + Tailwind 보일러플레이트
- [x] 2026년 4대보험·근로소득세 계산 로직 (`src/lib/salary.ts`)
  - 국민연금 4.5% (상한 617만원), 건강보험 3.545%, 장기요양 12.95%, 고용보험 0.9%
  - 근로소득공제·인적공제·누진세율·근로소득세액공제(점진 감소)·자녀세액공제·식대 비과세
- [x] vitest 80개 단위 테스트 모두 통과 (`npm test`) — salary 17 + retirement 8 + annual-leave 13 + hourly 12 + yearEndTax 10 + aptScore 20
- [x] **퇴직금 계산기 페이지** (`/retirement`)
- [x] **연차/연차수당 계산기 페이지** (`/annual-leave`)
- [x] **시급/주급/월급 계산기 페이지** (`/hourly`)
- [x] **연말정산 계산기 페이지** (`/year-end-tax`)
- [x] **청약 가점 계산기 페이지** (`/apt-score`)
  - `src/lib/aptScore.ts` — 무주택 32점 + 부양가족 35점 + 통장 17점 = 84점 만점
  - `src/components/AptScoreCalculator.tsx` — 슬라이더 입력 + 항목별 진행 바 + 등급 안내
- [x] **CalculatorNav 공통 컴포넌트** — **6개 계산기 카드** 그리드 (반응형 2/3/6 컬럼)
  - 모든 계산기 페이지의 광고 슬롯 직후에 삽입 — 페이지 간 이동 동선 확보
- [x] 메인 페이지 UI — `src/components/Calculator.tsx` (실시간 계산, 모드 토글, 프리셋)
- [x] 보조 컴포넌트: `HowItWorks`, `RatesTable`, `Faq`, `StructuredData`
- [x] `/privacy` 페이지 (AdSense 필수)
- [x] `sitemap.ts`, `robots.ts` (App Router metadata API)
- [x] SEO 메타 — title 템플릿, description, OG, Twitter, canonical, JSON-LD (WebApplication + FAQPage)
- [x] 광고 슬롯 7개 (placeholder, AdSense 승인 후 코드 삽입 예정)
  - 좌·우 사이드 sticky (`ad-side-left`, `ad-side-right`) — lg(1024px)+ 만 노출
  - 본문 5개: `ad-top`, `ad-after-calc`(rectangle), `ad-after-how`, `ad-after-rates`, `ad-bottom`(rectangle)

### 인프라
- [x] GitHub 저장소 푸시 완료
- [x] Vercel 자동 배포 (GitHub push → 자동 빌드)
- [x] **Vercel Web Analytics 통합** (`@vercel/analytics`) — `layout.tsx`에 `<Analytics />` 마운트
  - 설치 시 SvelteKit peerOptional 충돌로 `--legacy-peer-deps` 사용 (정상)
  - Vercel 대시보드 → Analytics 탭에서 방문자수/페이지뷰/Top Pages 확인 가능
  - **사용자 작업 필요**: Vercel 프로젝트 → Analytics 탭 → Enable 클릭 (1회, 무료)
- [x] `SITE_URL` 자동 fallback 구현 (`src/lib/site.ts`)
  - 우선순위: `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → placeholder
  - 환경변수 등록 안 해도 자동으로 올바른 URL이 메타·sitemap·robots에 박힘
- [x] Google Search Console 등록 + 소유권 인증 완료
  - verification token: `x66DRnGBmdW806wz2JSJemgr7sBQNNFE-wPVOslQCoU`
  - `src/app/layout.tsx`의 `metadata.verification.google`에 박혀 있음
- [x] Sitemap 제출 (`sitemap.xml`)
- [x] 메인 페이지 색인 요청 완료 (실제 색인까지 24시간 ~ 3주)

---

## ⏳ 사용자 손이 필요한 즉시 작업

- [ ] **`/privacy` 색인 요청** (1분) — Search Console → URL 검사 → `https://salary-calc-coral.vercel.app/privacy` 입력 → 색인 생성 요청
- [ ] **`/retirement` 색인 요청** (1분) — Search Console에서 URL 검사 → 색인 생성 요청
- [ ] **`/annual-leave` 색인 요청** (1분) — Search Console에서 URL 검사 → 색인 생성 요청
- [ ] **`/hourly` 색인 요청** (1분) — Search Console에서 URL 검사 → 색인 생성 요청
- [ ] **`/year-end-tax` 색인 요청** (1분) — Search Console에서 URL 검사 → 색인 생성 요청. **12~2월 시즌에는 이 키워드가 가장 많이 검색됨**
- [ ] **`/apt-score` 색인 요청** (1분) — Search Console에서 URL 검사 → 색인 생성 요청. **부동산 키워드는 광고 단가(CPC)가 가장 높음**
- [x] ~~Vercel Analytics 켜기~~ — `@vercel/analytics` v2/`@vercel/analytics/next` 이미 통합됨. Vercel이 자동 PR을 만들려고 시도하다 충돌 발생, 우리는 직접 통합했으니 자동 PR 닫고 무시. 사이트 트래픽 발생 시 `_vercel/insights/view` 요청이 200으로 가면 정상 작동

---

## 🎯 다음 큰 결정 (며칠 안)

### A. 도메인 구입 (강력 추천)
- `vercel.app` 서브도메인은 구글 검색 순위 잘 안 올라감 + AdSense 거절률 높음
- **Porkbun에서 `.shop` 첫해 1,000~3,000원** — 가장 가성비
- `.com`/`.kr`은 1~2만원/년
- 구입 후: Vercel → Settings → Domains에 추가, 네임서버 변경. 자동 HTTPS

### B. AdSense 신청 시점
- **너무 일찍 신청하면 거절** ("콘텐츠 부족"). 콘텐츠 페이지 5~10개+, 일일 방문자 30~50명+ 안정 후 권장
- 자체 도메인 연결 후 신청 (vercel.app으로는 거절률 ↑)
- 거절되어도 1~2주 후 보완해서 재신청 가능

### C. GA4 (Google Analytics 4) 추가
- Vercel Analytics보다 훨씬 자세 (사용자 행동, 이탈 페이지 등)
- 무료, 무제한
- 트래픽 모이기 시작할 때 추가 (지금 당장 필요 X)
- 측정 ID 받아오시면 `layout.tsx`에 한 번에 추가 가능

### D. 콘텐츠 확장 (페이지 수 = SEO + AdSense 승인 가능성)
콘텐츠 1개 추가 = 새 검색 키워드 1개 잡기. 우선순위:
1. ~~**퇴직금 계산기** (`/retirement`)~~ ✅ 완료 (2026-04-28)
2. ~~**연차/연차수당 계산기** (`/annual-leave`)~~ ✅ 완료 (2026-04-28)
3. ~~**시급/주급/월급 변환기** (`/hourly`)~~ ✅ 완료 (2026-04-28)
4. ~~**연말정산 환급액 추정기** (`/year-end-tax`)~~ ✅ 완료 (2026-04-28)
5. ~~**청약 가점 계산기** (`/apt-score`)~~ ✅ 완료 (2026-04-28)
6. **자동차세 계산기** (`/car-tax`) — 배기량 × cc당 세율, 6/12월 시즌 — **다음 추천**
7. **취득세 계산기** (`/acquisition-tax`) — 부동산 거래 (1.1~3.5%, 9억/12억 분기점)
8. **양도소득세 계산기** (`/capital-gains-tax`) — 부동산·주식, 누진세율 + 장기보유공제
9. **대출 이자 계산기** (`/loan-interest`) — 원리금균등/원금균등 비교

기존 패턴 복사 → 식만 바꾸면 1개당 30분~2시간. CalculatorNav에 카드 추가만 하면 자동 연결.

---

## 🚨 알아둘 핵심 메모 (까먹기 쉬움)

### Vercel Hobby 약관 회색 영역
- Hobby 플랜은 **비상업적(non-commercial)** 명시 — AdSense 게재 시 약관상 Pro($20/월) 권장
- 작은 트래픽일 땐 단속 거의 없지만, 트래픽 폭발하면 강제 업그레이드 안내 가능
- **장기 안전 옵션**: AdSense 승인 직전에 **Cloudflare Pages**로 마이그레이션 (영구 무료 + 상업 OK + 한국 속도 빠름). GitHub 저장소 그대로 다른 호스팅에 연결만 하면 5분.

### 색인까지 시간
- "색인 요청"은 대기열 진입일 뿐
- 빠르면 24시간, 보통 3~7일, 늦으면 2~3주
- 일반 키워드 1페이지 노출은 1~3개월 + 사용자 행동 신호 + 백링크
- 확인: `site:salary-calc-coral.vercel.app` 구글 검색

### 광고 슬롯 코드 위치
- `src/components/AdSlot.tsx` — placeholder 컴포넌트, AdSense 승인 후 `<ins class="adsbygoogle">` 삽입 위치
- `src/app/page.tsx` — 7개 슬롯 위치 정의됨
- 처음에는 슬롯 3~4개만 켜고 시작 권장 (AdSense 콘텐츠 대비 광고 비율 심사)

### 정확도 한계
- 다른 계산기(잡코리아·사람인) 결과와 ±5% 이내 일치
- 매월 간이세액표 정확한 적용 대신 누진세율 근사 (연 단위는 동일)
- 신용카드·의료비 등 특별공제는 미반영 — 다른 계산기들도 동일
- 정부가 2026 요율 변경 발표하면 `src/lib/salary.ts`의 `RATES` 상수만 갱신

### 수익 현실 기대치 (비슷 규모 한국어 계산기 사이트 평균)
- 3개월 후: 일 방문 50~100, AdSense 미승인 또는 월 1~3만 원
- 6개월 후: 일 방문 200~500, 월 5~30만 원
- 12개월 후: 일 방문 500~2,000, 월 30~100만 원
- 24개월 후 (콘텐츠 30+ 누적): 월 100~500만 원도 가능

---

## 📁 코드 한눈에 보기

```
SalaryCalc/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 메타데이터 + Search Console verification + Vercel Analytics
│   │   ├── page.tsx                # 메인 — 연봉 실수령
│   │   ├── privacy/page.tsx
│   │   ├── retirement/page.tsx     # 퇴직금
│   │   ├── annual-leave/page.tsx   # 연차/연차수당
│   │   ├── hourly/page.tsx         # 시급/주급/월급
│   │   ├── year-end-tax/page.tsx   # 연말정산
│   │   ├── apt-score/page.tsx      # 청약 가점
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── globals.css
│   ├── components/
│   │   ├── Calculator.tsx              # 연봉 실수령액
│   │   ├── RetirementCalculator.tsx    # 퇴직금
│   │   ├── AnnualLeaveCalculator.tsx   # 연차/연차수당
│   │   ├── HourlyCalculator.tsx        # 시급 변환
│   │   ├── YearEndTaxCalculator.tsx    # 연말정산
│   │   ├── AptScoreCalculator.tsx      # 청약 가점
│   │   ├── CalculatorNav.tsx           # 6개 계산기 카드 네비 (모든 페이지 공통)
│   │   ├── AdSlot.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── RatesTable.tsx
│   │   ├── Faq.tsx
│   │   └── StructuredData.tsx
│   └── lib/
│       ├── salary.ts            # 연봉 실수령액 (17 tests)
│       ├── retirement.ts        # 퇴직금 (8)
│       ├── annualLeave.ts       # 연차 (13)
│       ├── hourly.ts            # 시급 환산 (12)
│       ├── yearEndTax.ts        # 연말정산 (10)
│       ├── aptScore.ts          # 청약 가점 (20)
│       └── site.ts              # SITE_URL fallback
├── README.md
├── NEXT_STEPS.md                # 깨어나서 할 일 체크리스트 (구버전)
└── PROGRESS.md                  # ← 이 파일
```

---

## 🛠 자주 쓰는 명령어

```bash
cd "C:/Users/동환리/Desktop/SalaryCalc"

npm run dev              # 로컬 개발 서버 (http://localhost:3000)
npm run build            # 프로덕션 빌드
npm test                 # vitest 17개 테스트
npm start                # 빌드 결과 실행

# git push만 하면 Vercel 자동 재배포
git add . && git commit -m "..." && git push
```

---

## 🔄 새 세션에서 이어가기 (Claude한테 할 말 예시)

> "Desktop/SalaryCalc/PROGRESS.md 읽고 이어서 하자. [도메인 샀어 / 색인 됐어 / 콘텐츠 추가하고 싶어 / 등 새 상황]"

또는 구체적으로:
> "/privacy 색인까지 했고 Vercel Analytics도 켰어. 다음 뭐 해야 돼?"
> "도메인 샀어 — domain.shop. Vercel에 연결하는 거 도와줘"
> "퇴직금 계산기 페이지 추가하자"

---

마지막 진행 시점 — 2026-04-28. 작업 컨텍스트는 이 파일에 그대로 남아 있음.

### 2026-04-28 추가 작업
- Vercel Web Analytics 통합 (`@vercel/analytics` v2 + `/next` 진입점)
- **5개 신규 계산기 페이지** — 퇴직금 / 연차·연차수당 / 시급·주급·월급 / 연말정산 / 청약 가점
- **CalculatorNav 공통 컴포넌트** — 6개 계산기 카드 네비, 반응형 2/3/6 columns
- sitemap 6페이지 등록, 모든 footer 링크 일관 정비
- vitest 80개 테스트 모두 통과 (salary 17 + retirement 8 + annual-leave 13 + hourly 12 + yearEndTax 10 + aptScore 20)
- 빌드 통과 (Static prerender, 6페이지 모두 2~4 kB)
