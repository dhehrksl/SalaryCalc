# 연봉 실수령액 계산기 (SalaryCalc)

2026년 시행 4대보험·근로소득세 기준 연봉 실수령액 계산기. **AdSense·SEO 친화 정적 사이트**로 만들어 검색 유입 → 광고 수익을 노리는 micro 프로젝트입니다.

스택: **Next.js 14 (App Router) + TypeScript + Tailwind + vitest**

---

## 빠른 시작

```bash
npm install        # 최초 1회
npm run dev        # 개발 서버 (http://localhost:3000)
npm run build      # 프로덕션 빌드
npm start          # 빌드 결과 실행
npm test           # 단위 테스트 (vitest)
```

## 환경 변수

배포 시 `.env.local` 또는 Vercel 환경변수에 다음 추가:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

이게 sitemap·robots·OG·canonical에 모두 사용됩니다. 미설정 시 placeholder URL이 들어가요.

---

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 + 메타데이터
│   ├── page.tsx            # 메인 계산기 페이지
│   ├── privacy/page.tsx    # 개인정보처리방침 (AdSense 필수)
│   ├── sitemap.ts          # /sitemap.xml 자동 생성
│   ├── robots.ts           # /robots.txt 자동 생성
│   └── globals.css
├── components/
│   ├── Calculator.tsx      # 입력 폼 + 결과 표시 (클라이언트)
│   ├── HowItWorks.tsx      # 6단계 계산 방식 설명
│   ├── RatesTable.tsx      # 4대보험율·세율표
│   ├── Faq.tsx             # 8개 FAQ + 정의는 그대로 export
│   └── StructuredData.tsx  # WebApplication·FAQPage JSON-LD
└── lib/
    ├── salary.ts           # 핵심 계산 로직
    └── salary.test.ts      # 17개 단위 테스트 (vitest)
```

---

## 계산 정확도

본 계산기는 다음을 정확하게 반영합니다:
- 4대보험료율 (2025~2026 시행 기준)
- 근로소득공제 (소득세법 제47조)
- 인적공제 (1인당 150만원)
- 누진세율 (소득세법 제55조)
- 근로소득세액공제 한도의 점진적 감소 (제59조)
- 자녀세액공제 (8~20세 기준)
- 식대 비과세 한도 (월 20만원)
- 국민연금 기준소득월액 상·하한

다음은 단순화·생략됨 (한국의 다른 일반 연봉 계산기들도 동일):
- 매월 간이세액표 정확한 적용 → 누진세율로 근사 (연 단위 정산 시 결과는 같음)
- 신용카드·의료비·교육비·기부금 등 특별 세액공제
- 보너스·연차수당·퇴직금 등 비정기 지급

다른 사이트(잡코리아·사람인 등)와는 ±3% 이내 차이가 있을 수 있고, 17개 테스트로 합리적 범위를 검증합니다.

---

## 다음 스텝 — 사용자 작업 체크리스트

> 코드 자체는 모두 동작합니다. 아래는 **수익화 + 검색 노출**까지 가는 데 사용자가 직접 해야 하는 작업입니다.

### 1. 배포 (당일, 30분)

- [ ] **Vercel 가입** (`vercel.com`, GitHub 로그인)
- [ ] 이 프로젝트 GitHub 저장소 푸시 (priv/public 둘 다 OK)
- [ ] Vercel에서 `Import Project` → 자동 감지되어 빌드됨
- [ ] **Production URL 확인** (예: `salary-calc-xxx.vercel.app`)
- [ ] 환경변수 `NEXT_PUBLIC_SITE_URL`에 위 URL 추가 후 재배포

### 2. 도메인 (선택, +30분)

- [ ] 가비아·후이즈에서 `.com` 도메인 구입 (연 1~2만 원). 이름 추천:
  - `salary-real.kr` / `silsuryeong.kr` / `monthlypay.kr` 같이 검색 친화적
- [ ] Vercel → Project Settings → Domains에 도메인 연결 (네임서버만 변경하면 자동)
- [ ] 환경변수 `NEXT_PUBLIC_SITE_URL` 도메인으로 갱신

### 3. Search Console 등록 (당일, 15분)

- [ ] [Google Search Console](https://search.google.com/search-console) 접속
- [ ] 속성 추가 → URL 접두어 → 사이트 URL 입력
- [ ] HTML 태그 인증 → 받은 메타 태그를 `src/app/layout.tsx` `metadata.verification.google`에 추가
- [ ] sitemap 제출: `your-domain.com/sitemap.xml`
- [ ] **첫 색인까지 보통 3~7일** 소요

### 4. Google Analytics (선택, 10분)

- [ ] [GA4](https://analytics.google.com) 속성 생성, 측정 ID(`G-XXXXXXXX`) 받기
- [ ] `src/app/layout.tsx`에 GA 스크립트 추가 (또는 `@next/third-parties` 사용)

### 5. AdSense 신청 (사이트 트래픽 안정 후, 1주~1달)

AdSense는 콘텐츠 충분 + 일일 방문자가 어느 정도 있어야 승인됩니다. 보통 **검색 색인 후 일일 방문 50~100명** 시점에 신청.

- [ ] [AdSense](https://adsense.google.com) 가입
- [ ] 사이트 추가 → 본인 도메인 입력
- [ ] AdSense가 준 검증 코드를 `<head>`에 삽입 (현재 layout.tsx에 자리만 만들어둠)
- [ ] 승인 대기 (보통 1~14일, 거절되어도 보완해서 재신청 가능)
- [ ] 승인되면 광고 단위 생성 → `src/app/page.tsx`의 `id="ad-slot-middle"` 자리에 단위 코드 삽입

**승인 잘 되는 조건**:
- 페이지 30개 이상 (콘텐츠 분량) — 추가 계산기 확장으로 채우기
- 개인정보처리방침·연락처 페이지 (이미 있음 ✓)
- 일관된 한국어 콘텐츠 (있음 ✓)
- 자체 도메인 (`.vercel.app`보다 자체 도메인 권장)

### 6. 콘텐츠 확장 (장기, 월 1~2개)

검색 트래픽 = 페이지 수. 한 도메인에 계산기를 누적하면 키워드도 누적:

- [ ] **퇴직금 계산기** (`/retirement`) — `퇴직금 계산` 월 30만 검색
- [ ] **연차/연차수당 계산기** (`/annual-leave`) — `연차수당 계산` 월 10만 검색
- [ ] **시급/주급/월급 변환기** (`/hourly`) — `최저시급` 키워드
- [ ] **연말정산 환급액 추정기** (`/year-end-tax`) — 12~2월 시즌성 폭발 (월 100만+ 검색)
- [ ] **청약 가점 계산기** (`/apt-score`) — 부동산 키워드 (CPC 매우 높음)
- [ ] **양도소득세 계산기** (`/transfer-tax`) — 부동산 + 세금 (CPC 가장 높음)
- [ ] **종합소득세 계산기** (`/comprehensive-tax`) — 5월 시즌 폭발

각 계산기 추가 = 새 키워드 잡기 + AdSense 페이지 수 증가 + 사이트 권위 누적.

### 7. SEO 키워드 작업 (지속)

- [ ] 페이지마다 `<h1>` 키워드 1개 명확히 ("연봉 실수령액 계산기 2026")
- [ ] FAQ를 검색어 의도에 맞게 추가 ("연봉 4000 실수령")
- [ ] 블로그 코너 추가 (`/guide/연봉-실수령액-보는법`) — 정보형 키워드 유입
- [ ] 외부 링크 (네이버 블로그·티스토리 등에 직접 글 쓰면서 사이트 링크) — 백링크 누적

### 8. 모니터링 (월 1회)

- [ ] Search Console: 어떤 키워드로 들어오는지, CTR
- [ ] GA: 일일 방문자, 체류 시간, 이탈률
- [ ] AdSense: RPM(천 노출당 수익), CPC, 채워지지 않는 슬롯

---

## 현실적 수익 기대치

비슷한 규모의 한국어 계산기 사이트들 평균:
- **3개월 후**: 일 방문 50~100명, AdSense 미승인 또는 월 1~3만 원
- **6개월 후**: 일 방문 200~500명, 월 5~30만 원
- **12개월 후**: 일 방문 500~2,000명, 월 30~100만 원
- **24개월 후 (콘텐츠 30+ 누적)**: 월 100~500만 원도 가능

폭발적이지 않지만 한 번 만들면 거의 손 안 가고, 계산기 1개 추가할 때마다 수익이 누적되는 구조입니다.

---

## 라이선스

본 코드는 사용자 본인 프로젝트 용도로 자유롭게 사용 가능합니다.
