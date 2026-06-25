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
  label?: string;
  title: string;
  subtitle: string;
  illustration?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function PlateCard({
  label,
  title,
  subtitle,
  illustration,
  children,
  className
}: PlateCardProps) {
  return (
    <article className={cx("plate-card", className)}>
      <div className="plate-card__head">
        <SpecimenLabel tone="clay">{label ?? "Plant photo"}</SpecimenLabel>
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
  kicker?: ReactNode;
  headerMeta?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: "standard" | "editorial" | "ledger";
};

export function JournalPage({
  side,
  folio,
  label,
  title,
  subtitle,
  kicker,
  headerMeta,
  children,
  className,
  variant = "standard"
}: JournalPageProps) {
  return (
    <article className={cx("journal-page", `journal-page--${side}`, `journal-page--${variant}`, className)}>
      <header className="journal-page__header">
        <div className="journal-page__header-copy">
          <SpecimenLabel>{label}</SpecimenLabel>
          {kicker ? <p className="journal-page__kicker">{kicker}</p> : null}
          <h2>{title}</h2>
          {subtitle ? <p className="journal-page__subtitle">{subtitle}</p> : null}
        </div>
        <div className="journal-page__header-side">
          <div className="journal-page__folio">Section {folio}</div>
          {headerMeta ? <div className="journal-page__meta">{headerMeta}</div> : null}
        </div>
      </header>
      <div className="journal-page__body">{children}</div>
    </article>
  );
}

type JournalSpreadProps = {
  children: ReactNode;
  className?: string;
  layout?: "balanced" | "feature-left" | "feature-right";
};

export function JournalSpread({ children, className, layout = "balanced" }: JournalSpreadProps) {
  return <section className={cx("journal-spread", `journal-spread--${layout}`, className)}>{children}</section>;
}

const appNav = [
  { href: "/app/my-property", label: "My Garden" },
  { href: "/app/calendar", label: "Weekly care" },
  { href: "/app/my-plants", label: "Plant Journal" },
  { href: "/app/plant-catalogue", label: "Choose plants" }
];

type JournalShellProps = {
  currentPath: string;
  children: ReactNode;
  signOut?: () => void;
  userEmail?: string;
};

export function JournalShell({ currentPath, children, signOut, userEmail }: JournalShellProps) {
  return (
    <div className="journal-shell">
      <header className="journal-shell__header">
        <div className="journal-shell__topline">
          <div className="journal-shell__identity">
            <Link className="journal-shell__brand" href="/">
              Garden.io
            </Link>
            <nav aria-label="Garden sections" className="journal-shell__nav">
              {appNav.map((item) => (
                <Link
                  key={item.href}
                  className={cx("journal-shell__nav-link", currentPath === item.href && "is-active")}
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <details className="journal-shell__user-menu">
            <summary className="journal-shell__user-toggle">
              <span className="journal-shell__avatar" aria-hidden="true">
                {userEmail ? userEmail[0].toUpperCase() : "P"}
              </span>
              <span className="sr-only">Open user menu</span>
            </summary>
            <div className="journal-shell__user-dropdown">
              <Link href="/app/my-property">My Garden</Link>
              <Link href="/app/my-plants">Plant Journal</Link>
              <Link href="/app/calendar">Weekly care</Link>
              <Link href="/app/plant-catalogue">Choose plants</Link>
              <button type="button" onClick={signOut}>Log out</button>
            </div>
          </details>
        </div>

        <p className="journal-shell__tagline">Remember what happened and what helped.</p>
      </header>

      <div className="journal-shell__body">{children}</div>
    </div>
  );
}
