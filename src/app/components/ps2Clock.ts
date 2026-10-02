// Clock math for the PS2 orbs. Pure functions of wall-clock time, no three.js.
//
// The PS2 system menu orbs encode the local time:
//   - 7 orbs: days of the week (inert)
//   - seconds: orb i orbits at i × the base speed, so orbs bunch into
//     60/gcd(s, 60) groups (1 at :00, 2 at :30, 3 at :20/:40, ...)
//   - hour: at :00 all orbs merge where the hour hand would be
//   - minutes: the orbit radius grows from small to full over the hour
//
// `faithful: false` keeps the original free-drifting look; `faithful: true`
// makes the hour and minute encodings readable.

const TAU = Math.PI * 2;
const ORB_ANGLE_STEP = TAU / 60;
const X_SPEED = Math.PI / 3;
const Z_SPEED = (-Math.PI * 2) / 3;
const X_ROTATION_ANGLES = [Math.PI / 2, Math.PI + Math.PI / 6, 0] as const;
const CONTAINER_X_SPEED = 0.08;
const CONTAINER_Y_SPEED = 0.16;

const FAITHFUL_MIN_RADIUS = 0.35;
const FAITHFUL_RADIUS_RESET_SECONDS = 2;
const FAITHFUL_WOBBLE_X = 0.3;
const FAITHFUL_WOBBLE_Y = 0.45;

export type ClockPose = {
  /** Orb i sits at angle `orbAngleStep * i` on the orbit circle. */
  orbAngleStep: number;
  /** Orbit plane rotation, applied as Rz(z) · Rx(x) · Rz(hour). */
  xRotation: number;
  zRotation: number;
  hourRotation: number;
  /** Whole-system rotation. */
  containerX: number;
  containerY: number;
  /** Multiplier on the configured orbit radius. */
  radiusScale: number;
};

function lerp(start: number, end: number, alpha: number) {
  return start + (end - start) * alpha;
}

function smoothstep(value: number) {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
}

/** Angle of the hour hand in the XY plane: 12 o'clock is +Y, clockwise. */
function getHourHandAngle(hours: number) {
  return Math.PI / 2 - (hours % 12) * (TAU / 12);
}

/** Orbit radius grows across the hour, easing back down at the top of the hour. */
function getFaithfulRadiusScale(secondsInHour: number) {
  const target = lerp(FAITHFUL_MIN_RADIUS, 1, secondsInHour / 3_600);

  if (secondsInHour >= FAITHFUL_RADIUS_RESET_SECONDS) {
    return target;
  }

  // Ease from full size (end of last hour) instead of snapping, so trails
  // don't streak radially across the merge at :00.
  return lerp(1, target, smoothstep(secondsInHour / FAITHFUL_RADIUS_RESET_SECONDS));
}

export function getClockPose(nowMs: number, faithful: boolean): ClockPose {
  const date = new Date(nowMs);
  const minute = date.getMinutes();
  const secondsInMinute = date.getSeconds() + date.getMilliseconds() / 1_000;
  const secondsInHour = minute * 60 + secondsInMinute;
  const hours = date.getHours() + secondsInHour / 3_600;
  const minuteProgress = secondsInMinute / 60;

  const orbAngleStep = secondsInMinute * ORB_ANGLE_STEP;
  const zRotation = Z_SPEED * secondsInMinute;
  const hourRotation = getHourHandAngle(hours);
  const tiltStart = X_ROTATION_ANGLES[minute % X_ROTATION_ANGLES.length];

  if (!faithful) {
    const tiltEnd = X_ROTATION_ANGLES[(minute + 1) % X_ROTATION_ANGLES.length];
    const elapsedSeconds = nowMs / 1_000;

    return {
      orbAngleStep,
      xRotation:
        X_SPEED * secondsInMinute + lerp(tiltStart, tiltEnd, minuteProgress),
      zRotation,
      hourRotation,
      containerX: (elapsedSeconds * CONTAINER_X_SPEED) % TAU,
      containerY: (elapsedSeconds * CONTAINER_Y_SPEED) % TAU,
      radiusScale: 1,
    };
  }

  // Every term below is 0 (mod TAU) at :00, so the orbit faces the viewer
  // and the merged orbs land on the hour hand. The per-minute tilt still
  // varies, but swells and fades within the minute.
  const minuteArc = Math.sin(Math.PI * minuteProgress);
  const wobble = Math.sin(TAU * minuteProgress);

  return {
    orbAngleStep,
    xRotation: X_SPEED * secondsInMinute + tiltStart * minuteArc,
    zRotation,
    hourRotation,
    containerX: FAITHFUL_WOBBLE_X * wobble,
    containerY: FAITHFUL_WOBBLE_Y * wobble,
    radiusScale: getFaithfulRadiusScale(secondsInHour),
  };
}
