/**
 * ============================================================================
 *  restaurant.config.ts — multi-business presets
 *  เปลี่ยนร้านได้จากที่นี่: คาเฟ่ / สเต็ก / ชาบู / ร้านอาหาร
 *  ----------------------------------------------------------------------------
 *  Each preset defines branding, theme colors, menu categories and a seed menu.
 *  Switch the active business in the app (demo switcher) or change DEFAULT_BUSINESS.
 * ============================================================================
 */

export type Category = { id: string; name: string; emoji: string };

export type MenuItemSeed = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  emoji: string;
  /** Optional image URL; falls back to emoji + gradient. */
  image?: string;
  popular?: boolean;
};

export type BusinessTheme = {
  primary: string;
  secondary: string;
  bg: string;
  surface: string;
};

export type BusinessPreset = {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  currency: string;
  theme: BusinessTheme;
  categories: Category[];
  menu: MenuItemSeed[];
  tableCount: number;
};

export const businesses: BusinessPreset[] = [
  {
    id: "shabu",
    name: "Tao Shabu",
    logo: "🍲",
    tagline: "ชาบูหม้อเดี่ยว สแกนสั่งได้เลย",
    currency: "฿",
    theme: {
      primary: "#e23744",
      secondary: "#ff8a3d",
      bg: "#fff7f3",
      surface: "#ffffff",
    },
    categories: [
      { id: "set", name: "เซ็ต", emoji: "🍲" },
      { id: "meat", name: "เนื้อสัตว์", emoji: "🥩" },
      { id: "veggie", name: "ผัก", emoji: "🥬" },
      { id: "side", name: "ของทานเล่น", emoji: "🍤" },
      { id: "drink", name: "เครื่องดื่ม", emoji: "🥤" },
    ],
    menu: [
      { id: "s1", name: "เซ็ตหมูสไลซ์", description: "หมูสไลซ์ 250g + น้ำซุป", price: 199, categoryId: "set", emoji: "🍲", popular: true },
      { id: "s2", name: "เซ็ตเนื้อพรีเมียม", description: "เนื้อนำเข้า 250g + น้ำซุป", price: 359, categoryId: "set", emoji: "🥩", popular: true },
      { id: "m1", name: "หมูสามชั้นสไลซ์", description: "หั่นบางนุ่มละมุน", price: 89, categoryId: "meat", emoji: "🥓" },
      { id: "m2", name: "เนื้อวากิว A5", description: "ละลายในปาก", price: 299, categoryId: "meat", emoji: "🥩" },
      { id: "v1", name: "ผักรวมหม้อไฟ", description: "ผักสดตามฤดูกาล", price: 69, categoryId: "veggie", emoji: "🥬" },
      { id: "v2", name: "เห็ดรวม", description: "เห็ดเข็มทอง เห็ดหอม", price: 59, categoryId: "veggie", emoji: "🍄" },
      { id: "sd1", name: "เกี๊ยวกุ้ง", description: "6 ชิ้น", price: 79, categoryId: "side", emoji: "🍤" },
      { id: "d1", name: "ชาเขียวเย็น", description: "หอมชื่นใจ", price: 45, categoryId: "drink", emoji: "🍵" },
    ],
    tableCount: 8,
  },
  {
    id: "cafe",
    name: "Cozy Café",
    logo: "☕",
    tagline: "กาแฟอุ่นๆ กับขนมน่ารัก",
    currency: "฿",
    theme: {
      primary: "#a1683a",
      secondary: "#d9a76a",
      bg: "#fbf6f0",
      surface: "#ffffff",
    },
    categories: [
      { id: "coffee", name: "กาแฟ", emoji: "☕" },
      { id: "tea", name: "ชา & อื่นๆ", emoji: "🧋" },
      { id: "bakery", name: "เบเกอรี่", emoji: "🥐" },
      { id: "dessert", name: "ของหวาน", emoji: "🍰" },
    ],
    menu: [
      { id: "c1", name: "ลาเต้ร้อน", description: "นมสตีมนุ่มละมุน", price: 75, categoryId: "coffee", emoji: "☕", popular: true },
      { id: "c2", name: "อเมริกาโน่เย็น", description: "เข้มสดชื่น", price: 70, categoryId: "coffee", emoji: "🧊" },
      { id: "c3", name: "คาปูชิโน่", description: "ฟองนมหนานุ่ม", price: 80, categoryId: "coffee", emoji: "☕" },
      { id: "t1", name: "มัทฉะลาเต้", description: "มัทฉะแท้เกรดพรีเมียม", price: 90, categoryId: "tea", emoji: "🍵", popular: true },
      { id: "t2", name: "ชานมไข่มุก", description: "ไข่มุกหนึบหนับ", price: 85, categoryId: "tea", emoji: "🧋" },
      { id: "b1", name: "ครัวซองต์เนย", description: "อบใหม่ทุกเช้า", price: 65, categoryId: "bakery", emoji: "🥐" },
      { id: "ds1", name: "ชีสเค้ก", description: "นุ่มเนียนละลายในปาก", price: 95, categoryId: "dessert", emoji: "🍰", popular: true },
      { id: "ds2", name: "บราวนี่", description: "เข้มข้นช็อกโกแลต", price: 75, categoryId: "dessert", emoji: "🍫" },
    ],
    tableCount: 6,
  },
  {
    id: "steak",
    name: "Prime Steak",
    logo: "🥩",
    tagline: "สเต็กชิ้นโต ย่างกำลังดี",
    currency: "฿",
    theme: {
      primary: "#b23a2e",
      secondary: "#c89b3c",
      bg: "#f6f1ec",
      surface: "#ffffff",
    },
    categories: [
      { id: "steak", name: "สเต็ก", emoji: "🥩" },
      { id: "starter", name: "เรียกน้ำย่อย", emoji: "🥗" },
      { id: "side", name: "เครื่องเคียง", emoji: "🍟" },
      { id: "drink", name: "เครื่องดื่ม", emoji: "🍷" },
    ],
    menu: [
      { id: "st1", name: "ริบอายสเต็ก", description: "200g ย่างมีเดียมแรร์", price: 420, categoryId: "steak", emoji: "🥩", popular: true },
      { id: "st2", name: "เทนเดอร์ลอยน์", description: "เนื้อสันในนุ่มสุด", price: 480, categoryId: "steak", emoji: "🥩", popular: true },
      { id: "st3", name: "พอร์คช็อป", description: "หมูคุโรบุตะ", price: 320, categoryId: "steak", emoji: "🐖" },
      { id: "sa1", name: "ซีซาร์สลัด", description: "ผักกรอบ น้ำสลัดเข้มข้น", price: 150, categoryId: "starter", emoji: "🥗" },
      { id: "sa2", name: "ซุปเห็ด", description: "ครีมเห็ดทรัฟเฟิล", price: 130, categoryId: "starter", emoji: "🍲" },
      { id: "sd1", name: "เฟรนช์ฟรายส์", description: "กรอบนอกนุ่มใน", price: 90, categoryId: "side", emoji: "🍟" },
      { id: "sd2", name: "มันบด", description: "เนียนนุ่มหอมเนย", price: 90, categoryId: "side", emoji: "🥔" },
      { id: "dr1", name: "ไวน์แดงแก้ว", description: "เฮาส์ไวน์", price: 180, categoryId: "drink", emoji: "🍷" },
    ],
    tableCount: 10,
  },
  {
    id: "restaurant",
    name: "Baan Aharn",
    logo: "🍽️",
    tagline: "อาหารตามสั่ง อร่อยทุกจาน",
    currency: "฿",
    theme: {
      primary: "#2f9e6f",
      secondary: "#f2b705",
      bg: "#f3f8f4",
      surface: "#ffffff",
    },
    categories: [
      { id: "rice", name: "ข้าว", emoji: "🍚" },
      { id: "noodle", name: "เส้น", emoji: "🍜" },
      { id: "dish", name: "กับข้าว", emoji: "🍳" },
      { id: "drink", name: "เครื่องดื่ม", emoji: "🥤" },
    ],
    menu: [
      { id: "r1", name: "ข้าวกะเพราหมูสับ", description: "ไข่ดาวกรอบๆ", price: 60, categoryId: "rice", emoji: "🍚", popular: true },
      { id: "r2", name: "ข้าวผัดปู", description: "เนื้อปูแน่นๆ", price: 120, categoryId: "rice", emoji: "🦀" },
      { id: "n1", name: "ผัดไทยกุ้งสด", description: "รสกลมกล่อม", price: 80, categoryId: "noodle", emoji: "🍤", popular: true },
      { id: "n2", name: "ก๋วยเตี๋ยวต้มยำ", description: "เผ็ดเปรี้ยวจัดจ้าน", price: 70, categoryId: "noodle", emoji: "🍜" },
      { id: "d1", name: "ต้มยำกุ้ง", description: "น้ำข้นรสจัด", price: 180, categoryId: "dish", emoji: "🍲", popular: true },
      { id: "d2", name: "ไข่เจียวหมูสับ", description: "ฟูกรอบ", price: 50, categoryId: "dish", emoji: "🍳" },
      { id: "dr1", name: "ชาไทยเย็น", description: "หอมหวานมัน", price: 40, categoryId: "drink", emoji: "🧡" },
      { id: "dr2", name: "น้ำเปล่า", description: "เย็นชื่นใจ", price: 15, categoryId: "drink", emoji: "💧" },
    ],
    tableCount: 12,
  },
];

export const DEFAULT_BUSINESS = "shabu";

export function getBusiness(id: string): BusinessPreset {
  return businesses.find((b) => b.id === id) ?? businesses[0];
}
