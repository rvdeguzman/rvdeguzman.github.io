// Koi pond simulation, ported from the Unicorne right-OLED scene
// (qmk-config-unicorne/vial/zen/koi.c). Integer math is kept faithful to the
// firmware (truncating division, uint8 headings) so it moves the same way.
//
// The pond is a 1-bit framebuffer, one byte per pixel (0/1), row-major.

const PX = 64; // positions in 1/64 px
const TRAIL = 9; // body points (head first)
const TRAIL_STEP = 2; // px between body points
const MAX_RIPPLES = 12;
const MAX_SPOTS = 4; // splashes the koi want to investigate
const RIPPLE_MS = 1100;
const SPOT_MS = 3500; // a splash stops being interesting after this
const SPACE = 13; // px: koi steer away from each other inside this distance
const SWISH = 7; // tail swing at the tip, in 1/4 px

// pointer (not in the firmware): the cursor drags a wake through the water,
// koi bolt from a fast cursor and drift up to a still one
const MAX_WAKES = 24;
const WAKE_MS = 650; // hover wake
const DRAG_WAKE_MS = 950; // dragging (button held) leaves a stronger wake
const WAKE_STEP = 6; // px of cursor travel between wake rings
const DRAG_WAKE_STEP = 3;
const FLEE = 16; // px: koi bolt from a fast cursor inside this distance
const FLEE_SPEED = 45; // px/s: cursor speed that counts as fast
const FLEE_MS = 700; // how long a startled koi keeps bolting
const CURIOUS = 40; // px: koi drift up to a still cursor inside this distance
const CURIOUS_SPEED = 20; // px/s: cursor speed that counts as still
const CURIOUS_DELAY = 500; // ms the cursor has to rest before koi come over

const tdiv = (a: number, b: number) => Math.trunc(a / b);
const u8 = (a: number) => a & 255;
const s8 = (a: number) => (a << 24) >> 24;

// sin(i/256 turn) * 127 for the first quarter
const SIN_Q = [
  0, 3, 6, 9, 12, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 51, 54, 57, 60, 63, 65, 68, 71, 73, 76, 78, 81, 83, 85, 88, 90, 92, 94, 96, 98,
  100, 102, 104, 106, 107, 109, 111, 112, 113, 115, 116, 117, 118, 120, 121, 122, 122, 123, 124, 125, 125, 126, 126, 126, 127, 127, 127, 127,
];

function isin(a: number): number {
  a = u8(a);
  if (a < 64) return SIN_Q[a];
  if (a < 128) return SIN_Q[128 - a];
  if (a < 192) return -SIN_Q[a - 128];
  return -SIN_Q[256 - a];
}
const icos = (a: number) => isin(a + 64);

// approximate atan2 -> 0..255 (0 = +x, 64 = +y)
function iatan2(dy: number, dx: number): number {
  const ax = Math.abs(dx),
    ay = Math.abs(dy);
  if (!ax && !ay) return 0;
  let a = ax >= ay ? tdiv(32 * ay, ax) : 64 - tdiv(32 * ax, ay);
  if (dx < 0) a = 128 - a;
  if (dy < 0) a = 256 - a;
  return u8(a);
}

type Fish = {
  x: number; // head, 1/64 px
  y: number;
  heading: number; // uint8
  speed: number; // px/s * 16
  tx: number; // wander target (px)
  ty: number;
  retargetT: number;
  trailX: number[]; // px * 4
  trailY: number[];
  kind: number; // 0 = single spot, 1 = kohaku, 2 = small
  swish: number; // tail-beat phase (256 = one beat)
  fleeUntil: number;
};

type Ripple = { x: number; y: number; t: number; big: boolean; active: boolean };
type Wake = { x: number; y: number; t: number; strong: boolean; active: boolean };
type Pointer = {
  inside: boolean;
  down: boolean;
  x: number; // pond px
  y: number;
  speed: number; // px/s, smoothed
  lastT: number;
  stillSince: number; // when the cursor last counted as still
  wx: number; // where the last wake ring was dropped
  wy: number;
};
type Spot = { x: number; y: number; t: number; live: boolean };

export type PondOptions = {
  /** Pond width in pixels. Default 128 (the OLED). */
  width?: number;
  /** Pond height in pixels. Default 32 (the OLED). */
  height?: number;
  /** Number of koi. Default 3. */
  fish?: number;
  /** RNG seed, for reproducible ponds. */
  seed?: number;
};

export class Pond {
  readonly width: number;
  readonly height: number;
  /** 1-bit framebuffer, one byte per pixel, row-major. Updated by render(). */
  readonly fb: Uint8Array;

  private readonly left = 3;
  private readonly right: number;
  private readonly top = 3;
  private readonly bottom: number;
  private fish: Fish[] = [];
  private readonly fishCount: number;
  private ripples: Ripple[] = Array.from({ length: MAX_RIPPLES }, () => ({ x: 0, y: 0, t: 0, big: false, active: false }));
  private spots: Spot[] = Array.from({ length: MAX_SPOTS }, () => ({ x: 0, y: 0, t: 0, live: false }));
  private nextRipple = 0;
  private wakes: Wake[] = Array.from({ length: MAX_WAKES }, () => ({ x: 0, y: 0, t: 0, strong: false, active: false }));
  private nextWake = 0;
  private ptr: Pointer = { inside: false, down: false, x: 0, y: 0, speed: 0, lastT: 0, stillSince: 0, wx: 0, wy: 0 };
  private inited = false;
  private last = 0;
  private rng: number;

  constructor(opts: PondOptions = {}) {
    this.width = Math.max(32, Math.round(opts.width ?? 128));
    this.height = Math.max(16, Math.round(opts.height ?? 32));
    this.fishCount = Math.max(1, Math.round(opts.fish ?? 3));
    this.right = this.width - 4;
    this.bottom = this.height - 4;
    this.rng = (opts.seed ?? 0xc0ffee) >>> 0;
    this.fb = new Uint8Array(this.width * this.height);
  }

  private rnd(): number {
    this.rng = (Math.imul(this.rng, 1664525) + 1013904223) >>> 0;
    return this.rng >>> 8;
  }

  private ripple(x: number, y: number, now: number, big: boolean) {
    this.ripples[this.nextRipple] = { x, y, t: now, big, active: true };
    this.nextRipple = (this.nextRipple + 1) % MAX_RIPPLES;
  }

  /** Drop a splash at pond pixel (x, y). */
  drop(x: number, y: number, now: number) {
    x = Math.round(x);
    y = Math.round(y);
    this.ripple(x, y, now, true);
    // every other splash catches a koi's attention (if there's room)
    if (this.rnd() & 1) return;
    for (const s of this.spots)
      if (!s.live) {
        Object.assign(s, { x, y, t: now, live: true });
        return;
      }
  }

  /**
   * The cursor is over the pond at pixel (x, y); `down` while a button is held
   * (dragging through the water). Call on every pointer move.
   */
  pointer(x: number, y: number, now: number, down = false) {
    const p = this.ptr;
    if (!p.inside) Object.assign(p, { inside: true, x, y, wx: x, wy: y, speed: 0, lastT: now, stillSince: now });
    const dt = now - p.lastT;
    const dist = Math.hypot(x - p.x, y - p.y);
    if (dt > 0) p.speed = p.speed * 0.5 + ((dist * 1000) / dt) * 0.5;
    Object.assign(p, { x, y, lastT: now, down });
    if (p.speed >= CURIOUS_SPEED) p.stillSince = now;
    if (Math.hypot(x - p.wx, y - p.wy) >= (down ? DRAG_WAKE_STEP : WAKE_STEP)) {
      this.wakes[this.nextWake] = { x: Math.round(x), y: Math.round(y), t: now, strong: down, active: true };
      this.nextWake = (this.nextWake + 1) % MAX_WAKES;
      p.wx = x;
      p.wy = y;
    }
  }

  /** The cursor left the pond. */
  pointerLeave() {
    this.ptr.inside = false;
    this.ptr.down = false;
  }

  /**
   * Drop a splash where a key sits on a 12-column x 4-row split keyboard
   * (col 0..11 left to right, row 0..3 with 3 = thumbs), like the firmware.
   */
  key(col: number, row: number, now: number) {
    const x = 6 + tdiv(col * (this.width - 12), 11) + (this.rnd() % 3) - 1;
    const y = 5 + tdiv(row * (this.height - 10), 3) + (this.rnd() % 3) - 1;
    this.drop(x, y, now);
  }

  /** Drop a splash at a random spot, inset like `key()` so it isn't clipped. */
  dropRandom(now: number) {
    const x = 6 + (this.rnd() % Math.max(1, this.width - 11));
    const y = 5 + (this.rnd() % Math.max(1, this.height - 9));
    this.drop(x, y, now);
  }

  private init(now: number) {
    const n = this.fishCount;
    for (let i = 0; i < n; i++) {
      const heading = u8(this.rnd());
      const x = Math.round((this.width * (i + 0.5)) / n) * PX;
      const y = (10 + ((i * 7) % Math.max(1, this.height - 20))) * PX;
      const f: Fish = {
        x,
        y,
        heading,
        speed: 0,
        tx: this.width >> 1,
        ty: this.height >> 1,
        retargetT: now,
        trailX: [],
        trailY: [],
        kind: i % 3,
        swish: 0,
        fleeUntil: 0,
      };
      for (let k = 0; k < TRAIL; k++) {
        // start stretched out behind the head
        f.trailX[k] = (tdiv(x, PX) - tdiv(k * TRAIL_STEP * icos(heading), 127)) * 4;
        f.trailY[k] = (tdiv(y, PX) - tdiv(k * TRAIL_STEP * isin(heading), 127)) * 4;
      }
      this.fish.push(f);
    }
    this.inited = true;
  }

  private updateFish(f: Fish, now: number, dt: number, wpm: number) {
    const hx = tdiv(f.x, PX),
      hy = tdiv(f.y, PX);

    // investigate the splash this koi is closest to (one koi per splash);
    // otherwise wander
    let best = -1;
    let bestd = Infinity;
    this.spots.forEach((s, i) => {
      if (!s.live) return;
      const dx = s.x - hx,
        dy = s.y - hy,
        d = dx * dx + dy * dy;
      let mine = true;
      for (const o of this.fish) {
        if (o === f) continue;
        const ox = s.x - tdiv(o.x, PX),
          oy = s.y - tdiv(o.y, PX);
        if (ox * ox + oy * oy < d) {
          mine = false;
          break;
        }
      }
      if (mine && d < bestd) (bestd = d), (best = i);
    });
    let tx = f.tx,
      ty = f.ty;
    if (best >= 0) {
      tx = this.spots[best].x;
      ty = this.spots[best].y;
      if (bestd <= 6) {
        // nibble at the surface
        this.spots[best].live = false;
        this.ripple(tx, ty, now, false);
      }
    } else if (now - f.retargetT > 2500 + (this.rnd() % 4000) || (hx - tx) * (hx - tx) + (hy - ty) * (hy - ty) < 16) {
      f.tx = this.left + 8 + (this.rnd() % Math.max(1, this.right - this.left - 16));
      f.ty = this.top + 4 + (this.rnd() % Math.max(1, this.bottom - this.top - 8));
      f.retargetT = now;
    }

    // the cursor: a fast one nearby startles the koi, a still one draws them in
    const p = this.ptr;
    let pdx = hx - Math.round(p.x),
      pdy = hy - Math.round(p.y);
    let pd = Math.abs(pdx) + Math.abs(pdy);
    if (!pd) (pdx = 1), (pd = 1);
    if (p.inside && p.speed > FLEE_SPEED && pd < FLEE) f.fleeUntil = now + FLEE_MS;
    const fleeing = now < f.fleeUntil;
    const curious = !fleeing && best < 0 && p.inside && now - p.stillSince > CURIOUS_DELAY && pd < CURIOUS;
    if (curious) (tx = Math.round(p.x)), (ty = Math.round(p.y));

    // steer toward the target, pushed away from any koi that's too close
    // (head and body), so they don't swim over each other
    let vx = tx - hx,
      vy = ty - hy;
    const vl = Math.abs(vx) + Math.abs(vy);
    if (vl) (vx = tdiv(vx * 64, vl)), (vy = tdiv(vy * 64, vl));
    for (const o of this.fish) {
      if (o === f) continue;
      for (let k = 0; k < TRAIL; k += 4) {
        let dx = hx - tdiv(o.trailX[k], 4);
        const dy = hy - tdiv(o.trailY[k], 4);
        let d = Math.abs(dx) + Math.abs(dy);
        if (d >= SPACE) continue;
        if (!d) (dx = 1), (d = 1);
        vx += tdiv(dx * (SPACE - d) * 12, d);
        vy += tdiv(dy * (SPACE - d) * 12, d);
      }
    }
    if (fleeing) {
      const push = Math.max(4, FLEE - pd);
      vx += tdiv(pdx * push * 24, pd);
      vy += tdiv(pdy * push * 24, pd);
    }
    const want = iatan2(vy, vx);
    let diff = s8(want - f.heading);
    const maxturn = tdiv((fleeing ? 340 : best >= 0 ? 260 : 130) * dt, 1000) + 1;
    if (diff > maxturn) diff = maxturn;
    if (diff < -maxturn) diff = -maxturn;
    f.heading = u8(f.heading + diff);

    // speed: lazy when idle, livelier with typing, darting to splashes (px/s * 16)
    const small = f.kind === 2 ? 1 : 0;
    let wantSpeed = (best >= 0 ? 30 + tdiv(wpm, 4) : 5 + tdiv(wpm, 8) + small * 2) * 16;
    if (fleeing) wantSpeed = 50 * 16;
    else if (curious) wantSpeed = (pd < 7 ? 1 : 10 + small * 2) * 16; // hang around the cursor
    f.speed += tdiv((wantSpeed - f.speed) * dt, 300);
    f.swish = (f.swish + tdiv((200 + f.speed * 2) * dt, 1000)) >>> 0; // ~1.5 beats/s cruising, ~5 darting

    f.x += tdiv(icos(f.heading) * f.speed * dt * PX, 127 * 16 * 1000);
    f.y += tdiv(isin(f.heading) * f.speed * dt * PX, 127 * 16 * 1000);
    if (f.x < this.left * PX) (f.x = this.left * PX), (f.heading = u8(128 - f.heading));
    if (f.x > this.right * PX) (f.x = this.right * PX), (f.heading = u8(128 - f.heading));
    if (f.y < this.top * PX) (f.y = this.top * PX), (f.heading = u8(-f.heading));
    if (f.y > this.bottom * PX) (f.y = this.bottom * PX), (f.heading = u8(-f.heading));

    // body follows the head's path: [0] is the live head, [1..] are points
    // recorded every TRAIL_STEP px along the way
    const qx = tdiv(f.x * 4, PX),
      qy = tdiv(f.y * 4, PX);
    const ddx = qx - f.trailX[1],
      ddy = qy - f.trailY[1];
    if (ddx * ddx + ddy * ddy >= TRAIL_STEP * TRAIL_STEP * 16) {
      for (let k = TRAIL - 1; k > 1; k--) (f.trailX[k] = f.trailX[k - 1]), (f.trailY[k] = f.trailY[k - 1]);
      f.trailX[1] = qx;
      f.trailY[1] = qy;
    }
    f.trailX[0] = qx;
    f.trailY[0] = qy;

    // idle fish occasionally kiss the surface
    if (!wpm && best < 0 && this.rnd() % 4000 < dt) this.ripple(hx, hy, now, false);
    // ...and nibble at a resting cursor
    if (curious && pd < 7 && this.rnd() % 1200 < dt) this.ripple(hx, hy, now, false);
  }

  private px(x: number, y: number, on: number) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    this.fb[y * this.width + x] = on;
  }

  private disc(cx: number, cy: number, r: number, on: number) {
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + tdiv(r, 2)) this.px(cx + x, cy + y, on);
  }

  private drawFish(f: Fish) {
    const r = f.kind === 2 ? [1, 1, 1, 1, 1, 0, 0, 0, 0] : [2, 2, 2, 2, 1, 1, 1, 0, 0];
    const px: number[] = [],
      py: number[] = [];
    // tail swish: a wave runs head -> tail, bending each body point sideways,
    // more toward the tail (head stays put)
    for (let k = 0; k < TRAIL; k++) {
      const a = k ? k - 1 : 0; // body direction around point k
      const b = k === TRAIL - 1 ? k : k + 1;
      const ang = iatan2(f.trailY[a] - f.trailY[b], f.trailX[a] - f.trailX[b]);
      const off = tdiv(SWISH * k * isin(f.swish - k * 28), 127 * (TRAIL - 1));
      const qx = f.trailX[k] + tdiv(off * icos(ang + 64), 127);
      const qy = f.trailY[k] + tdiv(off * isin(ang + 64), 127);
      px[k] = tdiv(qx + 2, 4);
      py[k] = tdiv(qy + 2, 4);
    }

    for (let k = TRAIL - 2; k >= 0; k--) this.disc(px[k], py[k], r[k], 1);
    // tail fin: splayed pixels at the end, perpendicular to the body
    const T = TRAIL - 1;
    const ex = px[T] - px[T - 2],
      ey = py[T] - py[T - 2];
    const nx = ey > 0 ? -1 : ey < 0 ? 1 : 0,
      ny = ex > 0 ? 1 : ex < 0 ? -1 : 0;
    this.px(px[T] + nx, py[T] + ny, 1);
    this.px(px[T] - nx, py[T] - ny, 1);
    if (f.kind !== 2) {
      this.px(px[T] + 2 * nx, py[T] + 2 * ny, 1);
      this.px(px[T] - 2 * nx, py[T] - 2 * ny, 1);
      // pectoral fins just behind the head
      const bx = px[0] - px[2],
        by = py[0] - py[2];
      const mx = by > 0 ? -1 : by < 0 ? 1 : 0,
        my = bx > 0 ? 1 : bx < 0 ? -1 : 0;
      this.px(px[2] + 3 * mx, py[2] + 3 * my, 1);
      this.px(px[2] - 3 * mx, py[2] - 3 * my, 1);
    }
    if (f.kind === 1) {
      // kohaku: dark patches on the back
      this.disc(px[1], py[1], 1, 0);
      this.px(px[4], py[4], 0);
    }
    if (f.kind === 0) this.px(px[5], py[5], 0); // a single spot
  }

  private ring(cx: number, cy: number, r: number, sparse: boolean) {
    // midpoint circle
    let x = r,
      y = 0,
      err = 1 - r,
      n = 0;
    while (x >= y) {
      const pts = [
        [x, y],
        [y, x],
        [-y, x],
        [-x, y],
        [-x, -y],
        [-y, -x],
        [y, -x],
        [x, -y],
      ];
      for (let i = 0; i < 8; i++) if (!sparse || (n + i) & 1) this.px(cx + pts[i][0], cy + pts[i][1], 1);
      y++, n++;
      if (err < 0) err += 2 * y + 1;
      else x--, (err += 2 * (y - x) + 1);
    }
  }

  /**
   * Advance the simulation to `now` (ms) and redraw `fb`.
   * `wpm` makes the koi livelier, like typing on the keyboard does.
   */
  render(now: number, wpm = 0): Uint8Array {
    now = Math.floor(now);
    if (!this.inited) this.init(now), (this.last = now);
    const dt = Math.max(0, Math.min(100, now - this.last));
    this.last = now;
    wpm = Math.max(0, Math.min(255, Math.floor(wpm)));
    // a cursor that stops sending moves has stopped moving
    const p = this.ptr;
    if (now - p.lastT > 60) p.speed *= Math.pow(0.5, dt / 80);
    if (p.inside && p.speed >= CURIOUS_SPEED) p.stillSince = now;

    for (const s of this.spots) if (s.live && now - s.t > SPOT_MS) s.live = false;
    for (const f of this.fish) this.updateFish(f, now, dt, wpm);

    this.fb.fill(0);
    for (const f of this.fish) this.drawFish(f);
    for (const rp of this.ripples) {
      const age = now - rp.t;
      if (!rp.active || age > RIPPLE_MS) continue;
      const r = 1 + tdiv(age * (rp.big ? 14 : 6), 1000);
      this.ring(rp.x, rp.y, r, age > RIPPLE_MS / 2);
      if (rp.big && age > 250) this.ring(rp.x, rp.y, r - 3, true); // second, inner wave
    }
    for (const w of this.wakes) {
      const age = now - w.t;
      const life = w.strong ? DRAG_WAKE_MS : WAKE_MS;
      if (!w.active || age > life) continue;
      const r = 1 + tdiv(age * (w.strong ? 10 : 7), 1000);
      this.ring(w.x, w.y, r, !w.strong || age > life / 2);
    }
    return this.fb;
  }
}
