"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";
import { getBusiness } from "@/config/restaurant.config";
import { BusinessSwitcher } from "@/components/BusinessSwitcher";

export default function Home() {
  const businessId = useStore((s) => s.businessId);
  const b = getBusiness(businessId);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-8">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold tracking-wide text-muted">
          POWERED BY GAT
        </span>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Demo
        </span>
      </div>

      <div className="mt-10 text-center">
        <div className="text-6xl">{b.logo}</div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">{b.name}</h1>
        <p className="mt-2 text-muted">{b.tagline}</p>
      </div>

      <div className="mt-10 grid gap-3">
        <RoleCard
          href="/menu"
          emoji="📱"
          title="ลูกค้า — สแกนโต๊ะสั่งอาหาร"
          desc="เลือกเมนู ใส่ตะกร้า แล้วสั่งได้เลย"
          highlight
        />
        <RoleCard
          href="/kitchen"
          emoji="👨‍🍳"
          title="ครัว — จอรับออเดอร์"
          desc="ออเดอร์เด้งเข้ามาแบบเรียลไทม์"
        />
        <RoleCard
          href="/admin"
          emoji="⚙️"
          title="แอดมิน — จัดการร้าน"
          desc="เมนู โต๊ะ QR code และออเดอร์"
        />
      </div>

      <div className="mt-10 rounded-3xl bg-surface p-5 shadow-sm">
        <p className="text-sm font-semibold">ลองเปลี่ยนประเภทร้าน</p>
        <p className="mb-3 text-xs text-muted">
          เทมเพลตเดียว ปรับเป็นได้หลายธุรกิจ
        </p>
        <BusinessSwitcher />
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        เคล็ดลับ: เปิดหน้า “ครัว” อีกแท็บ แล้วลองสั่งจากหน้าลูกค้า
        ออเดอร์จะเด้งเข้าครัวทันที 🔔
      </p>
    </main>
  );
}

function RoleCard({
  href,
  emoji,
  title,
  desc,
  highlight,
}: {
  href: string;
  emoji: string;
  title: string;
  desc: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 rounded-3xl p-5 shadow-sm transition-all active:scale-[0.98] ${
        highlight
          ? "bg-primary text-white shadow-lg shadow-primary/25"
          : "bg-surface text-ink"
      }`}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="flex-1">
        <span className="block font-bold">{title}</span>
        <span
          className={`block text-sm ${highlight ? "text-white/80" : "text-muted"}`}
        >
          {desc}
        </span>
      </span>
      <span className="text-xl opacity-60">›</span>
    </Link>
  );
}
