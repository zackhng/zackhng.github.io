// Plain ASCII box frame ( +--+ / |  | ) for images.
// Returns the ascii plus the geometry needed to overlay an image precisely.
export default function generateBoxFrame(innerW, innerH, padding = 1) {
    const bodyW = innerW + padding * 2;
    const lines = [];

    lines.push("+" + "-".repeat(bodyW) + "+");
    for (let i = 0; i < innerH + padding * 2; i++) {
        lines.push("|" + " ".repeat(bodyW) + "|");
    }
    lines.push("+" + "-".repeat(bodyW) + "+");

    return {
        ascii: lines.join("\n"),
        cols: bodyW + 2,
        rows: lines.length,
        offsetTopRows: 1 + padding, // top border + padding
        offsetLeftCols: 1 + padding, // wall char + padding
        innerCols: innerW,
        innerRows: innerH,
    };
}
