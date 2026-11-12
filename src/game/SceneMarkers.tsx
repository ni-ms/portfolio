import { sitePath } from '../routing/sitePath';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { COURSE_BOUNDS, CHECKPOINTS } from './courseConfig';

export interface SceneMarkersProps {
  onSelectCheckpoint?: (destination: string) => void;
  visible?: boolean;
  portal?: React.RefObject<HTMLElement | null>;
}

interface MarkerItem {
  id: string;
  labelNumber: string;
  labelTitle: string;
  sectionId: string;
  targetRoute: string;
  position: [number, number, number];
}

interface MeasuredSize {
  w: number;
  h: number;
}

interface ComputedBadgeRect {
  x: number;
  y: number;
  w: number;
  h: number;
  rawX: number;
  rawY: number;
}

const vPos = new THREE.Vector3();

function projectBeacon(
  pos: [number, number, number],
  camera: THREE.Camera,
  size: { width: number; height: number }
): { rawX: number; rawY: number } {
  vPos.set(pos[0], pos[1], pos[2]);
  vPos.project(camera);
  const widthHalf = size.width / 2;
  const heightHalf = size.height / 2;
  return {
    rawX: vPos.x * widthHalf + widthHalf,
    rawY: -vPos.y * heightHalf + heightHalf,
  };
}

/**
 * Coordinated collision-free layout solver:
 * - Measures ACTUAL rendered badge dimensions from DOM bounding rects.
 * - Dynamically bounds each badge inside canvas safe insets across all viewports and font preferences.
 * - Detects pairwise bounding-box collisions and separates colliding badges with guaranteed margin.
 * - Preserves natural 3D overview placement when unconstrained (e.g. desktop/tablet).
 */
function resolveCollisionFreeLayout(
  markers: MarkerItem[],
  camera: THREE.Camera,
  size: { width: number; height: number },
  measured: MeasuredSize[]
): Array<[number, number]> {
  const insetLeft = 10;
  const insetRight = 10;
  const insetTop = 10;
  const insetBottom = 12;
  const gap = 8;
  const leaderHeight = 18;

  // 1. Initial placement based on actual rendered dimensions and 3D beacon projection
  const rects: ComputedBadgeRect[] = markers.map((m, i) => {
    const { rawX, rawY } = projectBeacon(m.position, camera, size);
    const w = measured[i]?.w > 0 ? measured[i].w : 120;
    const h = measured[i]?.h > 0 ? measured[i].h : 30;

    const naturalX = rawX - 6;
    const naturalY = rawY - h - leaderHeight;

    const clampedX = Math.max(insetLeft, Math.min(naturalX, size.width - insetRight - w));
    const clampedY = Math.max(insetTop, Math.min(naturalY, size.height - insetBottom - h - leaderHeight));

    return {
      x: clampedX,
      y: clampedY,
      w,
      h,
      rawX,
      rawY,
    };
  });

  function overlaps(a: ComputedBadgeRect, b: ComputedBadgeRect, g = gap): boolean {
    return !(
      a.x + a.w + g <= b.x ||
      b.x + b.w + g <= a.x ||
      a.y + a.h + g <= b.y ||
      b.y + b.h + g <= a.y
    );
  }

  // Check if any collision exists among the 3 badges
  const hasCollision =
    overlaps(rects[0], rects[1]) ||
    overlaps(rects[0], rects[2]) ||
    overlaps(rects[1], rects[2]);

  if (!hasCollision) {
    return rects.map((r) => [r.x, r.y]);
  }

  // Work (index 0) is the immediate next landing platform; keep Work at its natural position.
  // Sort secondary badges (1: Explorations, 2: Resume) by natural Y to preserve visual elevation
  const secondary = [2, 1];
  secondary.sort((a, b) => rects[a].rawY - rects[b].rawY);

  // Stack colliding secondary badges vertically with clean separation
  let currentY = rects[0].y + rects[0].h + gap;
  for (const idx of secondary) {
    if (overlaps(rects[0], rects[idx]) || rects[idx].y < currentY) {
      rects[idx].y = currentY;
    }
    currentY = rects[idx].y + rects[idx].h + gap;
  }

  // Ensure bottom-most badge doesn't exceed canvas bottom
  const maxBottom = size.height - insetBottom - leaderHeight;
  const lastSecondary = secondary[secondary.length - 1];
  if (rects[lastSecondary].y + rects[lastSecondary].h > maxBottom) {
    const overflow = rects[lastSecondary].y + rects[lastSecondary].h - maxBottom;
    for (const idx of secondary) {
      rects[idx].y -= overflow;
    }
    // If Work now overlaps secondary[0], push Work up as well
    if (rects[0].y + rects[0].h + gap > rects[secondary[0]].y) {
      rects[0].y = rects[secondary[0]].y - gap - rects[0].h;
    }
  }

  // Final containment clamp pass
  for (let i = 0; i < 3; i++) {
    rects[i].x = Math.max(insetLeft, Math.min(rects[i].x, size.width - insetRight - rects[i].w));
    rects[i].y = Math.max(insetTop, Math.min(rects[i].y, size.height - insetBottom - rects[i].h - leaderHeight));
  }

  return rects.map((r) => [r.x, r.y]);
}

export const SceneMarkers: React.FC<SceneMarkersProps> = ({
  onSelectCheckpoint,
  visible = true,
  portal,
}) => {
  const badge0Ref = useRef<HTMLAnchorElement>(null);
  const badge1Ref = useRef<HTMLAnchorElement>(null);
  const badge2Ref = useRef<HTMLAnchorElement>(null);
  const badgeRefs = [badge0Ref, badge1Ref, badge2Ref];

  const measuredSizes = useRef<MeasuredSize[]>([
    { w: 90, h: 28 },
    { w: 140, h: 28 },
    { w: 100, h: 28 },
  ]);

  const cachedPositions = useRef<Array<[number, number]>>([
    [0, 0],
    [0, 0],
    [0, 0],
  ]);
  const lastCalcTimestamp = useRef<number>(0);

  const updateMeasuredSizes = () => {
    for (let i = 0; i < 3; i++) {
      const el = badgeRefs[i].current;
      if (el) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          measuredSizes.current[i] = { w: r.width, h: r.height };
        }
      }
    }
  };

  useEffect(() => {
    updateMeasuredSizes();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        updateMeasuredSizes();
      });
      badgeRefs.forEach((ref) => {
        if (ref.current) ro.observe(ref.current);
      });
      return () => ro.disconnect();
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        updateMeasuredSizes();
      });
    }
  }, []);

  if (!visible) return null;

  const markers: MarkerItem[] = [
    {
      id: CHECKPOINTS[1].id,
      labelNumber: '01',
      labelTitle: 'WORK',
      sectionId: 'work',
      targetRoute: CHECKPOINTS[1].targetRoute || '/projects',
      position: [
        COURSE_BOUNDS.workRooftop.beaconPosition[0],
        COURSE_BOUNDS.workRooftop.beaconPosition[1] + 0.6,
        COURSE_BOUNDS.workRooftop.beaconPosition[2],
      ],
    },
    {
      id: CHECKPOINTS[2].id,
      labelNumber: '02',
      labelTitle: 'EXPLORATIONS',
      sectionId: 'explorations',
      targetRoute: CHECKPOINTS[2].targetRoute || '/about',
      position: [
        COURSE_BOUNDS.explorationRooftop.beaconPosition[0],
        COURSE_BOUNDS.explorationRooftop.beaconPosition[1] + 0.8,
        COURSE_BOUNDS.explorationRooftop.beaconPosition[2],
      ],
    },
    {
      id: CHECKPOINTS[3].id,
      labelNumber: '03',
      labelTitle: 'RÉSUMÉ',
      sectionId: 'resume',
      targetRoute: CHECKPOINTS[3].targetRoute || '/resume',
      position: [
        COURSE_BOUNDS.resumeRooftop.beaconPosition[0],
        COURSE_BOUNDS.resumeRooftop.beaconPosition[1] + 0.8,
        COURSE_BOUNDS.resumeRooftop.beaconPosition[2],
      ],
    },
  ];

  const getPosition = (
    markerIndex: number,
    camera: THREE.Camera,
    size: { width: number; height: number }
  ): [number, number] => {
    const now = performance.now();
    // Recompute once per frame / tick
    if (Math.abs(now - lastCalcTimestamp.current) > 2) {
      lastCalcTimestamp.current = now;
      updateMeasuredSizes();
      cachedPositions.current = resolveCollisionFreeLayout(
        markers,
        camera,
        size,
        measuredSizes.current
      );
    }
    return cachedPositions.current[markerIndex] || [0, 0];
  };

  const handleClick = (e: React.MouseEvent, marker: MarkerItem) => {
    e.preventDefault();
    const destination = marker.targetRoute || marker.sectionId;
    if (onSelectCheckpoint) {
      onSelectCheckpoint(destination);
    } else {
      const el = document.getElementById(marker.sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <group name="scene-markers">
      {markers.map((marker, index) => (
        <Html
          key={marker.id}
          position={marker.position}
          center={false}
          portal={portal as React.RefObject<HTMLElement> | undefined}
          calculatePosition={(_el, camera, size) => getPosition(index, camera, size)}
          zIndexRange={[50, 0]}
          style={{
            pointerEvents: 'auto',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            {/* Clickable Monospace Label Badge */}
            <a
              ref={badgeRefs[index]}
              href={marker.targetRoute ? sitePath(marker.targetRoute) : `#${marker.sectionId}`}
              onClick={(e) => handleClick(e, marker)}
              aria-label={`Jump to ${marker.labelNumber} ${marker.labelTitle} section`}
              tabIndex={0}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                background: 'rgba(16, 20, 20, 0.88)',
                border: '1px solid rgba(214, 255, 100, 0.4)',
                borderRadius: '2px',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: '#F2F1EA',
                textDecoration: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'border-color 0.15s ease, background-color 0.15s ease, transform 0.15s ease',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D6FF64';
                e.currentTarget.style.backgroundColor = 'rgba(23, 29, 30, 0.95)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(214, 255, 100, 0.4)';
                e.currentTarget.style.backgroundColor = 'rgba(16, 20, 20, 0.88)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ color: '#D6FF64' }}>{marker.labelNumber}</span>
              <span style={{ color: '#565F60' }}>/</span>
              <span>{marker.labelTitle}</span>
            </a>

            {/* Fine Leader Line connecting Label to 3D Anchor Point */}
            <svg
              width="24"
              height="18"
              viewBox="0 0 24 18"
              style={{
                display: 'block',
                marginTop: '1px',
                marginLeft: '6px',
                overflow: 'visible',
                pointerEvents: 'none',
              }}
            >
              {/* Leader Line */}
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="12"
                stroke="rgba(214, 255, 100, 0.65)"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
              {/* Outer halo dot */}
              <circle
                cx="0"
                cy="13"
                r="3.5"
                fill="none"
                stroke="#D6FF64"
                strokeWidth="1"
                opacity="0.8"
              />
              {/* Center anchor dot */}
              <circle
                cx="0"
                cy="13"
                r="1.8"
                fill="#D6FF64"
              />
            </svg>
          </div>
        </Html>
      ))}
    </group>
  );
};
