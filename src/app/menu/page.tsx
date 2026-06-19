import { Suspense } from "react";
import { MenuClient } from "@/components/menu/MenuClient";

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted">กำลังโหลด…</div>}>
      <MenuClient />
    </Suspense>
  );
}
