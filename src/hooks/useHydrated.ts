"use client";

import { useEffect, useState } from "react";

/** True once the client has mounted (store rehydrated). Avoids SSR mismatch. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
