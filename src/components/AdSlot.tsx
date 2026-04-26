/**
 * AdSense 광고 자리 placeholder.
 *
 * AdSense 승인 후:
 *   1) 광고 단위를 만들어 받은 코드를 이 자리에 삽입
 *   2) 또는 NEXT_PUBLIC_ADSENSE_CLIENT 환경변수와 slotId prop으로 자동 렌더링
 *
 * 광고는 너무 많으면 RPM 떨어지고 SEO도 손해. 승인 후 실제 트래픽 데이터 보면서
 * 효율 안 나오는 슬롯은 비활성화하세요.
 */

type Variant = "horizontal" | "rectangle" | "vertical";

const VARIANT_STYLE: Record<Variant, string> = {
  horizontal: "h-24",
  rectangle: "h-64",
  vertical: "h-[600px] w-40",
};

export default function AdSlot({
  id,
  variant = "horizontal",
  className = "",
}: {
  id: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <div
      id={id}
      aria-hidden
      data-ad-slot={id}
      className={`my-6 flex ${VARIANT_STYLE[variant]} items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/40 text-xs text-slate-400 ${className}`}
    >
      광고 영역 ({id})
    </div>
  );
}

/**
 * 좌·우 사이드 광고 (sticky). lg(1024px) 이상에서만 노출 — 모바일/태블릿에서는
 * 화면이 좁아 사이드 광고가 콘텐츠를 가리므로 자동 숨김.
 */
export function SideAdSlot({ id, side }: { id: string; side: "left" | "right" }) {
  return (
    <aside
      className={`hidden w-40 flex-shrink-0 lg:block ${
        side === "left" ? "lg:order-first" : "lg:order-last"
      }`}
      aria-hidden
    >
      <div
        id={id}
        data-ad-slot={id}
        className="sticky top-4 flex h-[600px] w-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/40 text-xs text-slate-400"
      >
        광고 ({id})
      </div>
    </aside>
  );
}
