import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/providers/AppProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resto — Scan, order, serve",
  description:
    "A cute, mobile-first QR ordering system for restaurants, cafés, shabu and steak houses. Scan a table, order, and watch it hit the kitchen in real time.",
};

export const viewport: Viewport = {
  themeColor: "#e23744",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={geistSans.variable}>
      <body className="min-h-screen">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
