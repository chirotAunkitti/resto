"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  DEFAULT_BUSINESS,
  getBusiness,
  type Category,
} from "@/config/restaurant.config";
import { uid } from "@/lib/utils";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  emoji: string;
  image?: string;
  popular?: boolean;
  available: boolean;
};

export type Table = { id: string; number: number };

export type CartItem = { menuItemId: string; qty: number };

export type OrderStatus = "new" | "cooking" | "ready" | "served" | "cancelled";

export type OrderLine = {
  menuItemId: string;
  name: string;
  emoji: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  tableId: string;
  tableNumber: number;
  lines: OrderLine[];
  total: number;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
};

type State = {
  businessId: string;
  currency: string;
  categories: Category[];
  menu: MenuItem[];
  tables: Table[];
  orders: Order[];
  carts: Record<string, CartItem[]>;
};

type Actions = {
  setBusiness: (id: string) => void;
  resetDemo: () => void;
  // menu
  addMenuItem: (data: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, patch: Partial<MenuItem>) => void;
  removeMenuItem: (id: string) => void;
  toggleAvailable: (id: string) => void;
  // tables
  addTable: () => void;
  removeTable: (id: string) => void;
  // cart
  addToCart: (tableId: string, menuItemId: string) => void;
  decFromCart: (tableId: string, menuItemId: string) => void;
  clearCart: (tableId: string) => void;
  // orders
  placeOrder: (tableId: string) => string | null;
  setOrderStatus: (orderId: string, status: OrderStatus) => void;
};

function seed(businessId: string): State {
  const b = getBusiness(businessId);
  return {
    businessId: b.id,
    currency: b.currency,
    categories: b.categories,
    menu: b.menu.map((m) => ({ ...m, available: true })),
    tables: Array.from({ length: b.tableCount }, (_, i) => ({
      id: `t${i + 1}`,
      number: i + 1,
    })),
    orders: [],
    carts: {},
  };
}

// --- cross-tab realtime -----------------------------------------------------
let channel: BroadcastChannel | null = null;
function getChannel() {
  if (typeof window === "undefined") return null;
  if (!channel && "BroadcastChannel" in window) {
    channel = new BroadcastChannel("resto-sync");
  }
  return channel;
}
function broadcast() {
  getChannel()?.postMessage({ t: Date.now() });
}

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...seed(DEFAULT_BUSINESS),

      setBusiness: (id) => {
        set(seed(id));
        broadcast();
      },

      resetDemo: () => {
        set(seed(get().businessId));
        broadcast();
      },

      addMenuItem: (data) => {
        set((s) => ({ menu: [...s.menu, { ...data, id: uid("m") }] }));
        broadcast();
      },

      updateMenuItem: (id, patch) => {
        set((s) => ({
          menu: s.menu.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        }));
        broadcast();
      },

      removeMenuItem: (id) => {
        set((s) => ({ menu: s.menu.filter((m) => m.id !== id) }));
        broadcast();
      },

      toggleAvailable: (id) => {
        set((s) => ({
          menu: s.menu.map((m) =>
            m.id === id ? { ...m, available: !m.available } : m,
          ),
        }));
        broadcast();
      },

      addTable: () => {
        set((s) => {
          const next =
            s.tables.reduce((max, t) => Math.max(max, t.number), 0) + 1;
          return { tables: [...s.tables, { id: uid("t"), number: next }] };
        });
        broadcast();
      },

      removeTable: (id) => {
        set((s) => ({ tables: s.tables.filter((t) => t.id !== id) }));
        broadcast();
      },

      addToCart: (tableId, menuItemId) => {
        set((s) => {
          const cart = s.carts[tableId] ?? [];
          const existing = cart.find((c) => c.menuItemId === menuItemId);
          const nextCart = existing
            ? cart.map((c) =>
                c.menuItemId === menuItemId ? { ...c, qty: c.qty + 1 } : c,
              )
            : [...cart, { menuItemId, qty: 1 }];
          return { carts: { ...s.carts, [tableId]: nextCart } };
        });
        broadcast();
      },

      decFromCart: (tableId, menuItemId) => {
        set((s) => {
          const cart = s.carts[tableId] ?? [];
          const nextCart = cart
            .map((c) =>
              c.menuItemId === menuItemId ? { ...c, qty: c.qty - 1 } : c,
            )
            .filter((c) => c.qty > 0);
          return { carts: { ...s.carts, [tableId]: nextCart } };
        });
        broadcast();
      },

      clearCart: (tableId) => {
        set((s) => ({ carts: { ...s.carts, [tableId]: [] } }));
        broadcast();
      },

      placeOrder: (tableId) => {
        const s = get();
        const cart = s.carts[tableId] ?? [];
        if (cart.length === 0) return null;
        const table = s.tables.find((t) => t.id === tableId);
        const lines: OrderLine[] = cart
          .map((c) => {
            const item = s.menu.find((m) => m.id === c.menuItemId);
            if (!item) return null;
            return {
              menuItemId: item.id,
              name: item.name,
              emoji: item.emoji,
              price: item.price,
              qty: c.qty,
            };
          })
          .filter((l): l is OrderLine => l !== null);
        const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
        const now = Date.now();
        const order: Order = {
          id: uid("ord"),
          tableId,
          tableNumber: table?.number ?? 0,
          lines,
          total,
          status: "new",
          createdAt: now,
          updatedAt: now,
        };
        set((st) => ({
          orders: [order, ...st.orders],
          carts: { ...st.carts, [tableId]: [] },
        }));
        broadcast();
        return order.id;
      },

      setOrderStatus: (orderId, status) => {
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId ? { ...o, status, updatedAt: Date.now() } : o,
          ),
        }));
        broadcast();
      },
    }),
    {
      name: "resto-store",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

/** Initialise cross-tab sync + hydration. Call once on the client. */
export function initStoreSync() {
  useStore.persist.rehydrate();
  const ch = getChannel();
  const onSync = () => useStore.persist.rehydrate();
  ch?.addEventListener("message", onSync);
  const onStorage = (e: StorageEvent) => {
    if (e.key === "resto-store") useStore.persist.rehydrate();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    ch?.removeEventListener("message", onSync);
    window.removeEventListener("storage", onStorage);
  };
}
