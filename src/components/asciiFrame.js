"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import styles from "@/styles/asciiframe.module.css";
import useImageMetadata from "@/hooks/useImageMetadata";
import generateBoxFrame from "./generateBoxFrame";

// Rough character cell size, used only to pick the frame's char dimensions.
// Actual image placement is measured from the rendered <pre>, so the frame
// stays aligned at any font size / screen size.
const CHAR_W = 7;
const CHAR_H = 13;

export default function AsciiFrame({ imagePath, scale = 0.32, alt = "" }) {
    const dim = useImageMetadata(imagePath);
    const preRef = useRef(null);
    const [cell, setCell] = useState({ w: 0, h: 0 });

    // Memoise the frame so it is a STABLE object between renders. Recreating it
    // every render (combined with the measuring effect below) caused an
    // infinite render loop.
    const frame = useMemo(() => {
        if (!dim) return null;
        return generateBoxFrame(
            Math.max(6, Math.round((scale * dim.width) / CHAR_W)),
            Math.max(4, Math.round((scale * dim.height) / CHAR_H))
        );
    }, [dim, scale]);

    // Measure a real character cell and recompute on resize, so the overlay
    // scales dynamically with the viewport. Only updates state when the value
    // actually changes, to avoid re-render loops.
    useEffect(() => {
        if (!preRef.current || !frame) return;
        const measure = () => {
            const rect = preRef.current.getBoundingClientRect();
            const w = rect.width / frame.cols;
            const h = rect.height / frame.rows;
            setCell((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(preRef.current);
        window.addEventListener("resize", measure);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, [frame]);

    if (!frame) {
        return <pre className={styles.frame}>loading…</pre>;
    }

    const imgStyle = {
        top: `${cell.h * frame.offsetTopRows}px`,
        left: `${cell.w * frame.offsetLeftCols}px`,
        width: `${cell.w * frame.innerCols}px`,
        height: `${cell.h * frame.innerRows}px`,
    };

    return (
        <div className={styles.wrapper}>
            <pre ref={preRef} className={styles.frame}>
                {frame.ascii}
            </pre>
            {cell.w > 0 && (
                <img src={imagePath} alt={alt} className={styles.image} style={imgStyle} />
            )}
        </div>
    );
}
