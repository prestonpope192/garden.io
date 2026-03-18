import React from "react";
import type { SVGProps } from "react";

export type FieldIconName =
  | "sun"
  | "water"
  | "soil"
  | "pollinator"
  | "leaf"
  | "calendar"
  | "sprout"
  | "journal";

type FieldIconProps = SVGProps<SVGSVGElement> & {
  name: FieldIconName;
};

function baseProps(props: SVGProps<SVGSVGElement>) {
  return {
    viewBox: "0 0 64 64",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    "aria-hidden": true,
    ...props
  };
}

export function FieldIcon({ name, ...props }: FieldIconProps) {
  if (name === "sun") {
    return (
      <svg {...baseProps(props)}>
        <circle cx="32" cy="32" r="10" />
        <path d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M49 15l-6 6M21 43l-6 6" />
      </svg>
    );
  }

  if (name === "water") {
    return (
      <svg {...baseProps(props)}>
        <path d="M32 10C23 21 18 28 18 36a14 14 0 0 0 28 0c0-8-5-15-14-26Z" />
        <path d="M25 40c1.6 2.5 3.8 3.8 6.7 3.8 2.8 0 5.1-1.3 6.8-3.8" />
      </svg>
    );
  }

  if (name === "soil") {
    return (
      <svg {...baseProps(props)}>
        <path d="M10 20h44v6c0 7-5 12-12 12H22c-7 0-12-5-12-12v-6Z" />
        <path d="M16 20c4-7 10-10 16-10s12 3 16 10" />
        <path d="M19 33c4 0 4 5 8 5s4-5 8-5 4 5 8 5" />
        <path d="M18 45h28" />
      </svg>
    );
  }

  if (name === "pollinator") {
    return (
      <svg {...baseProps(props)}>
        <path d="M22 33c0-7 4-11 10-11s10 4 10 11-4 11-10 11-10-4-10-11Z" />
        <path d="M25 29h14M24 33h16M26 37h12" />
        <path d="M24 24c-4-5-8-7-12-5 1 5 4 9 10 10M40 24c4-5 8-7 12-5-1 5-4 9-10 10" />
        <path d="M29 22c-1-4-3-7-6-8M35 22c1-4 3-7 6-8M30 44l-4 8M34 44l4 8" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg {...baseProps(props)}>
        <rect x="12" y="14" width="40" height="36" rx="4" />
        <path d="M20 10v8M44 10v8M12 24h40M20 32h8M36 32h8M20 40h8M36 40h8" />
      </svg>
    );
  }

  if (name === "sprout") {
    return (
      <svg {...baseProps(props)}>
        <path d="M32 52V31" />
        <path d="M31 31c-8 1-15-3-18-11 10-1 17 3 18 11Z" />
        <path d="M33 35c2-9 9-15 20-16-1 11-8 17-20 16Z" />
        <path d="M22 52h20" />
      </svg>
    );
  }

  if (name === "journal") {
    return (
      <svg {...baseProps(props)}>
        <path d="M18 12h22c4 0 6 2 6 6v32H24c-4 0-6-2-6-6V12Z" />
        <path d="M18 18h22M24 24h14M24 31h14M24 38h10" />
        <path d="M18 12v32c0 4 2 6 6 6" />
      </svg>
    );
  }

  return (
    <svg {...baseProps(props)}>
      <path d="M33 52c-7-4-13-11-16-21-3-10 0-17 9-19 5 0 8 2 10 7 2-5 5-7 10-7 9 2 12 9 9 19-3 10-9 17-16 21-2 1-4 1-6 0Z" />
      <path d="M32 18v34" />
    </svg>
  );
}
