// Chinese-style ASCII frame for images — a double-stroke lacquer band with
// stepped bracket corners (回纹 motif), echoing a traditional red frame:
//
//   ╔═╦═════════╦═╗
//   ╠═╝         ╚═╣
//   ║ ┌─────────┐ ║
//   ║ │  image  │ ║
//   ║ └─────────┘ ║
//   ╠═╗         ╔═╣
//   ╚═╩═════════╩═╝
//
// Returns the ascii plus the geometry needed to overlay an image precisely.
export default function generateBoxFrame(innerW, innerH) {
    const lines = [];

    lines.push("╔═╦" + "═".repeat(innerW) + "╦═╗");
    lines.push("╠═╝" + " ".repeat(innerW) + "╚═╣");
    lines.push("║ ┌" + "─".repeat(innerW) + "┐ ║");
    for (let i = 0; i < innerH; i++) {
        lines.push("║ │" + " ".repeat(innerW) + "│ ║");
    }
    lines.push("║ └" + "─".repeat(innerW) + "┘ ║");
    lines.push("╠═╗" + " ".repeat(innerW) + "╔═╣");
    lines.push("╚═╩" + "═".repeat(innerW) + "╩═╝");

    return {
        ascii: lines.join("\n"),
        cols: innerW + 6,
        rows: lines.length,
        offsetTopRows: 3, // outer band + corner row + inner box top
        offsetLeftCols: 3, // outer wall + gap + inner box wall
        innerCols: innerW,
        innerRows: innerH,
    };
}
