"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Trail } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { getClockPose } from "./ps2Clock";

const NUM_ORBS = 7;
const DEFAULT_ASCII_RESOLUTION = 0.16;
const BASE_CAMERA_Z = 14;
const BASE_CAMERA_FOV = 45;
const DEFAULT_FG_COLOR = "#88a7ff";
const ASCII_CHARSET = " .,:;irs#9&@";
const ASCII_SUPERSAMPLE = 4;
const ASCII_HTML_CHARSET = [...ASCII_CHARSET].map(escapeHtml);
const QUANTIZED_COLORS = Array.from({ length: 9 ** 3 }, (_, index) => {
  const r = Math.floor(index / 81) * 32;
  const g = Math.floor((index % 81) / 9) * 32;
  const b = (index % 9) * 32;
  return `rgb(${r}, ${g}, ${b})`;
});
const FALLBACK_CHAR_WIDTH_RATIO = 0.6;
const DEFAULT_TRAIL_COLOR = new THREE.Color(0.06, 0.14, 0.42);
const DEFAULT_CORE_COLOR = new THREE.Color(0.22, 0.46, 1.18);
const DEFAULT_SHELL_COLOR = new THREE.Color(0.11, 0.28, 0.76);
const DEFAULT_HALO_COLOR = new THREE.Color(0.06, 0.16, 0.48);
const DEFAULT_ORBIT_RADIUS = 2.2;
const DEFAULT_ORBIT_SCALE = [1, 1, 1] as const;
const DEFAULT_ELLIPSE_ORBIT_SCALE = [1.3, 0.82, 1.08] as const;
const DEFAULT_ORB_SIZE = 1;

const ORB_INDICES = Array.from({ length: NUM_ORBS }, (_, index) => index);

type OrbitShape = "sphere" | "ellipse";
type OrbitVector = [number, number, number];

export type PS2OrbsProps = {
  mode?: "ascii" | "glow";
  resolution?: number;
  className?: string;
  background?: THREE.ColorRepresentation;
  speed?: number;
  orbSize?: number;
  /** Magnifies the scene inside the canvas without changing glyph density. */
  cameraZoom?: number;
  palette?: {
    fg?: string;
    core?: THREE.ColorRepresentation;
    shell?: THREE.ColorRepresentation;
    halo?: THREE.ColorRepresentation;
    trail?: THREE.ColorRepresentation;
  };
  orbit?: {
    radius?: number;
    shape?: OrbitShape;
    scale?: OrbitVector;
  };
  timeMs?: number;
  /**
   * Read like the PS2 clock: orbs merge on the hour hand at :00 and the
   * orbit grows over the hour. Off keeps the free-drifting look.
   */
  faithful?: boolean;
  ascii?: boolean;
  asciiResolution?: number;
};

type OrbPalette = {
  core: THREE.Color;
  shell: THREE.Color;
  halo: THREE.Color;
  trail: THREE.Color;
};

function Orb({ palette, size }: { palette: OrbPalette; size: number }) {
  return (
    <Trail
      width={10}
      length={10}
      decay={0.35}
      color={palette.trail}
      attenuation={(width) =>
        width * width * width * width * width * width * width * width
      }
    >
      <group>
        <mesh renderOrder={2}>
          <sphereGeometry args={[0.16 * size, 28, 28]} />
          <meshBasicMaterial
            color={palette.core}
            depthTest={false}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh renderOrder={1.5}>
          <sphereGeometry args={[0.23 * size, 24, 24]} />
          <meshBasicMaterial
            color={palette.shell}
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthTest={false}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh renderOrder={1}>
          <sphereGeometry args={[0.34 * size, 22, 22]} />
          <meshBasicMaterial
            color={palette.halo}
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthTest={false}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </Trail>
  );
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function resolveOrbitScale(
  shape: OrbitShape,
  scale?: OrbitVector,
): OrbitVector {
  if (shape === "ellipse") {
    return scale ?? [...DEFAULT_ELLIPSE_ORBIT_SCALE];
  }

  return [...DEFAULT_ORBIT_SCALE];
}

function getAverageLuminance(r: number, g: number, b: number) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function getQuantizedColor(r: number, g: number, b: number) {
  return QUANTIZED_COLORS[
    Math.round(r / 32) * 81 +
      Math.round(g / 32) * 9 +
      Math.round(b / 32)
  ];
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function getCharRatio() {
  if (typeof window === "undefined") {
    return FALLBACK_CHAR_WIDTH_RATIO;
  }

  const span = document.createElement("span");
  span.textContent = "M";
  span.style.position = "absolute";
  span.style.left = "-9999px";
  span.style.top = "-9999px";
  span.style.visibility = "hidden";
  span.style.whiteSpace = "pre";
  span.style.fontFamily =
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';
  span.style.fontSize = "100px";
  span.style.lineHeight = "100px";
  document.body.appendChild(span);

  const bounds = span.getBoundingClientRect();
  document.body.removeChild(span);

  if (!bounds.height) {
    return FALLBACK_CHAR_WIDTH_RATIO;
  }

  return clamp(bounds.width / bounds.height, 0.4, 0.8);
}

function OrbSystem({
  palette,
  speed,
  orbSize,
  orbit,
  timeMs,
  faithful,
}: {
  palette: OrbPalette;
  speed: number;
  orbSize: number;
  orbit: { radius: number; scale: OrbitVector };
  timeMs?: number;
  faithful: boolean;
}) {
  const containerRef = useRef<THREE.Group>(null);
  const orbRefs = useRef<(THREE.Group | null)[]>([]);
  const orbitDirectionRef = useRef(new THREE.Vector3());
  const orbitScaleRef = useRef(new THREE.Vector3());
  const rotationMatrixRef = useRef(new THREE.Matrix4());
  const xRotationMatrixRef = useRef(new THREE.Matrix4());
  const zRotationMatrixRef = useRef(new THREE.Matrix4());
  const hourRotationMatrixRef = useRef(new THREE.Matrix4());
  const animatedTimeRef = useRef<number | null>(null);
  const previousFrameTimeRef = useRef<number | null>(null);

  useFrame(() => {
    let now: number;

    if (typeof timeMs === "number") {
      now = timeMs;
      animatedTimeRef.current = timeMs;
      previousFrameTimeRef.current = null;
    } else {
      const rawNow = Date.now();

      if (animatedTimeRef.current === null) {
        animatedTimeRef.current = rawNow;
      }

      if (previousFrameTimeRef.current === null) {
        previousFrameTimeRef.current = rawNow;
      }

      const deltaMs = rawNow - previousFrameTimeRef.current;
      previousFrameTimeRef.current = rawNow;
      animatedTimeRef.current += deltaMs * speed;
      now = animatedTimeRef.current;
    }

    const pose = getClockPose(now, faithful);
    const rotationMatrix = rotationMatrixRef.current;
    const xRotationMatrix = xRotationMatrixRef.current;
    const zRotationMatrix = zRotationMatrixRef.current;
    const hourRotationMatrix = hourRotationMatrixRef.current;
    const orbitDirection = orbitDirectionRef.current;
    const orbitScaleVector = orbitScaleRef.current.set(...orbit.scale);

    const orbitRadius = orbit.radius * pose.radiusScale;

    rotationMatrix
      .copy(zRotationMatrix.makeRotationZ(pose.zRotation))
      .multiply(xRotationMatrix.makeRotationX(pose.xRotation))
      .multiply(hourRotationMatrix.makeRotationZ(pose.hourRotation));

    if (containerRef.current) {
      containerRef.current.rotation.x = pose.containerX;
      containerRef.current.rotation.y = pose.containerY;
    }

    for (const index of ORB_INDICES) {
      const orb = orbRefs.current[index];

      if (!orb) {
        continue;
      }

      const orbitAngle = pose.orbAngleStep * index;

      orbitDirection
        .set(Math.cos(orbitAngle), Math.sin(orbitAngle), 0)
        .applyMatrix4(rotationMatrix)
        .normalize()
        .multiply(orbitScaleVector)
        .multiplyScalar(orbitRadius);

      orb.position.copy(orbitDirection);
    }
  });

  return (
    <group ref={containerRef}>
      {ORB_INDICES.map((index) => (
        <group
          key={index}
          ref={(node) => {
            orbRefs.current[index] = node;
          }}
        >
          <Orb palette={palette} size={orbSize} />
        </group>
      ))}
    </group>
  );
}

function Scene({
  background,
  mode,
  palette,
  resolution,
  speed,
  orbSize,
  orbit,
  timeMs,
  faithful,
}: {
  background: THREE.ColorRepresentation;
  mode: "ascii" | "glow";
  palette: OrbPalette & { fg: string };
  resolution: number;
  speed: number;
  orbSize: number;
  orbit: { radius: number; scale: OrbitVector };
  timeMs?: number;
  faithful: boolean;
}) {
  return (
    <>
      {background !== "transparent" && (
        <color attach="background" args={[background]} />
      )}
      <OrbSystem
        palette={palette}
        speed={speed}
        orbSize={orbSize}
        orbit={orbit}
        timeMs={timeMs}
        faithful={faithful}
      />
      {mode === "ascii" ? (
        <FixedGridAsciiRenderer fgColor={palette.fg} resolution={resolution} />
      ) : (
        <EffectComposer>
          <Bloom
            intensity={2.35}
            luminanceThreshold={0.28}
            luminanceSmoothing={0.78}
            mipmapBlur
            radius={0.85}
          />
        </EffectComposer>
      )}
    </>
  );
}

function FixedGridAsciiRenderer({
  fgColor,
  resolution,
}: {
  fgColor: string;
  resolution: number;
}) {
  const { size, gl, scene, camera } = useThree();
  const textRef = useRef<HTMLPreElement>(null);
  const renderTargetRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const pixelBufferRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const lastFrameRef = useRef("");
  const [charRatio, setCharRatio] = useState(FALLBACK_CHAR_WIDTH_RATIO);
  const [fontSize, setFontSize] = useState(12);

  useLayoutEffect(() => {
    setCharRatio(getCharRatio());
  }, []);

  useEffect(() => {
    const { domElement } = gl;
    const previousOpacity = domElement.style.opacity;

    domElement.style.opacity = "0";

    return () => {
      domElement.style.opacity = previousOpacity;
    };
  }, [gl]);

  const grid = useMemo(() => {
    if (
      !isFiniteNumber(size.width) ||
      !isFiniteNumber(size.height) ||
      size.width <= 0 ||
      size.height <= 0 ||
      !isFiniteNumber(resolution)
    ) {
      return null;
    }

    const density = clamp(resolution, 0.05, 1);
    const columns = clamp(Math.round((size.width * density) / 4), 48, 180);
    const rows = clamp(
      Math.round((columns * size.height * charRatio) / size.width),
      28,
      140,
    );

    return { columns, rows };
  }, [charRatio, resolution, size.height, size.width]);

  useEffect(() => {
    if (!grid) {
      return;
    }

    const width = grid.columns * ASCII_SUPERSAMPLE;
    const height = grid.rows * ASCII_SUPERSAMPLE;
    const target = new THREE.WebGLRenderTarget(width, height, {
      depthBuffer: true,
      stencilBuffer: false,
    });
    target.texture.colorSpace = gl.outputColorSpace;
    renderTargetRef.current = target;
    pixelBufferRef.current = new Uint8Array(width * height * 4);

    return () => {
      target.dispose();
      renderTargetRef.current = null;
      pixelBufferRef.current = null;
    };
  }, [gl, grid]);

  useLayoutEffect(() => {
    if (!grid) {
      return;
    }

    setFontSize(Math.max(6, (size.height / grid.rows) * 0.8));
  }, [grid, size.height]);

  useFrame(() => {
    if (!grid || !textRef.current) {
      return;
    }

    const target = renderTargetRef.current;
    const data = pixelBufferRef.current;

    if (!target || !data) {
      return;
    }

    const previousTarget = gl.getRenderTarget();
    gl.setRenderTarget(target);
    gl.render(scene, camera);
    gl.setRenderTarget(previousTarget);
    gl.readRenderTargetPixels(
      target,
      0,
      0,
      grid.columns * ASCII_SUPERSAMPLE,
      grid.rows * ASCII_SUPERSAMPLE,
      data,
    );

    const fineWidth = grid.columns * ASCII_SUPERSAMPLE;
    const fineHeight = grid.rows * ASCII_SUPERSAMPLE;
    const lines: string[] = [];

    for (let row = 0; row < grid.rows; row += 1) {
      let line = "";
      let currentColor = "";
      let currentText = "";

      const flushSegment = () => {
        if (!currentText) {
          return;
        }

        line += `<span style="color:${currentColor}">${currentText}</span>`;
        currentText = "";
      };

      for (let column = 0; column < grid.columns; column += 1) {
        let rSum = 0;
        let gSum = 0;
        let bSum = 0;

        for (let sy = 0; sy < ASCII_SUPERSAMPLE; sy += 1) {
          const bufferY = fineHeight - 1 - (row * ASCII_SUPERSAMPLE + sy);
          const rowOffset = bufferY * fineWidth;

          for (let sx = 0; sx < ASCII_SUPERSAMPLE; sx += 1) {
            const offset = (rowOffset + column * ASCII_SUPERSAMPLE + sx) * 4;
            rSum += data[offset];
            gSum += data[offset + 1];
            bSum += data[offset + 2];
          }
        }

        const samples = ASCII_SUPERSAMPLE * ASCII_SUPERSAMPLE;
        const r = rSum / samples;
        const g = gSum / samples;
        const b = bSum / samples;
        const luminance = getAverageLuminance(r, g, b);
        const index = Math.round(luminance * (ASCII_CHARSET.length - 1));
        const character = ASCII_HTML_CHARSET[index] ?? " ";
        const color = getQuantizedColor(r, g, b);

        if (!currentColor) {
          currentColor = color;
        }

        if (color !== currentColor) {
          flushSegment();
          currentColor = color;
        }

        currentText += character;
      }

      flushSegment();
      lines.push(line);
    }

    const html = lines.join("\n");

    if (html !== lastFrameRef.current) {
      lastFrameRef.current = html;
      textRef.current.innerHTML = html;
    }
  }, 1);

  if (!grid) {
    return null;
  }

  return (
    <Html
      as="div"
      fullscreen
      style={{
        pointerEvents: "none",
        overflow: "hidden",
        color: fgColor,
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
        fontSize,
        lineHeight: 1,
        letterSpacing: 0,
        textShadow: "0 0 8px rgba(136, 167, 255, 0.25)",
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <pre
        ref={textRef}
        aria-hidden
        className="select-none whitespace-pre"
        style={{ color: fgColor }}
      />
    </Html>
  );
}

export function PS2Orbs({
  mode,
  resolution,
  className,
  background = "#000000",
  speed = 1,
  orbSize,
  cameraZoom = 1,
  palette,
  orbit,
  timeMs,
  faithful = false,
  ascii = false,
  asciiResolution,
}: PS2OrbsProps) {
  const resolvedMode = mode ?? (ascii ? "ascii" : "glow");
  const requestedResolution = isFiniteNumber(resolution)
    ? resolution
    : isFiniteNumber(asciiResolution)
      ? asciiResolution
      : DEFAULT_ASCII_RESOLUTION;
  const normalizedResolution = clamp(requestedResolution, 0.05, 1);
  const normalizedSpeed = Math.max(0, isFiniteNumber(speed) ? speed : 1);
  const normalizedOrbSize = Math.max(
    0,
    isFiniteNumber(orbSize) ? orbSize : DEFAULT_ORB_SIZE,
  );
  const resolvedTimeMs = isFiniteNumber(timeMs) ? timeMs : undefined;
  const resolvedOrbitRadius = Math.max(
    0,
    isFiniteNumber(orbit?.radius) ? orbit.radius : DEFAULT_ORBIT_RADIUS,
  );
  const resolvedOrbitShape = orbit?.shape ?? "sphere";
  const resolvedOrbitScale = resolveOrbitScale(
    resolvedOrbitShape,
    orbit?.scale,
  );
  const resolvedPalette = {
    fg: palette?.fg ?? DEFAULT_FG_COLOR,
    core: new THREE.Color(palette?.core ?? DEFAULT_CORE_COLOR),
    shell: new THREE.Color(palette?.shell ?? DEFAULT_SHELL_COLOR),
    halo: new THREE.Color(palette?.halo ?? DEFAULT_HALO_COLOR),
    trail: new THREE.Color(palette?.trail ?? DEFAULT_TRAIL_COLOR),
  };
  const asciiScale = Math.pow(
    DEFAULT_ASCII_RESOLUTION / normalizedResolution,
    0.35,
  );
  const cameraZ =
    resolvedMode === "ascii" ? BASE_CAMERA_Z * asciiScale : BASE_CAMERA_Z;

  return (
    <div className={className ?? "h-full w-full"}>
      <Canvas
        camera={{
          position: [0, 0, cameraZ],
          fov: BASE_CAMERA_FOV,
          zoom: isFiniteNumber(cameraZoom) && cameraZoom > 0 ? cameraZoom : 1,
        }}
        dpr={resolvedMode === "ascii" ? 1 : [1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene
          background={background}
          mode={resolvedMode}
          palette={resolvedPalette}
          resolution={normalizedResolution}
          speed={normalizedSpeed}
          orbSize={normalizedOrbSize}
          orbit={{ radius: resolvedOrbitRadius, scale: resolvedOrbitScale }}
          timeMs={resolvedTimeMs}
          faithful={faithful}
        />
      </Canvas>
    </div>
  );
}
