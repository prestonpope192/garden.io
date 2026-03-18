import type { ReactNode } from "react";
import { PrototypeAppFrame } from "@/components/prototype-app-frame";

export default function PrototypeLayout({ children }: { children: ReactNode }) {
  return <PrototypeAppFrame>{children}</PrototypeAppFrame>;
}
