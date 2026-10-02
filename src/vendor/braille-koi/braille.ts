// Encode a 1-bit framebuffer as Unicode Braille: each character is a 2x4 dot
// cell, so a 128x32 pond becomes 64 columns x 8 rows of text.

// bit for the dot at (x, y) inside a cell: dots 1-2-3-7 left column, 4-5-6-8 right
const DOT = [
  [0x01, 0x08],
  [0x02, 0x10],
  [0x04, 0x20],
  [0x40, 0x80],
];

export const BRAILLE_BLANK = "\u2800";

/** Blank Braille text for a pond of the given size (useful for SSR). */
export function blankBraille(width: number, height: number): string {
  const cols = Math.ceil(width / 2),
    rows = Math.ceil(height / 4);
  return Array.from({ length: rows }, () => BRAILLE_BLANK.repeat(cols)).join("\n");
}

/** fb: one byte per pixel (non-zero = lit), row-major, width x height. */
export function toBraille(fb: ArrayLike<number>, width: number, height: number): string {
  const cols = Math.ceil(width / 2),
    rows = Math.ceil(height / 4);
  const lines: string[] = [];
  for (let cy = 0; cy < rows; cy++) {
    let line = "";
    for (let cx = 0; cx < cols; cx++) {
      let bits = 0;
      for (let dy = 0; dy < 4; dy++) {
        const y = cy * 4 + dy;
        if (y >= height) break;
        for (let dx = 0; dx < 2; dx++) {
          const x = cx * 2 + dx;
          if (x < width && fb[y * width + x]) bits |= DOT[dy][dx];
        }
      }
      line += String.fromCharCode(0x2800 + bits);
    }
    lines.push(line);
  }
  return lines.join("\n");
}
