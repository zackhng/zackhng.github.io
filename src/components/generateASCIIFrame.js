function generateAsciiFrame(
    widthPx, 
    heightPx, 
    padding = 1, 
    charWidthPx = 7, 
    charHeightPx = 13
) {
    // Convert pixel dimensions to character dimensions
    const widthChars = Math.floor(widthPx / charWidthPx);
    const heightChars = Math.floor(heightPx / charHeightPx);

    const innerWidth = widthChars + padding * 2;
    const innerHeight = heightChars + padding * 2;

    const horizontalHeader = "+" + "-".repeat(innerWidth) + "+";
    const filler = "|" + " ".repeat(innerWidth) + "|";

    const rows = [horizontalHeader];
    for (let i = 0; i < innerHeight; i++) {
        rows.push(filler);
    }
    rows.push(horizontalHeader);

    return { ascii: rows.join("\n"), innerWidth, innerHeight, padding };
}

export default generateAsciiFrame;
