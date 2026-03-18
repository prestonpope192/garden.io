import React from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import { FieldIcon, type FieldIconName } from "@/components/field-icons";

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

type SpecimenLabelProps = {
  children: ReactNode;
  tone?: "default" | "olive" | "clay";
  className?: string;
};

export function SpecimenLabel({
  children,
  tone = "default",
  className
}: SpecimenLabelProps) {
  return <span className={cx("specimen-label", `specimen-label--${tone}`, className)}>{children}</span>;
}

type MarginNoteProps = {
  title: string;
  children: ReactNode;
  icon?: FieldIconName;
  className?: string;
};

export function MarginNote({ title, children, icon = "journal", className }: MarginNoteProps) {
  return (
    <aside className={cx("margin-note", className)}>
      <div className="margin-note__head">
        <FieldIcon className="field-icon" name={icon} />
        <span>{title}</span>
      </div>
      <div className="margin-note__body">{children}</div>
    </aside>
  );
}

type InkStampProps = {
  children: ReactNode;
  tone?: "olive" | "charcoal";
  className?: string;
};

export function InkStamp({ children, tone = "olive", className }: InkStampProps) {
  return <div className={cx("ink-stamp", `ink-stamp--${tone}`, className)}>{children}</div>;
}

type PlateCardProps = {
  plateNumber: string;
  title: string;
  subtitle: string;
  illustration?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function PlateCard({
  plateNumber,
  title,
  subtitle,
  illustration,
  children,
  className
}: PlateCardProps) {
  return (
    <article className={cx("plate-card", className)}>
      <div className="plate-card__head">
        <SpecimenLabel tone="clay">Plate {plateNumber}</SpecimenLabel>
        <span className="plate-card__rule" />
      </div>
      {illustration ? <div className="plate-card__illustration">{illustration}</div> : null}
      <div className="plate-card__body">
        <h3>{title}</h3>
        <p className="plate-card__subtitle">{subtitle}</p>
        {children}
      </div>
    </article>
  );
}

type JournalPageProps = {
  side: "left" | "right";
  folio: string;
  label: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function JournalPage({
  side,
  folio,
  label,
  title,
  subtitle,
  children,
  className
}: JournalPageProps) {
  return (
    <article className={cx("journal-page", `journal-page--${side}`, className)}>
      <header className="journal-page__header">
        <div>
          <SpecimenLabel>{label}</SpecimenLabel>
          <h2>{title}</h2>
          {subtitle ? <p className="journal-page__subtitle">{subtitle}</p> : null}
        </div>
        <div className="journal-page__folio">Folio {folio}</div>
      </header>
      <div className="journal-page__body">{children}</div>
    </article>
  );
}

type JournalSpreadProps = {
  children: ReactNode;
  className?: string;
};

export function JournalSpread({ children, className }: JournalSpreadProps) {
  return <section className={cx("journal-spread", className)}>{children}</section>;
}

const prototypeNav = [
  { href: "/app", label: "Notebook" },
  { href: "/app/my-property", label: "My Property" },
  { href: "/app/calendar", label: "Calendar" },
  { href: "/app/my-plants", label: "My Plants" },
  { href: "/app/plant-catalogue", label: "Plant Catalogue" }
];

type JournalShellProps = {
  currentPath: string;
  children: ReactNode;
};

export function JournalShell({ currentPath, children }: JournalShellProps) {
  return (
    <div className="journal-shell">
      <header className="journal-shell__header">
        <div className="journal-shell__identity">
          <SpecimenLabel tone="olive">Prototype folio</SpecimenLabel>
          <div>
            <Link className="journal-shell__brand" href="/">
              Garden.io
            </Link>
            <p className="journal-shell__tagline">A living botanical notebook for growers managing real complexity.</p>
          </div>
        </div>
        <nav aria-label="Prototype module navigation" className="journal-shell__nav">
          {prototypeNav.map((item) => (
            <Link
              key={item.href}
              className={cx("journal-shell__nav-link", currentPath === item.href && "is-active")}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="journal-shell__meta">
        <SpecimenLabel>Field edition 01</SpecimenLabel>
        <p>Styled prototype shell. Static data, tactile layout, and journal-first navigation language.</p>
      </div>

      <div className="journal-shell__body">{children}</div>
    </div>
  );
}
