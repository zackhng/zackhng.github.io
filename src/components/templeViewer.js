"use client";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "@/styles/templeViewer.module.css";

/* ---- palette (traditional-architecture defaults) ---- */
const ROOF = "#343a4a";
const PILLAR = "#ff361b";
const BEAM = "#ff341d";
const BASE = "#000000";
const LANTERN = "#ffee00";
const FINIAL = "#b8922e";
const STONE = "#c0b9aa";
const STONE_DARK = "#7e7e63";
const TRUNK = "#83491d";
const BLOSSOM = "#ff8aad";
const BLOSSOM_2 = "#d98aa6";
const GROUND = "#e8e4da";
const GROUND_Y = -2;

const CHARSET = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

const HILL = "#aab4c4";
const HILL_2 = "#94a0b2";

/* ---- interactive hover-tag system ----
   Scene meshes carry a userData.tagId; hovering an element raycasts the
   scene, highlights the element's materials, and shows a DOM popup
   (handled by React). The ASCII layer stays purely visual. */
const TAGS = [
    {
        id: "roof",
        title: "飞檐 · Flying Eaves",
        category: "architecture",
        description:
            "Twin tiers of upturned eaves lift the roofline skyward. The flared corners throw rain clear of the timber frame — and, by tradition, deflect straight-flying spirits so only good fortune curls inward.",
    },
    {
        id: "entrance",
        title: "入口 · Entrance",
        category: "architecture",
        description:
            "A raised double platform marks the threshold. Visitors step up — never on — the base, crossing from the everyday world into the courtyard's quiet.",
    },
    {
        id: "pillars",
        title: "朱柱 · Vermilion Pillars",
        category: "architecture",
        description:
            "Four cinnabar-lacquered columns carry the roof on interlocking joinery, without a single nail. Red — the color of vitality and protection — guards the hall's perimeter.",
    },
    {
        id: "lanterns",
        title: "灯笼 · Lanterns",
        category: "object",
        description:
            "Paired lanterns flank the entrance beams. Lit at dusk, they were said to guide both travellers and ancestors home.",
    },
    {
        id: "stone-table",
        title: "石桌 · Stone Table",
        category: "object",
        description:
            "A stone table and four drum stools sit at the pavilion's heart — a place for tea, weiqi, and unhurried conversation in the shade of the eaves.",
    },
    {
        id: "peach",
        title: "桃花 · Peach Blossoms",
        category: "nature",
        description:
            "Peach trees bloom at the courtyard's edge. In Chinese lore the blossom marks spring, renewal, and the promise of longevity.",
    },
    {
        id: "hills",
        title: "远山 · Distant Hills",
        category: "nature",
        description:
            "Hazy ridgelines frame the pavilion — 借景, “borrowed scenery,” the garden principle of folding the far landscape into the composition.",
    },
];

const mat = (c, opts = {}) =>
    new THREE.MeshStandardMaterial({ color: c, flatShading: true, roughness: 0.7, ...opts });

// square pyramid roof tier with flared, upturned eaves (飞檐)
function tierGeometry(radius, h, flareOut, flareUp) {
    const geo = new THREE.ConeGeometry(radius, h, 4, 1);
    geo.rotateY(Math.PI / 4);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        if (pos.getY(i) < -h / 2 + 0.001) {
            pos.setX(i, pos.getX(i) * flareOut);
            pos.setZ(i, pos.getZ(i) * flareOut);
            pos.setY(i, pos.getY(i) + flareUp);
        }
    }
    geo.computeVertexNormals();
    return geo;
}

function buildTemple() {
    const g = new THREE.Group();
    g.position.y = -2;

    const base1 = new THREE.Mesh(new THREE.BoxGeometry(12, 0.6, 9), mat(BASE, { roughness: 1 }));
    base1.position.y = 0.3;
    const base2 = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.6, 7.5), mat(BASE, { roughness: 1 }));
    base2.position.y = 0.9;
    base1.userData.tagId = base2.userData.tagId = "entrance";
    g.add(base1, base2);

    [[-3.6, -2.7], [3.6, -2.7], [-3.6, 2.7], [3.6, 2.7]].forEach(([x, z]) => {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 4.2, 12), mat(PILLAR, { roughness: 0.8 }));
        p.position.set(x, 3.3, z);
        p.userData.tagId = "pillars";
        g.add(p);
    });

    [
        [0, 5.5, 3, [8.4, 0.5, 0.5]],
        [0, 5.5, -3, [8.4, 0.5, 0.5]],
        [4, 5.5, 0, [0.5, 0.5, 6.5]],
        [-4, 5.5, 0, [0.5, 0.5, 6.5]],
    ].forEach(([x, y, z, s]) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(...s), mat(BEAM, { roughness: 0.8 }));
        b.position.set(x, y, z);
        b.userData.tagId = "pillars";
        g.add(b);
    });

    const r1 = new THREE.Mesh(tierGeometry(8, 3, 1.28, 0.75), mat(ROOF, { roughness: 0.6, metalness: 0.1 }));
    r1.position.y = 6.8;
    const r2 = new THREE.Mesh(tierGeometry(5.6, 2.4, 1.3, 0.6), mat(ROOF, { roughness: 0.6, metalness: 0.1 }));
    r2.position.y = 8.9;
    r1.userData.tagId = r2.userData.tagId = "roof";
    g.add(r1, r2);

    const f1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 1.2, 8), mat(FINIAL, { roughness: 0.5, metalness: 0.4 }));
    f1.position.y = 10.3;
    const f2 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), mat(FINIAL, { roughness: 0.5, metalness: 0.4 }));
    f2.position.y = 11;
    f1.userData.tagId = f2.userData.tagId = "roof";
    g.add(f1, f2);

    [-3.3, 3.3].forEach((x) => {
        const lg = new THREE.Group();
        lg.position.set(x, 4.7, 3.2);
        lg.userData.tagId = "lanterns";
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.85, 12), mat(LANTERN, { roughness: 0.6 }));
        const cap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.28, 0.16, 8), mat("#3a2418", { roughness: 1 }));
        cap1.position.y = 0.5;
        const cap2 = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.16, 0.16, 8), mat("#3a2418", { roughness: 1 }));
        cap2.position.y = -0.5;
        const str = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.7, 6), mat("#555555"));
        str.position.y = 1.35;
        lg.add(body, cap1, cap2, str);
        g.add(lg);
    });

    return g;
}

function buildEnvironment() {
    const g = new THREE.Group();

    const ground = new THREE.Mesh(new THREE.CircleGeometry(26, 48), new THREE.MeshStandardMaterial({ color: GROUND, roughness: 1 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = GROUND_Y;
    g.add(ground);

    const fg = new THREE.Group();
    fg.position.y = GROUND_Y;

    // stone table & chairs on the temple platform
    const court = new THREE.Group();
    court.position.set(0, 1.2, 0);
    court.userData.tagId = "stone-table";
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.18, 16), mat(STONE, { roughness: 1 }));
    top.position.y = 0.75;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.85, 10), mat(STONE_DARK, { roughness: 1 }));
    leg.position.y = 0.35;
    court.add(top, leg);
    [[1.5, 0], [-1.5, 0], [0, 1.5], [0, -1.5]].forEach(([x, z]) => {
        const s = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.6, 10), mat(STONE, { roughness: 1 }));
        s.position.set(x, 0.45, z);
        court.add(s);
    });
    fg.add(court);

    // peach blossom trees
    const puffs = [
        [0, 2.5, 0, 1.1, BLOSSOM],
        [0.8, 2.2, 0.3, 0.8, BLOSSOM_2],
        [-0.7, 2.3, -0.2, 0.85, BLOSSOM],
        [0.3, 2.9, -0.6, 0.7, BLOSSOM_2],
        [-0.4, 2.7, 0.7, 0.75, BLOSSOM],
        [0.1, 3.2, 0.1, 0.6, BLOSSOM_2],
    ];
    const tree = (x, z, sc) => {
        const t = new THREE.Group();
        t.position.set(x, 0, z);
        t.scale.setScalar(sc);
        t.userData.tagId = "peach";
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.26, 2.4, 8), mat(TRUNK, { roughness: 1 }));
        trunk.position.y = 1.1;
        t.add(trunk);
        puffs.forEach(([px, py, pz, r, c]) => {
            const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), mat(c, { roughness: 0.9 }));
            m.position.set(px, py, pz);
            t.add(m);
        });
        return t;
    };
    fg.add(tree(-10, -2, 1.15), tree(10.5, -3, 1), tree(-8, 7, 0.85), tree(8.5, 8, 0.9));

    // distant hill silhouettes (借景 — borrowed scenery)
    [
        [-6, -20, 5.5, 7],
        [3, -21, 5, 5],
        [11, -17, 5.5, 6],
        [-15, -13, 4.5, 4.5],
        [19, -8, 4, 4],
        [-19, 6, 5, 5],
        [12, 16, 4.5, 4.5],
        [-4, 20, 5.5, 5.5],
    ].forEach(([x, z, r, h], i) => {
        const hill = new THREE.Mesh(new THREE.ConeGeometry(r, h, 5, 1), mat(i % 2 ? HILL_2 : HILL, { roughness: 1 }));
        hill.position.set(x, h / 2, z);
        hill.userData.tagId = "hills";
        fg.add(hill);
    });

    g.add(fg);
    return g;
}

export default function TempleViewer() {
    const containerRef = useRef(null);
    const [activeTag, setActiveTag] = useState(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        container.replaceChildren(); // drop any stale overlay from a prior mount

        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#ffffff");

        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
        camera.position.set(9, 5.5, 13);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(1);

        const effect = new AsciiEffect(renderer, CHARSET, { invert: false, color: true, resolution: 0.35 });
        const el = effect.domElement;
        el.style.position = "absolute";
        el.style.top = "0px";
        el.style.left = "0px";
        el.style.width = "max-content";
        el.style.height = "max-content";
        el.style.transformOrigin = "0 0";
        el.style.color = "#1f1d1a";
        el.style.backgroundColor = "#ffffff";
        container.appendChild(el);

        const controls = new OrbitControls(camera, el);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enablePan = false;
        controls.minDistance = 8;
        controls.maxDistance = 30;
        controls.maxPolarAngle = Math.PI / 2.1;
        controls.target.set(0, 2, 0);

        scene.add(new THREE.AmbientLight(0xffffff, 0.55));
        const d1 = new THREE.DirectionalLight(0xffffff, 1.0);
        d1.position.set(8, 12, 6);
        const d2 = new THREE.DirectionalLight(0xffffff, 0.35);
        d2.position.set(-6, 4, -5);
        scene.add(d1, d2);

        const temple = buildTemple();
        const environment = buildEnvironment();
        scene.add(environment, temple);

        // --- hover interaction (raycast the scene; popup is a React DOM layer) ---
        // collect the materials behind each tagged element, with a precomputed
        // highlight shade (darker if light, lighter if dark — both read as a
        // density change in the ASCII output)
        const tagMaterials = new Map();
        scene.traverse((o) => {
            if (!o.isMesh) return;
            let id = null;
            for (let n = o; n && !id; n = n.parent) id = n.userData.tagId || null;
            if (!id) return;
            const base = o.material.color.clone();
            const hsl = {};
            base.getHSL(hsl);
            const hover = new THREE.Color().setHSL(
                hsl.h,
                hsl.s,
                hsl.l > 0.5 ? Math.max(0, hsl.l - 0.18) : Math.min(1, hsl.l + 0.18)
            );
            o.material.userData = { base, hover };
            if (!tagMaterials.has(id)) tagMaterials.set(id, []);
            tagMaterials.get(id).push(o.material);
        });

        const raycaster = new THREE.Raycaster();
        const pointerNdc = new THREE.Vector2();
        const pickTag = (clientX, clientY) => {
            // overlay is transform-stretched to the container, and the renderer
            // matches the container too, so container coords map 1:1 to NDC
            const r = container.getBoundingClientRect();
            pointerNdc.set(
                ((clientX - r.left) / r.width) * 2 - 1,
                -(((clientY - r.top) / r.height) * 2 - 1)
            );
            raycaster.setFromCamera(pointerNdc, camera);
            const hit = raycaster.intersectObjects(scene.children, true)[0];
            if (!hit) return null;
            for (let n = hit.object; n; n = n.parent) if (n.userData.tagId) return n.userData.tagId;
            return null;
        };
        let hoveredId = null;
        const setHover = (id) => {
            if (id === hoveredId) return;
            if (hoveredId) tagMaterials.get(hoveredId)?.forEach((m) => m.color.copy(m.userData.base));
            hoveredId = id;
            if (id) tagMaterials.get(id)?.forEach((m) => m.color.copy(m.userData.hover));
            el.style.cursor = id ? "pointer" : "default";
            setActiveTag(id ? TAGS.find((t) => t.id === id) : null);
        };
        let lastPointer = null; // tracked so auto-rotate re-picks under a still cursor
        let downPos = null;
        const onPointerMove = (e) => {
            if (e.pointerType === "touch") return;
            lastPointer = [e.clientX, e.clientY];
            setHover(pickTag(e.clientX, e.clientY));
        };
        const onPointerLeave = (e) => {
            if (e.pointerType === "touch") return;
            lastPointer = null;
            setHover(null);
        };
        // touch has no hover — a small tap acts as one (tap empty space to clear)
        const onPointerDown = (e) => {
            downPos = [e.clientX, e.clientY];
        };
        const onPointerUp = (e) => {
            if (!downPos) return;
            const moved = Math.hypot(e.clientX - downPos[0], e.clientY - downPos[1]);
            downPos = null;
            if (e.pointerType === "touch" && moved <= 6) setHover(pickTag(e.clientX, e.clientY));
        };
        el.addEventListener("pointermove", onPointerMove);
        el.addEventListener("pointerleave", onPointerLeave);
        el.addEventListener("pointerdown", onPointerDown);
        el.addEventListener("pointerup", onPointerUp);

        // --- container-driven sizing ---
        // three's AsciiEffect rewrites its <td> every frame forced to the
        // canvas size with overflow:hidden, so the glyphs underfill it
        // (left-anchored). A CSS !important override (.viewport td in the
        // module) shrinks the cell back to the real glyph block; here we
        // stretch the whole overlay to fill the container.
        const fitOverlay = () => {
            const bw = el.offsetWidth;
            const bh = el.offsetHeight;
            const cw = container.clientWidth;
            const ch = container.clientHeight;
            if (!bw || !bh || !cw || !ch) return;
            el.style.transform = `scale(${cw / bw}, ${ch / bh})`;
        };
        let needsFit = true;
        const resize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            if (!w || !h) return;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            effect.setSize(w, h); // also calls renderer.setSize(w, h)
            fitOverlay(); // approximate fit now (old glyphs, new container)...
            needsFit = true; // ...exact refit after the next render at the new size
        };
        const ro = new ResizeObserver(resize);
        ro.observe(container);
        resize();
        // glyph metrics can shift once the monospace font finishes loading
        document.fonts?.ready.then(() => {
            needsFit = true;
        });

        let raf;
        const animate = () => {
            raf = requestAnimationFrame(animate);
            controls.update();
            // auto-rotate moves the scene under a resting cursor — re-pick
            if (lastPointer) setHover(pickTag(lastPointer[0], lastPointer[1]));
            effect.render(scene, camera);
            if (needsFit) {
                // measure only after a frame has rendered at the current size
                fitOverlay();
                needsFit = false;
            }
        };
        animate();

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            el.removeEventListener("pointermove", onPointerMove);
            el.removeEventListener("pointerleave", onPointerLeave);
            el.removeEventListener("pointerdown", onPointerDown);
            el.removeEventListener("pointerup", onPointerUp);
            controls.dispose();
            renderer.dispose();
            if (el.parentNode) el.parentNode.removeChild(el);
            scene.traverse((o) => {
                if (o.isMesh) {
                    o.geometry?.dispose();
                    if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
                    else o.material?.dispose();
                }
            });
        };
    }, []);

    return (
        <div className={styles.stack}>
            <div className={styles.frame}>
                <div className={styles.viewport} ref={containerRef} />
                <div className={styles.tag}>徽 · pavilion</div>
            </div>
            {activeTag && (
                <div className={styles.popup} key={activeTag.id} role="status" aria-label={activeTag.title}>
                    <div className={styles.popupTop}>
                        <span className={styles.popupCategory} data-category={activeTag.category}>
                            {activeTag.category}
                        </span>
                    </div>
                    <h3 className={styles.popupTitle}>{activeTag.title}</h3>
                    <p className={styles.popupDesc}>{activeTag.description}</p>
                </div>
            )}
        </div>
    );
}
