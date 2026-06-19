"use client";

import { useState } from "react";
import { useStore, type MenuItem } from "@/store/useStore";
import { useHydrated } from "@/hooks/useHydrated";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { cn, formatPrice } from "@/lib/utils";

type Draft = Omit<MenuItem, "id"> & { id?: string };

const EMPTY = (categoryId: string): Draft => ({
  name: "",
  description: "",
  price: 0,
  categoryId,
  emoji: "🍽️",
  popular: false,
  available: true,
});

export default function AdminMenu() {
  const hydrated = useHydrated();
  const currency = useStore((s) => s.currency);
  const categories = useStore((s) => s.categories);
  const menu = useStore((s) => s.menu);
  const addMenuItem = useStore((s) => s.addMenuItem);
  const updateMenuItem = useStore((s) => s.updateMenuItem);
  const removeMenuItem = useStore((s) => s.removeMenuItem);
  const toggleAvailable = useStore((s) => s.toggleAvailable);

  const [draft, setDraft] = useState<Draft | null>(null);

  function openNew() {
    setDraft(EMPTY(categories[0]?.id ?? ""));
  }

  function save() {
    if (!draft || !draft.name.trim()) return;
    if (draft.id) {
      const { id, ...patch } = draft;
      updateMenuItem(id, patch);
    } else {
      const { id: _omit, ...data } = draft;
      void _omit;
      addMenuItem(data);
    }
    setDraft(null);
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">เมนู</h1>
          <p className="text-sm text-muted">{menu.length} รายการ</p>
        </div>
        <Button onClick={openNew}>+ เพิ่มเมนู</Button>
      </div>

      {hydrated && (
        <div className="mt-6 space-y-6">
          {categories.map((cat) => {
            const items = menu.filter((m) => m.categoryId === cat.id);
            if (items.length === 0) return null;
            return (
              <section key={cat.id}>
                <h2 className="mb-2 text-sm font-bold text-muted">
                  {cat.emoji} {cat.name}
                </h2>
                <div className="grid gap-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-sm",
                        !item.available && "opacity-50",
                      )}
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                        {item.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold">
                          {item.name}
                          {item.popular && (
                            <span className="ml-2 text-xs text-secondary">★ ฮิต</span>
                          )}
                        </div>
                        <div className="text-sm text-muted">
                          {formatPrice(item.price, currency)}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleAvailable(item.id)}
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-bold",
                          item.available
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-200 text-gray-500",
                        )}
                      >
                        {item.available ? "ขายอยู่" : "ปิดขาย"}
                      </button>
                      <Button size="sm" variant="ghost" onClick={() => setDraft({ ...item })}>
                        แก้ไข
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          if (confirm(`ลบ "${item.name}"?`)) removeMenuItem(item.id);
                        }}
                      >
                        ลบ
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Editor modal */}
      {draft && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDraft(null)} />
          <div className="animate-pop relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-bg p-6 sm:rounded-3xl">
            <h2 className="text-lg font-extrabold">
              {draft.id ? "แก้ไขเมนู" : "เพิ่มเมนูใหม่"}
            </h2>
            <div className="mt-4 space-y-3">
              <div className="flex gap-3">
                <Field label="อิโมจิ" className="w-20">
                  <input
                    value={draft.emoji}
                    onChange={(e) => setDraft({ ...draft, emoji: e.target.value })}
                    className="w-full rounded-2xl bg-surface px-3 py-2.5 text-center text-2xl"
                    maxLength={2}
                  />
                </Field>
                <Field label="ชื่อเมนู" className="flex-1">
                  <input
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    placeholder="เช่น ข้าวกะเพรา"
                    className="w-full rounded-2xl bg-surface px-3 py-2.5"
                  />
                </Field>
              </div>
              <Field label="รายละเอียด">
                <input
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  placeholder="คำอธิบายสั้นๆ"
                  className="w-full rounded-2xl bg-surface px-3 py-2.5"
                />
              </Field>
              <div className="flex gap-3">
                <Field label="ราคา" className="flex-1">
                  <input
                    type="number"
                    value={draft.price}
                    onChange={(e) =>
                      setDraft({ ...draft, price: Number(e.target.value) })
                    }
                    className="w-full rounded-2xl bg-surface px-3 py-2.5"
                  />
                </Field>
                <Field label="หมวด" className="flex-1">
                  <select
                    value={draft.categoryId}
                    onChange={(e) =>
                      setDraft({ ...draft, categoryId: e.target.value })
                    }
                    className="w-full rounded-2xl bg-surface px-3 py-2.5"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.emoji} {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={!!draft.popular}
                  onChange={(e) => setDraft({ ...draft, popular: e.target.checked })}
                  className="h-4 w-4 accent-[var(--primary)]"
                />
                ทำเครื่องหมายเป็นเมนูฮิต ★
              </label>
            </div>
            <div className="mt-5 flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => setDraft(null)}>
                ยกเลิก
              </Button>
              <Button className="flex-1" onClick={save}>
                บันทึก
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-xs font-semibold text-muted">{label}</span>
      {children}
    </label>
  );
}
