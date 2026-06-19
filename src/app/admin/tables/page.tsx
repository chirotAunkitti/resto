"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useStore, type Table } from "@/store/useStore";
import { useHydrated } from "@/hooks/useHydrated";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { getBusiness } from "@/config/restaurant.config";

export default function AdminTables() {
  const hydrated = useHydrated();
  const tables = useStore((s) => s.tables);
  const addTable = useStore((s) => s.addTable);
  const removeTable = useStore((s) => s.removeTable);
  const businessId = useStore((s) => s.businessId);
  const b = getBusiness(businessId);

  const [origin, setOrigin] = useState("");
  const [zoom, setZoom] = useState<Table | null>(null);

  useEffect(() => setOrigin(window.location.origin), []);

  const menuUrl = (t: Table) => `${origin}/menu?table=${t.id}`;

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">โต๊ะ & QR Code</h1>
          <p className="text-sm text-muted">
            {tables.length} โต๊ะ · ลูกค้าสแกนเพื่อเปิดเมนูของโต๊ะนั้น
          </p>
        </div>
        <Button onClick={addTable}>+ เพิ่มโต๊ะ</Button>
      </div>

      {hydrated && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {tables.map((t) => (
            <div
              key={t.id}
              className="flex flex-col items-center rounded-3xl bg-surface p-4 shadow-sm"
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-extrabold">โต๊ะ {t.number}</span>
                <button
                  onClick={() => {
                    if (confirm(`ลบโต๊ะ ${t.number}?`)) removeTable(t.id);
                  }}
                  className="text-xs text-red-500"
                >
                  ลบ
                </button>
              </div>
              <button
                onClick={() => setZoom(t)}
                className="mt-3 rounded-2xl bg-white p-3 shadow-inner"
                aria-label={`ดู QR โต๊ะ ${t.number}`}
              >
                {origin ? (
                  <QRCodeSVG value={menuUrl(t)} size={104} level="M" />
                ) : (
                  <div className="h-[104px] w-[104px]" />
                )}
              </button>
              <Button
                size="sm"
                variant="soft"
                className="mt-3 w-full"
                onClick={() => setZoom(t)}
              >
                ดู / พิมพ์
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* QR zoom / print modal */}
      {zoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/50" onClick={() => setZoom(null)} />
          <div className="qr-print animate-pop relative w-full max-w-xs rounded-3xl bg-white p-6 text-center text-black">
            <div className="text-3xl">{b.logo}</div>
            <div className="mt-1 font-extrabold">{b.name}</div>
            <div className="text-sm text-gray-500">สแกนเพื่อสั่งอาหาร</div>
            <div className="my-4 flex justify-center">
              <QRCodeSVG value={menuUrl(zoom)} size={220} level="M" />
            </div>
            <div className="text-2xl font-extrabold">โต๊ะ {zoom.number}</div>
            <div className="mt-1 break-all text-[10px] text-gray-400">
              {menuUrl(zoom)}
            </div>
            <div className="no-print mt-5 flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => setZoom(null)}>
                ปิด
              </Button>
              <Button className="flex-1" onClick={() => window.print()}>
                พิมพ์
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
