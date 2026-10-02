// Where a browser key sits on a 12-column x 4-row split keyboard (Corne/Unicorne
// layout, row 3 = thumbs), so a keypress ripples where the key physically is.
// Number-row keys share the top row, like a 40% board.

const ROWS: string[][] = [
  ["Tab Escape Backquote", "KeyQ Digit1", "KeyW Digit2", "KeyE Digit3", "KeyR Digit4", "KeyT Digit5", "KeyY Digit6", "KeyU Digit7", "KeyI Digit8", "KeyO Digit9", "KeyP Digit0", "Backspace Minus Equal BracketLeft BracketRight Backslash Delete"],
  ["CapsLock ControlLeft", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"],
  ["ShiftLeft", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ShiftRight"],
  ["", "", "", "MetaLeft", "AltLeft", "Space", "Enter NumpadEnter", "AltRight ArrowLeft", "MetaRight ControlRight ArrowDown ArrowUp", "ArrowRight", "", ""],
];

const MAP = new Map<string, [col: number, row: number]>();
ROWS.forEach((cols, row) => cols.forEach((codes, col) => codes.split(" ").filter(Boolean).forEach((code) => MAP.set(code, [col, row]))));

/** [col 0..11, row 0..3] for a KeyboardEvent.code, or undefined if unmapped. */
export function keyPosition(code: string): [number, number] | undefined {
  return MAP.get(code);
}
