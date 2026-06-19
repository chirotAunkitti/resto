"use client";

import { useEffect } from "react";
import { initStoreSync, useStore } from "@/store/useStore";
import { getBusiness } from "@/config/restaurant.config";

/**
 * Initialises store hydration + cross-tab realtime sync, and applies the
 * active business theme colors as CSS variables on the document root.
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const businessId = useStore((s) => s.businessId);

  useEffect(() => {
    const cleanup = initStoreSync();
    return cleanup;
  }, []);

  useEffect(() => {
    const b = getBusiness(businessId);
    const root = document.documentElement;
    root.style.setProperty("--primary", b.theme.primary);
    root.style.setProperty("--secondary", b.theme.secondary);
    root.style.setProperty("--bg", b.theme.bg);
    root.style.setProperty("--surface", b.theme.surface);
  }, [businessId]);

  return <>{children}</>;
}
