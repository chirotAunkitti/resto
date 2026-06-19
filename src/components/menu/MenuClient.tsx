"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { getBusiness } from "@/config/restaurant.config";
import { useHydrated } from "@/hooks/useHydrated";
import { cn, formatPrice } from "@/lib/utils";
import { STATUS_META } from "@/lib/orders";
import { Button } from "@/components/ui/Button";

export function MenuClient() {
  const params = useSearchParams();
  const tableId = params.get("table") ?? "";
  const hydrated = useHydrated();

  const businessId = useStore((s) => s.businessId);
  const currency = useStore((s) => s.currency);
  const categories = useStore((s) => s.categories);
  const menu = useStore((s) => s.menu);
  const tables = useStore((s) => s.tables);
  const carts = useStore((s) => s.carts);
  const orders = useStore((s) => s.orders);
  const addToCart = useStore((s) => s.addToCart);
  const decFromCart = useStore((s) => s.decFromCart);
  const placeOrder = useStore((s) => s.placeOrder);

  const b = getBusiness(businessId);

  const [activeCat, setActiveCat] = useState<string>("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [tab, setTab] = useState<"menu" | "orders">("menu");

  const table = tables.find((t) => t.id === tableId);
  const cart = carts[tableId] ?? [];
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = useMemo(
    () =>
      cart.reduce((s, c) => {
        const item = menu.find((m) => m.id === c.menuItemId);
        return s + (item ? item.price * c.qty : 0);
      }, 0),
    [cart, menu],
  );

  const myOrders = orders.filter((o) => o.tableId === tableId);

  const filtered = menu.filter(
    (m) => m.available && (activeCat === "all" || m.categoryId === activeCat),
  );

  if (!hydrated) {
    return <div className="p-8 text-center text-muted">กำลังโหลด…</div>;
  }

  // No / invalid table → table picker (demo helper).
  if (!table) {
    return (
      <main className="mx-auto max-w-md px-5 py-10">
        <Link href="/" className="text-sm text-muted">
          ‹ กลับ
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold">เลือกโต๊ะ (เดโม)</h1>
        <p className="mt-1 text-sm text-muted">
          ปกติลูกค้าจะสแกน QR ที่โต๊ะ — เดโมนี้กดเลือกได้เลย
        </p>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {tables.map((t) => (
            <Link
              key={t.id}
              href={`/menu?table=${t.id}`}
              className="flex aspect-square flex-col items-center justify-center rounded-3xl bg-surface text-center shadow-sm transition-transform active:scale-95"
            >
              <span className="text-2xl">🪑</span>
              <span className="mt-1 font-bold">โต๊ะ {t.number}</span>
            </Link>
          ))}
        </div>
      </main>
    );
  }

  function qtyOf(menuItemId: string) {
    return cart.find((c) => c.menuItemId === menuItemId)?.qty ?? 0;
  }

  function onPlaceOrder() {
    const id = placeOrder(tableId);
    if (id) {
      setCartOpen(false);
      setTab("orders");
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 pb-28 pt-4">
      {/* Header */}
      <header className="flex items-center gap-3">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-xl shadow-sm"
        >
          {b.logo}
        </Link>
        <div className="flex-1">
          <div className="text-sm font-bold leading-tight">{b.name}</div>
          <div className="text-xs text-muted">โต๊ะ {table.number}</div>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          กำลังนั่ง
        </span>
      </header>

      {/* Tabs */}
      <div className="mt-4 flex rounded-full bg-black/5 p-1 text-sm font-semibold">
        <button
          onClick={() => setTab("menu")}
          className={cn(
            "flex-1 rounded-full py-2 transition-colors",
            tab === "menu" ? "bg-surface shadow-sm" : "text-muted",
          )}
        >
          เมนู
        </button>
        <button
          onClick={() => setTab("orders")}
          className={cn(
            "flex-1 rounded-full py-2 transition-colors",
            tab === "orders" ? "bg-surface shadow-sm" : "text-muted",
          )}
        >
          ออเดอร์ของฉัน {myOrders.length > 0 && `(${myOrders.length})`}
        </button>
      </div>

      {tab === "menu" ? (
        <>
          {/* Categories */}
          <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
            <CatChip
              active={activeCat === "all"}
              onClick={() => setActiveCat("all")}
              emoji="✨"
              label="ทั้งหมด"
            />
            {categories.map((c) => (
              <CatChip
                key={c.id}
                active={activeCat === c.id}
                onClick={() => setActiveCat(c.id)}
                emoji={c.emoji}
                label={c.name}
              />
            ))}
          </div>

          {/* Items */}
          <div className="mt-4 grid gap-3">
            {filtered.map((item) => {
              const qty = qtyOf(item.id);
              return (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-3xl bg-surface p-3 shadow-sm"
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 text-4xl">
                    {item.emoji}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start gap-2">
                      <h3 className="font-bold leading-tight">{item.name}</h3>
                      {item.popular && (
                        <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] font-bold text-secondary">
                          ฮิต
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted">
                      {item.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="font-extrabold text-primary">
                        {formatPrice(item.price, currency)}
                      </span>
                      {qty === 0 ? (
                        <Button
                          size="sm"
                          onClick={() => addToCart(tableId, item.id)}
                        >
                          + เพิ่ม
                        </Button>
                      ) : (
                        <Stepper
                          qty={qty}
                          onDec={() => decFromCart(tableId, item.id)}
                          onInc={() => addToCart(tableId, item.id)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <MyOrders orders={myOrders} currency={currency} />
      )}

      {/* Floating cart bar */}
      {cartCount > 0 && tab === "menu" && (
        <button
          onClick={() => setCartOpen(true)}
          className="animate-pop fixed inset-x-0 bottom-4 z-30 mx-auto flex max-w-md items-center justify-between rounded-full bg-primary px-5 py-3.5 text-white shadow-xl shadow-primary/30"
          style={{ width: "calc(100% - 2rem)" }}
        >
          <span className="flex items-center gap-2 font-semibold">
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/25 px-1.5 text-sm">
              {cartCount}
            </span>
            ดูตะกร้า
          </span>
          <span className="font-extrabold">
            {formatPrice(cartTotal, currency)}
          </span>
        </button>
      )}

      {/* Cart sheet */}
      {cartOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setCartOpen(false)}
          />
          <div className="animate-pop relative w-full max-w-md rounded-t-3xl bg-bg p-5 pb-8">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-black/15" />
            <h2 className="text-lg font-extrabold">ตะกร้าของคุณ</h2>
            <div className="mt-3 max-h-[45vh] space-y-2 overflow-y-auto">
              {cart.map((c) => {
                const item = menu.find((m) => m.id === c.menuItemId);
                if (!item) return null;
                return (
                  <div
                    key={c.menuItemId}
                    className="flex items-center gap-3 rounded-2xl bg-surface p-3"
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{item.name}</div>
                      <div className="text-xs text-muted">
                        {formatPrice(item.price, currency)}
                      </div>
                    </div>
                    <Stepper
                      qty={c.qty}
                      onDec={() => decFromCart(tableId, c.menuItemId)}
                      onInc={() => addToCart(tableId, c.menuItemId)}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between text-lg font-extrabold">
              <span>รวม</span>
              <span className="text-primary">
                {formatPrice(cartTotal, currency)}
              </span>
            </div>
            <Button
              size="lg"
              className="mt-4 w-full"
              onClick={onPlaceOrder}
            >
              สั่งเลย 🛎️
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}

function CatChip({
  active,
  onClick,
  emoji,
  label,
}: {
  active: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
        active ? "bg-primary text-white" : "bg-surface text-ink",
      )}
    >
      <span>{emoji}</span>
      {label}
    </button>
  );
}

function Stepper({
  qty,
  onDec,
  onInc,
}: {
  qty: number;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-primary/10 px-1.5 py-1">
      <button
        onClick={onDec}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-surface font-bold text-primary shadow-sm"
      >
        −
      </button>
      <span className="min-w-4 text-center text-sm font-bold">{qty}</span>
      <button
        onClick={onInc}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-bold text-white"
      >
        +
      </button>
    </div>
  );
}

function MyOrders({
  orders,
  currency,
}: {
  orders: import("@/store/useStore").Order[];
  currency: string;
}) {
  if (orders.length === 0) {
    return (
      <div className="mt-16 text-center">
        <div className="text-5xl">🧾</div>
        <p className="mt-3 text-muted">ยังไม่มีออเดอร์</p>
      </div>
    );
  }
  return (
    <div className="mt-4 space-y-3">
      {orders.map((o) => {
        const meta = STATUS_META[o.status];
        return (
          <div key={o.id} className="rounded-3xl bg-surface p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-bold",
                  meta.badge,
                )}
              >
                {meta.emoji} {meta.label}
              </span>
              <span className="text-xs text-muted">
                #{o.id.slice(-4).toUpperCase()}
              </span>
            </div>
            <div className="mt-3 space-y-1">
              {o.lines.map((l) => (
                <div
                  key={l.menuItemId}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {l.emoji} {l.name} × {l.qty}
                  </span>
                  <span className="text-muted">
                    {formatPrice(l.price * l.qty, currency)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-border pt-3 font-extrabold">
              <span>รวม</span>
              <span className="text-primary">
                {formatPrice(o.total, currency)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
