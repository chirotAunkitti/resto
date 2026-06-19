"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/hooks/useHydrated";
import { AdminShell } from "@/components/admin/AdminShell";
import { BusinessSwitcher } from "@/components/BusinessSwitcher";
import { Button } from "@/components/ui/Button";
import { ACTIVE_STATUSES } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
  const hydrated = useHydrated();
  const currency = useStore((s) => s.currency);
  const menu = useStore((s) => s.menu);
  const tables = useStore((s) => s.tables);
  const orders = useStore((s) => s.orders);
  const resetDemo = useStore((s) => s.resetDemo);

  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);
  const activeCount = orders.filter((o) =>
    ACTIVE_STATUSES.includes(o.status),
  ).length;

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">แดชบอร์ด</h1>
          <p className="text-sm text-muted">ภาพรวมร้านของคุณ</p>
        </div>
        <Button
          variant="soft"
          size="sm"
          onClick={() => {
            if (confirm("รีเซ็ตข้อมูลเดโมทั้งหมด?")) resetDemo();
          }}
        >
          รีเซ็ตเดโม
        </Button>
      </div>

      {hydrated && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="รายได้" value={formatPrice(revenue, currency)} emoji="💰" />
            <Stat label="ออเดอร์ทั้งหมด" value={`${orders.length}`} emoji="🧾" />
            <Stat label="กำลังทำ" value={`${activeCount}`} emoji="🔥" />
            <Stat label="เมนู / โต๊ะ" value={`${menu.length} / ${tables.length}`} emoji="📋" />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <Link
              href="/admin/menu"
              className="rounded-3xl bg-surface p-5 shadow-sm transition-transform active:scale-[0.99]"
            >
              <div className="text-3xl">🍽️</div>
              <div className="mt-2 font-bold">จัดการเมนู</div>
              <div className="text-sm text-muted">เพิ่ม แก้ไข ลบ เปิด/ปิดขาย</div>
            </Link>
            <Link
              href="/admin/tables"
              className="rounded-3xl bg-surface p-5 shadow-sm transition-transform active:scale-[0.99]"
            >
              <div className="text-3xl">🔳</div>
              <div className="mt-2 font-bold">โต๊ะ & QR Code</div>
              <div className="text-sm text-muted">เพิ่มโต๊ะ และสร้าง QR ให้ลูกค้าสแกน</div>
            </Link>
          </div>

          <div className="mt-6 rounded-3xl bg-surface p-5 shadow-sm">
            <h2 className="font-bold">ประเภทร้าน</h2>
            <p className="mb-3 text-sm text-muted">
              เปลี่ยนได้ทันที — เทมเพลตเดียวรองรับหลายธุรกิจ
            </p>
            <BusinessSwitcher />
          </div>
        </>
      )}
    </AdminShell>
  );
}

function Stat({
  label,
  value,
  emoji,
}: {
  label: string;
  value: string;
  emoji: string;
}) {
  return (
    <div className="rounded-3xl bg-surface p-4 shadow-sm">
      <div className="text-2xl">{emoji}</div>
      <div className="mt-2 text-xl font-extrabold">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
