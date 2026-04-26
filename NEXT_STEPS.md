# 깨어나서 할 일 — 우선순위별

## ⭐ 오늘 (30분~1시간)

1. **dev 서버 띄워서 직접 써보기**
   ```bash
   cd C:\Users\동환리\Desktop\SalaryCalc
   npm run dev
   ```
   브라우저 `http://localhost:3000` → 본인 연봉 입력해서 결과 확인. 다른 계산기 사이트(잡코리아·사람인) 결과와 비교.

2. **GitHub에 푸시**
   ```bash
   cd C:\Users\동환리\Desktop\SalaryCalc
   git init
   git add .
   git commit -m "Initial: 연봉 실수령액 계산기 v0.1"
   # GitHub에 새 저장소 만들고
   git remote add origin https://github.com/{your-id}/salary-calc.git
   git push -u origin main
   ```

3. **Vercel 배포** — `vercel.com` 가입 → Import → 클릭 몇 번이면 끝. 5분.

## 🟡 이번 주 (총 1~2시간)

4. **Search Console 등록 + sitemap 제출** (15분)
5. **GA4 측정 ID 발급 + layout.tsx에 스크립트 추가** (10분)
6. **도메인 구입** — 가비아에서 `.kr` 또는 `.com` (~2만원/년)
7. **콘텐츠 보강** — FAQ에 자주 검색되는 질문 5~10개 추가, 본문에 키워드 자연스럽게 더 풀어쓰기

## 🟢 1~2주 안

8. **퇴직금 계산기 추가** — 같은 패턴으로 `src/app/retirement/page.tsx` + 헤더 메뉴
   - 평균임금 × 30일 × (재직일수/365) — 단순한 식
   - 2번째 페이지가 생기면 사이트 권위 ↑
9. **연차수당 계산기 추가**
10. **AdSense 신청** — 페이지 5개 이상 + Search Console 색인된 후

## 🔵 한 달 안

11. **연말정산 환급액 추정기** — 12~2월 시즌성 트래픽 큼
12. **블로그 코너** — `/guide/...` 정보형 글로 유입 늘리기

---

## 즉시 답이 안 보일 때 점검

- **빌드 안 됨?** → `node_modules` 지우고 `npm install` 재시도, Node 18+ 확인
- **Vercel 배포 후 메타데이터 빈 값?** → 환경변수 `NEXT_PUBLIC_SITE_URL` 등록했는지
- **Search Console에 sitemap 못 찾음?** → `your-domain.com/sitemap.xml` 직접 열어서 XML 나오는지 확인
- **AdSense 거절?** → 콘텐츠가 너무 적거나 자체 도메인 아닐 가능성. 페이지 수 늘리고 자체 도메인 연결 후 재신청
- **계산 결과가 다른 사이트와 차이 큼?** → `src/lib/salary.ts`의 RATES 상수가 정부 발표한 2026 정확한 요율과 같은지 확인

---

## 코드 한눈에 보기

- 계산 로직: `src/lib/salary.ts` (정부가 요율 발표하면 RATES만 갱신)
- 메인 UI: `src/components/Calculator.tsx`
- 페이지: `src/app/page.tsx`, `src/app/privacy/page.tsx`
- 테스트: `npm test`로 17개 케이스 검증

상세는 `README.md`.
