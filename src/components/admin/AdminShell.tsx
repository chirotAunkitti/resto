"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { getBusiness } from "@/config/restaurant.config";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "แดชบอร์ด", emoji: "📊" },
  { href: "/admin/menu", label: "เมนู", emoji: "🍽️" },
  { href: "/admin/tables", label: "โต๊ะ & QR", emoji: "🔳" },
  { href: "/kitchen", label: "จอครัว", emoji: "👨‍🍳" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const businessId = useStore((s) => s.businessId);
  const b = getBusiness(businessId);

  return (
    <div className="min-h-screen md:flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-surface p-5 md:block">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">{b.logo}</span>
          <span className="font-extrabold leading-tight">{b.name}</span>
        </Link>
        <nav className="mt-8 space-y-1">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors",
                  active ? "bg-primary text-white" : "text-ink hover:bg-black/5",
                )}
              >
                <span>{n.emoji}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl">
            {b.logo}
          </Link>
          <span className="font-extrabold">{b.name} · แอดมิน</span>
        </div>
        <nav className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold",
                  active ? "bg-primary text-white" : "bg-surface text-ink",
                )}
              >
                {n.emoji} {n.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
    </div>
  );
}
