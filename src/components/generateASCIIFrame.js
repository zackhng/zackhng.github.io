function generateAsciiframe(width, height){
    const horizontalHeader = "+" + "-".repeat(width) + "+";
    const filler = "|" + " ".repeat(width) + "|";
    
    const rows = [horizontalHeader];
    for(let i=0;i<height;i++){
        rows.push(filler)
    }
    rows.push(horizontalHeader)

    return rows.join('\n');
}

export default generateAsciiframe;