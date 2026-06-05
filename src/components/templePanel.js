"use client";
import TempleViewer from "./templeViewer";

// Pure Three.js (no R3F): all WebGL runs in a useEffect, so this is SSR-safe and
// can be imported directly — no next/dynamic wrapper needed.
export default function TemplePanel() {
    return <TempleViewer />;
}
