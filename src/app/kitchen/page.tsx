"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore, type OrderStatus } from "@/store/useStore";
import { getBusiness } from "@/config/restaurant.config";
import { useHydrated } from "@/hooks/useHydrated";
import { STATUS_META, ACTIVE_STATUSES } from "@/lib/orders";
import { cn, formatPrice, timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const FILTERS: { id: OrderStatus | "active"; label: string }[] = [
  { id: "active", label: "กำลังดำเนินการ" },
  { id: "new", label: "ใหม่" },
  { id: "cooking", label: "กำลังทำ" },
  { id: "ready", label: "พร้อมเสิร์ฟ" },
  { id: "served", label: "เสิร์ฟแล้ว" },
];

export default function KitchenPage() {
  const hydrated = useHydrated();
  const businessId = useStore((s) => s.businessId);
  const currency = useStore((s) => s.currency);
  const orders = useStore((s) => s.orders);
  const setOrderStatus = useStore((s) => s.setOrderStatus);
  const b = getBusiness(businessId);

  const [filter, setFilter] = useState<OrderStatus | "active">("active");

  const visible = orders
    .filter((o) =>
      filter === "active" ? ACTIVE_STATUSES.includes(o.status) : o.status === filter,
    )
    .sort((a, b) => a.createdAt - b.createdAt);

  const activeCount = orders.filter((o) =>
    ACTIVE_STATUSES.includes(o.status),
  ).length;

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface shadow-sm"
          >
            ‹
          </Link>
          <div className="flex-1">
            <h1 className="font-extrabold leading-tight">จอครัว · {b.name}</h1>
            <p className="text-xs text-muted">
              {activeCount} ออเดอร์กำลังดำเนินการ
            </p>
          </div>
          <span className="text-2xl">👨‍🍳</span>
        </div>
        <div className="no-scrollbar mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 pb-3">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                filter === f.id ? "bg-primary text-white" : "bg-surface text-ink",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-5">
        {!hydrated ? (
          <p className="py-20 text-center text-muted">กำลังโหลด…</p>
        ) : visible.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-6xl">🍽️</div>
            <p className="mt-4 text-muted">ยังไม่มีออเดอร์ในหมวดนี้</p>
            <p className="mt-1 text-xs text-muted">
              ลองสั่งจากหน้าลูกค้าอีกแท็บดูสิ
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((o) => {
              const meta = STATUS_META[o.status];
              return (
                <div
                  key={o.id}
                  className={cn(
                    "animate-pop rounded-3xl bg-surface p-4 shadow-sm",
                    o.status === "new" && "ring-2 ring-primary/40",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 font-extrabold text-primary">
                      {o.tableNumber}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-bold",
                        meta.badge,
                      )}
                    >
                      {meta.emoji} {meta.label}
                    </span>
                  </div>

                  <div className="mt-1 text-xs text-muted">
                    โต๊ะ {o.tableNumber} · {timeAgo(o.createdAt)} ที่แล้ว · #
                    {o.id.slice(-4).toUpperCase()}
                  </div>

                  <div className="mt-3 space-y-1.5">
                    {o.lines.map((l) => (
                      <div
                        key={l.menuItemId}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="font-medium">
                          {l.emoji} {l.name}
                        </span>
                        <span className="font-bold text-primary">×{l.qty}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-sm font-bold">
                      {formatPrice(o.total, currency)}
                    </span>
                    <div className="flex gap-2">
                      {o.status !== "served" && o.status !== "cancelled" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setOrderStatus(o.id, "cancelled")}
                        >
                          ยกเลิก
                        </Button>
                      )}
                      {meta.next && (
                        <Button
                          size="sm"
                          onClick={() => setOrderStatus(o.id, meta.next!)}
                        >
                          {meta.nextLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
