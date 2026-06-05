"use client";
import { useRef, useEffect } from "react";
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
    g.add(base1, base2);

    [[-3.6, -2.7], [3.6, -2.7], [-3.6, 2.7], [3.6, 2.7]].forEach(([x, z]) => {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 4.2, 12), mat(PILLAR, { roughness: 0.8 }));
        p.position.set(x, 3.3, z);
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
        g.add(b);
    });

    const r1 = new THREE.Mesh(tierGeometry(8, 3, 1.28, 0.75), mat(ROOF, { roughness: 0.6, metalness: 0.1 }));
    r1.position.y = 6.8;
    const r2 = new THREE.Mesh(tierGeometry(5.6, 2.4, 1.3, 0.6), mat(ROOF, { roughness: 0.6, metalness: 0.1 }));
    r2.position.y = 8.9;
    g.add(r1, r2);

    const f1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 1.2, 8), mat(FINIAL, { roughness: 0.5, metalness: 0.4 }));
    f1.position.y = 10.3;
    const f2 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), mat(FINIAL, { roughness: 0.5, metalness: 0.4 }));
    f2.position.y = 11;
    g.add(f1, f2);

    [-3.3, 3.3].forEach((x) => {
        const lg = new THREE.Group();
        lg.position.set(x, 4.7, 3.2);
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

    g.add(fg);
    return g;
}

export default function TempleViewer() {
    const containerRef = useRef(null);

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

        // --- container-driven sizing ---
        let lastKey = "";
        const fitOverlay = () => {
            // three's AsciiEffect rewrites the <td> every frame forced to the
            // canvas size with overflow:hidden, so the glyphs underfill it
            // (left-anchored). Shrink the cell back to the real glyph block...
            const td = el.querySelector("td");
            if (td) {
                td.style.width = "max-content";
                td.style.height = "max-content";
                td.style.overflow = "visible";
            }
            // ...then stretch the whole overlay to fill the container.
            const bw = el.offsetWidth;
            const bh = el.offsetHeight;
            const cw = container.clientWidth;
            const ch = container.clientHeight;
            if (!bw || !bh || !cw || !ch) return;
            const key = `${cw}x${ch}:${bw}x${bh}`;
            if (key === lastKey) return;
            lastKey = key;
            el.style.transform = `scale(${cw / bw}, ${ch / bh})`;
        };
        const resize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            if (!w || !h) return;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            effect.setSize(w, h); // also calls renderer.setSize(w, h)
            fitOverlay();
        };
        const ro = new ResizeObserver(resize);
        ro.observe(container);
        resize();

        let raf;
        const animate = () => {
            raf = requestAnimationFrame(animate);
            controls.update();
            effect.render(scene, camera);
            fitOverlay(); // cheap; only writes when sizes change
        };
        animate();

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
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
        <div className={styles.frame}>
            <div className={styles.viewport} ref={containerRef} />
            <div className={styles.tag}>徽 · pavilion</div>
        </div>
    );
}
