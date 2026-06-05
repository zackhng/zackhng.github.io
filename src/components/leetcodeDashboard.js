"use client";
import { useEffect, useState } from "react";
import styles from "@/styles/leetcode.module.css";
import fetchLeetCodeStats from "@/lib/leetcode";
import { LEETCODE_USERNAME, LEETCODE_AVATAR_FALLBACK } from "@/data/config";

/* ---- dashboard geometry (characters) ---- */
const W = 46; // inner width between the side walls
const BAR_W = 16;
const AVATAR_W = 14; // inner avatar area
const AVATAR_H = 6;
const AVATAR_PAD = Math.floor((W - (AVATAR_W + 2)) / 2); // centre the bordered box
const AVATAR_LEFT = 2 + AVATAR_PAD + 1; // "│ " + padding + box wall

const SPINNER = ["|", "/", "-", "\\"];

const CACHE_KEY = (u) => `leetcode-stats-v1:${u}`;
const CACHE_TTL = 10 * 60 * 1000;

/* ---- pure ASCII placeholder avatar (14 wide x 6 rows) ---- */
const ASCII_AVATAR = [
    "              ",
    "  .--------.  ",
    " |  (o)(o)  | ",
    " |    __    | ",
    " |   \\__/   | ",
    "  '--------'  ",
];

/* ---- line builders ---- */
const top = () => "┌" + "─".repeat(W + 2) + "┐";
const bottom = () => "└" + "─".repeat(W + 2) + "┘";
const rule = (title) => {
    const t = title ? ` ${title} ` : "";
    const left = Math.floor((W + 2 - t.length) / 2);
    return "├" + "─".repeat(left) + t + "─".repeat(W + 2 - left - t.length) + "┤";
};

// a row is a list of segments: plain strings or { text, cls } for coloring
const segLen = (s) => (typeof s === "string" ? s.length : s.text.length);
function Row({ segs }) {
    const list = Array.isArray(segs) ? segs : [segs];
    const len = list.reduce((n, s) => n + segLen(s), 0);
    return (
        <div>
            {"│ "}
            {list.map((s, i) =>
                typeof s === "string" ? (
                    s
                ) : (
                    <span key={i} className={styles[s.cls]}>
                        {s.text}
                    </span>
                )
            )}
            {" ".repeat(Math.max(0, W - len))}
            {" │"}
        </div>
    );
}

const bar = (solved, total) => {
    const ratio = total ? solved / total : 0;
    const filled = Math.round(ratio * BAR_W);
    return {
        bar: "█".repeat(filled) + "░".repeat(BAR_W - filled),
        pct: `${String(Math.round(ratio * 100)).padStart(3)}%`,
    };
};

const num = (n) => (n ?? 0).toLocaleString("en-US");

function difficultyRow(label, cls, d) {
    const { bar: b, pct } = bar(d.solved, d.total);
    return [
        { text: label, cls },
        ` : ${String(d.solved).padStart(4)} / ${String(d.total).padStart(4)}  `,
        { text: b, cls },
        ` ${pct}`,
    ];
}

/* ---- states ---- */
function LoadingBox() {
    const [frame, setFrame] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setFrame((f) => (f + 1) % SPINNER.length), 120);
        return () => clearInterval(id);
    }, []);
    return (
        <pre className={styles.board} aria-label="Loading LeetCode stats">
            <div>{top()}</div>
            <Row segs={`$ leetcode --user ${LEETCODE_USERNAME}`} />
            <div>{rule()}</div>
            <Row segs={[{ text: `[${SPINNER[frame]}]`, cls: "amber" }, " fetching profile data..."]} />
            <div>{bottom()}</div>
        </pre>
    );
}

function ErrorBox({ message, onRetry }) {
    return (
        <div>
            <pre className={styles.board} role="alert">
                <div>{top()}</div>
                <Row segs={`$ leetcode --user ${LEETCODE_USERNAME}`} />
                <div>{rule()}</div>
                <Row segs={[{ text: "error", cls: "hard" }, ": could not reach any stats source"]} />
                <Row segs="check the connection and try again" />
                <div>{bottom()}</div>
            </pre>
            <button className={styles.retry} onClick={onRetry}>
                [ retry ]
            </button>
            <p className={styles.errDetail}>{message}</p>
        </div>
    );
}

/* ---- the dashboard ---- */
export default function LeetCodeDashboard() {
    const [state, setState] = useState({ status: "loading" });
    const [avatarFailed, setAvatarFailed] = useState(false);

    const load = async (force = false) => {
        setState({ status: "loading" });
        try {
            if (!force) {
                const raw = sessionStorage.getItem(CACHE_KEY(LEETCODE_USERNAME));
                if (raw) {
                    const { at, data } = JSON.parse(raw);
                    if (Date.now() - at < CACHE_TTL) {
                        setState({ status: "ready", data });
                        return;
                    }
                }
            }
            const data = await fetchLeetCodeStats(LEETCODE_USERNAME);
            sessionStorage.setItem(
                CACHE_KEY(LEETCODE_USERNAME),
                JSON.stringify({ at: Date.now(), data })
            );
            setState({ status: "ready", data });
        } catch (e) {
            setState({ status: "error", message: String(e.message || e) });
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (state.status === "loading") return <LoadingBox />;
    if (state.status === "error")
        return <ErrorBox message={state.message} onRetry={() => load(true)} />;

    const d = state.data;
    const lines = [];
    let key = 0;
    const push = (node) => lines.push(<div key={key++}>{node}</div>);
    const pushRow = (segs) => lines.push(<Row key={key++} segs={segs} />);

    push(top());
    pushRow(`$ leetcode --user ${d.username}`);
    push(rule());
    pushRow([`user : `, { text: d.username, cls: "amber" }]);
    pushRow(`rank : ${d.ranking ? `#${num(d.ranking)}` : "n/a"}`);
    pushRow("");

    // avatar block (real image overlays this area when available)
    const pad = " ".repeat(AVATAR_PAD);
    pushRow(`${pad}┌${"─".repeat(AVATAR_W)}┐`);
    const avatarTop = lines.length; // first inner avatar line index
    for (let i = 0; i < AVATAR_H; i++) pushRow(`${pad}│${ASCII_AVATAR[i]}│`);
    pushRow(`${pad}└${"─".repeat(AVATAR_W)}┘`);

    push(rule("STATS"));
    pushRow([
        "total ",
        ` : ${String(d.total.solved).padStart(4)} / ${String(d.total.questions).padStart(4)}`,
    ]);
    pushRow(difficultyRow("easy  ", "easy", d.easy));
    pushRow(difficultyRow("medium", "medium", d.medium));
    pushRow(difficultyRow("hard  ", "hard", d.hard));

    push(rule("ACTIVITY"));
    pushRow(`submissions : ${num(d.submissions)}`);
    pushRow(`active days : ${num(d.activeDays)}`);
    pushRow([`streak      : `, { text: `${d.streak} days`, cls: "amber" }]);
    push(bottom());

    // source-provided avatar when available, else the bundled local copy;
    // the ASCII face behind it only shows if the image itself fails
    const avatarSrc = d.avatar || LEETCODE_AVATAR_FALLBACK;
    const showAvatar = avatarSrc && !avatarFailed;

    return (
        <div className={styles.boardWrap}>
            <pre className={styles.board}>{lines}</pre>
            {showAvatar && (
                <img
                    src={avatarSrc}
                    alt={`${d.username}'s LeetCode avatar`}
                    className={styles.avatar}
                    style={{
                        left: `${AVATAR_LEFT}ch`,
                        top: `${avatarTop}em`,
                        width: `${AVATAR_W}ch`,
                        height: `${AVATAR_H}em`,
                    }}
                    onError={() => setAvatarFailed(true)}
                />
            )}
            <div className={styles.cornerTag}>码 · leetcode</div>
        </div>
    );
}
