"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./themeToggle";
import styles from "@/styles/navbar.module.css";

/* Minimal ASCII labels with a quiet, architectural cue:
   light corner glyphs frame each route (┌ HOME ┐); the active route is
   framed with heavy corners (┏ HOME ┓) — ink pressure, not decoration. */
const ITEMS = [
    { label: "HOME", href: "/" },
    { label: "ABOUT", href: "/#about" },
    { label: "PROJECTS", href: "/#projects" },
    { label: "RESUME", href: "/resume" },
    { label: "CONTACT", href: "/#contact" },
];

const frame = (label, active) => (active ? `┏ ${label} ┓` : `┌ ${label} ┐`);

export default function Navbar() {
    const pathname = usePathname() || "/";

    return (
        <nav className={styles.navbar} aria-label="Primary">
            <ul className={styles.items}>
                {ITEMS.map((it) => {
                    const base = it.href.split("#")[0];
                    const isAnchor = it.href.includes("#");
                    const active = isAnchor
                        ? false
                        : base === "/"
                          ? pathname === "/"
                          : pathname.startsWith(base);
                    return (
                        <li key={it.label} className={styles.cell}>
                            <Link
                                href={it.href}
                                className={`${styles.item} ${active ? styles.active : ""}`}
                                aria-label={it.label}
                                aria-current={active ? "page" : undefined}
                            >
                                <span className={styles.art} aria-hidden="true">
                                    {frame(it.label, active)}
                                </span>
                                <span className={styles.sr}>{it.label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <div className={styles.toggleWrap}>
                <ThemeToggle />
            </div>
        </nav>
    );
}
