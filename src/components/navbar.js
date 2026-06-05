"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./themeToggle";
import styles from "@/styles/navbar.module.css";

/* Each route is a seal-stamp: a Chinese motif on top of a CLI seal block.
   Motifs (pure ASCII, no Chinese characters):
     HOME     -> temple roof eave
     ABOUT    -> bamboo vertical rhythm
     PROJECTS -> cloud scroll
     CONTACT  -> seal / stamp dots                                            */
const ITEMS = [
    { label: "HOME", href: "/", motif: "_/^\\_" },
    { label: "ABOUT", href: "/#about", motif: "|:|:|" },
    { label: "PROJECTS", href: "/projects", motif: "(~^~)" },
    { label: "CONTACT", href: "/#contact", motif: "[#:#]" },
];

// Build a 4-line ASCII seal: motif / top rule / | LABEL | / bottom rule
function stamp(label, motif) {
    const inner = ` ${label} `;
    const w = inner.length;
    const total = w + 2;
    const center = (s) => {
        const pad = Math.max(0, total - s.length);
        const left = Math.floor(pad / 2);
        return " ".repeat(left) + s + " ".repeat(pad - left);
    };
    const rule = "+" + "-".repeat(w) + "+";
    return [center(motif), rule, "|" + inner + "|", rule].join("\n");
}

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
                                <pre className={styles.art} aria-hidden="true">
                                    {stamp(it.label, it.motif)}
                                </pre>
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
