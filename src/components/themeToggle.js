"use client";
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import styles from "@/styles/themeToggle.module.css";

export default function ThemeToggle() {
    const [theme, setTheme] = useState(null);

    // Read whatever the no-flash inline script already applied.
    useEffect(() => {
        const current =
            document.documentElement.dataset.theme ||
            (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        setTheme(current);
    }, []);

    const toggle = () => {
        const next = theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        try {
            localStorage.setItem("theme", next);
        } catch (e) {
            /* storage unavailable — ignore */
        }
        setTheme(next);
    };

    return (
        <button
            className={styles.toggle}
            onClick={toggle}
            aria-label="Toggle light or dark mode"
            title="Toggle light / dark"
        >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>
    );
}
