import React from 'react';
import { Html } from '@react-three/drei';
import { COURSE_BOUNDS, CHECKPOINTS } from './courseConfig';

export interface SceneMarkersProps {
  onSelectCheckpoint?: (sectionId: string) => void;
  visible?: boolean;
}

interface MarkerItem {
  id: string;
  labelNumber: string;
  labelTitle: string;
  sectionId: string;
  position: [number, number, number];
}

export const SceneMarkers: React.FC<SceneMarkersProps> = ({
  onSelectCheckpoint,
  visible = true,
}) => {
  if (!visible) return null;

  const markers: MarkerItem[] = [
    {
      id: CHECKPOINTS[1].id,
      labelNumber: '01',
      labelTitle: 'WORK',
      sectionId: 'work',
      position: [
        COURSE_BOUNDS.workRooftop.beaconPosition[0],
        COURSE_BOUNDS.workRooftop.beaconPosition[1] + 1.2,
        COURSE_BOUNDS.workRooftop.beaconPosition[2],
      ],
    },
    {
      id: CHECKPOINTS[2].id,
      labelNumber: '02',
      labelTitle: 'EXPLORATIONS',
      sectionId: 'explorations',
      position: [
        COURSE_BOUNDS.explorationRooftop.beaconPosition[0],
        COURSE_BOUNDS.explorationRooftop.beaconPosition[1] + 1.2,
        COURSE_BOUNDS.explorationRooftop.beaconPosition[2],
      ],
    },
    {
      id: CHECKPOINTS[3].id,
      labelNumber: '03',
      labelTitle: 'RÉSUMÉ',
      sectionId: 'resume',
      position: [
        COURSE_BOUNDS.resumeRooftop.beaconPosition[0],
        COURSE_BOUNDS.resumeRooftop.beaconPosition[1] + 1.2,
        COURSE_BOUNDS.resumeRooftop.beaconPosition[2],
      ],
    },
  ];

  const handleClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (onSelectCheckpoint) {
      onSelectCheckpoint(sectionId);
    } else {
      const el = document.getElementById(sectionId);
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
              href={`#${marker.sectionId}`}
              onClick={(e) => handleClick(e, marker.sectionId)}
              aria-label={`Jump to ${marker.labelNumber} ${marker.labelTitle} section`}
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
              height="28"
              viewBox="0 0 24 28"
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
                y2="22"
                stroke="rgba(214, 255, 100, 0.65)"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
              {/* Outer halo dot */}
              <circle
                cx="0"
                cy="23"
                r="3.5"
                fill="none"
                stroke="#D6FF64"
                strokeWidth="1"
                opacity="0.8"
              />
              {/* Center anchor dot */}
              <circle
                cx="0"
                cy="23"
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
