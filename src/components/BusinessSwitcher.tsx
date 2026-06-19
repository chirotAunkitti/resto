"use client";

import { businesses } from "@/config/restaurant.config";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

export function BusinessSwitcher({ compact = false }: { compact?: boolean }) {
  const businessId = useStore((s) => s.businessId);
  const setBusiness = useStore((s) => s.setBusiness);

  return (
    <div className={cn("flex flex-wrap gap-2", compact && "gap-1.5")}>
      {businesses.map((b) => {
        const active = b.id === businessId;
        return (
          <button
            key={b.id}
            onClick={() => {
              if (active) return;
              if (
                confirm(
                  `เปลี่ยนเป็น "${b.name}"? ข้อมูลเดโม (เมนู/โต๊ะ/ออเดอร์) จะถูกรีเซ็ตใหม่`,
                )
              ) {
                setBusiness(b.id);
              }
            }}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
              active
                ? "border-transparent bg-primary text-white shadow"
                : "border-border bg-surface text-ink hover:border-primary/40",
              compact && "px-2.5 py-1 text-xs",
            )}
          >
            <span>{b.logo}</span>
            <span>{b.name}</span>
          </button>
        );
      })}
    </div>
  );
}
