"use client";

import { useMobileLayout } from "@/components/MobileLayoutProvider";
import type { ReactNode } from "react";

export function HomeDesktop({
  v1,
  v2,
  v3,
  v4,
}: {
  v1: ReactNode;
  v2: ReactNode;
  v3: ReactNode;
  v4: ReactNode;
}) {
  const { version, ready } = useMobileLayout();
  if (!ready) return <>{v1}</>;
  if (version === "v2") return <>{v2}</>;
  if (version === "v3") return <>{v3}</>;
  if (version === "v4") return <>{v4}</>;
  return <>{v1}</>;
}
