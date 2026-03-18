"use client";

import React from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { JournalShell } from "@/components/journal-primitives";

export function PrototypeAppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/app";

  return <JournalShell currentPath={pathname}>{children}</JournalShell>;
}
