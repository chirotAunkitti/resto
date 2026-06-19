import type { OrderStatus } from "@/store/useStore";

export const STATUS_META: Record<
  OrderStatus,
  { label: string; emoji: string; badge: string; next: OrderStatus | null; nextLabel: string }
> = {
  new: {
    label: "ออเดอร์ใหม่",
    emoji: "🆕",
    badge: "bg-blue-100 text-blue-700",
    next: "cooking",
    nextLabel: "เริ่มทำ",
  },
  cooking: {
    label: "กำลังทำ",
    emoji: "👨‍🍳",
    badge: "bg-amber-100 text-amber-700",
    next: "ready",
    nextLabel: "ทำเสร็จ",
  },
  ready: {
    label: "พร้อมเสิร์ฟ",
    emoji: "🔔",
    badge: "bg-emerald-100 text-emerald-700",
    next: "served",
    nextLabel: "เสิร์ฟแล้ว",
  },
  served: {
    label: "เสิร์ฟแล้ว",
    emoji: "✅",
    badge: "bg-gray-100 text-gray-500",
    next: null,
    nextLabel: "",
  },
  cancelled: {
    label: "ยกเลิก",
    emoji: "❌",
    badge: "bg-red-100 text-red-600",
    next: null,
    nextLabel: "",
  },
};

export const ACTIVE_STATUSES: OrderStatus[] = ["new", "cooking", "ready"];
