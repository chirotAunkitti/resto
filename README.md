# Resto — QR Ordering System

A cute, mobile-first **scan-to-order** template for restaurants, cafés, shabu and steak houses.
Customers scan a table QR → browse the menu → order → the order appears on the **kitchen display** in real time. Owners manage the menu and tables (with auto-generated QR codes) from a simple admin.

One template, four ready-made business presets: **Shabu · Café · Steak · Restaurant**.

> เทมเพลตระบบสั่งอาหารผ่าน QR แบบตี๋น้อย — สแกนโต๊ะ สั่งอาหาร ออเดอร์เด้งเข้าครัวทันที พร้อมหลังบ้านจัดการเมนู/โต๊ะ/QR เปลี่ยนเป็นร้านชาบู สเต็ก คาเฟ่ หรือร้านอาหารได้ในคลิกเดียว

## Features

- 📱 **Customer** — scan table QR, browse by category, add to cart, place order, track status
- 👨‍🍳 **Kitchen (KDS)** — real-time order board, advance status (new → cooking → ready → served)
- ⚙️ **Admin** — full CRUD for menu items (price, category, emoji, popular, in/out of stock) and tables (auto QR code per table, print-ready)
- 🎨 **Multi-business** — switch between shabu / café / steak / restaurant; colors, name and seed menu all change
- 🔔 **Realtime, no backend** — orders sync across tabs/devices on the same browser via `BroadcastChannel` + `localStorage` (demo mode). Designed to swap to Supabase/Postgres for production multi-device realtime.
- 📐 Mobile-first, responsive, rounded & playful UI

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>:

- `/` — pick a role (customer / kitchen / admin)
- `/menu?table=t1` — customer menu for table 1 (this is what a QR points to)
- `/kitchen` — kitchen display
- `/admin` — dashboard · `/admin/menu` · `/admin/tables`

> Tip: open `/kitchen` in one tab and `/menu?table=t1` in another, then place an order — it pops into the kitchen instantly.

## Make it yours

Edit **`src/config/restaurant.config.ts`** — branding, theme colors, categories and the seed menu for each business preset. Set `DEFAULT_BUSINESS` to your shop type. Everything else (menu items, tables) is then editable live from the admin.

## Going to production (real multi-device realtime)

Demo mode stores data per-browser. For a real shop where the kitchen runs on a different device than customers, swap the data layer in `src/store/useStore.ts` for a hosted database with realtime (Supabase Postgres recommended): keep the same action names (`placeOrder`, `setOrderStatus`, …) and back them with Supabase tables + realtime channels.

## Tech

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Zustand · qrcode.react

---

Part of the **GAT** template line.
