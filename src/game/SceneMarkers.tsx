import React from 'react';
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

const vPos = new THREE.Vector3();

/**
 * Calibrated position calculator ensuring badges remain visibly positioned within canvas bounds
 * across all viewports (preventing offscreen badges extending scrollWidth or causing keyboard tab panning).
 */
const calculateClampedPosition = (
  el: THREE.Object3D,
  camera: THREE.Camera,
  size: { width: number; height: number }
): [number, number] => {
  vPos.setFromMatrixPosition(el.matrixWorld);
  vPos.project(camera);
  const widthHalf = size.width / 2;
  const heightHalf = size.height / 2;
  const rawX = vPos.x * widthHalf + widthHalf;
  const rawY = -vPos.y * heightHalf + heightHalf;

  // Approximate badge bounding box:
  // - width up to ~146px ('02 / EXPLORATIONS' is longest)
  // - height ~46px (badge ~28px + leader line ~18px)
  // We clamp within canvas margins so every badge stays visible, clickable, and keyboard-focusable
  // without exceeding canvas bounds or causing document pan.
  const minX = 12;
  const maxX = Math.max(minX, size.width - 146);
  const minY = 48;
  const maxY = Math.max(minY, size.height - 12);

  const clampedX = Math.max(minX, Math.min(rawX, maxX));
  const clampedY = Math.max(minY, Math.min(rawY, maxY));
  return [clampedX, clampedY];
};

export const SceneMarkers: React.FC<SceneMarkersProps> = ({
  onSelectCheckpoint,
  visible = true,
  portal,
}) => {
  if (!visible) return null;

  const markers: MarkerItem[] = [
    {
      id: CHECKPOINTS[1].id,
      labelNumber: '01',
      labelTitle: 'WORK',
      sectionId: 'work',
      targetRoute: CHECKPOINTS[1].targetRoute || '/projects',
      // Calibrated elevation offset ensuring badge stays cleanly inside canvas top in all viewports
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
      {markers.map((marker) => (
        <Html
          key={marker.id}
          position={marker.position}
          center={false}
          portal={portal as React.RefObject<HTMLElement> | undefined}
          calculatePosition={calculateClampedPosition}
          zIndexRange={[50, 0]}
          style={{
            pointerEvents: 'auto',
            transform: 'translate3d(-6px, -100%, 0)',
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
              href={marker.targetRoute || `#${marker.sectionId}`}
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
