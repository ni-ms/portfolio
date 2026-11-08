import { useState, useRef, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { Projects } from '../components/Projects';
import { Explorations } from '../components/Explorations';
import { Resume } from '../components/Resume';
import { Contact } from '../components/Contact';
import { DioramaCanvas } from '../game/DioramaCanvas';
import { GameOverlay } from '../game/GameOverlay';
import { gameStore, useGameStore } from '../game/gameStore';
import { usePageMotion } from '../motion/usePageMotion';

export interface AppProps {
  canvasSlot?: React.ReactNode;
  onDroneView?: () => void;
  onStartExploring?: () => void;
  onPlayMobile?: () => void;
  is3dActive?: boolean;
}

export default function App({
  canvasSlot,
  onDroneView,
  onStartExploring,
  onPlayMobile,
  is3dActive,
}: AppProps = {}) {
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [recenterSignal, setRecenterSignal] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Synchronize gameStore mode
  const currentMode = useGameStore((s) => s.mode);
  const isPlaying = is3dActive !== undefined ? is3dActive : currentMode !== 'preview';

  // Responsive breakpoint tracking
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileViewport(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // GSAP motion orchestration (intro reveals, route SVG animation, ScrollTrigger)
  usePageMotion({ containerRef });

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDroneView = () => {
    setRecenterSignal((s) => s + 1);
    gameStore.getState().actions.recenterDroneView();
    if (onDroneView) onDroneView();
  };

  const handleStartExploring = () => {
    gameStore.getState().actions.setMode('play-inline');
    if (onStartExploring) onStartExploring();
  };

  const handlePlayMobile = () => {
    gameStore.getState().actions.setMode('play-overlay');
    if (onPlayMobile) onPlayMobile();
  };

  const handleOverlayExit = () => {
    gameStore.getState().actions.setMode('preview');
  };

  // Default integrated 3D canvas if custom canvasSlot is not provided
  const activeCanvas = canvasSlot ?? (
    <DioramaCanvas
      mode={currentMode}
      isMobile={isMobileViewport}
      recenterSignal={recenterSignal}
      onSelectCheckpoint={handleNavigateSection}
    />
  );

  return (
    <div className="portfolio-app" ref={containerRef}>
      {/* Main Semantic Landmark */}
      <main id="main-content" tabIndex={-1}>
        <Hero
          canvasSlot={activeCanvas}
          isPlaying={isPlaying}
          onDroneView={handleDroneView}
          onStartExploring={handleStartExploring}
          onPlayMobile={handlePlayMobile}
          onNavigateSection={handleNavigateSection}
        />

        <div className="scroll-reveal-section">
          <Projects />
        </div>

        <div className="scroll-reveal-section">
          <Explorations />
        </div>

        <div className="scroll-reveal-section">
          <Resume />
        </div>

        <div className="scroll-reveal-section">
          <Contact />
        </div>
      </main>

      {/* Site Footer */}


      {/* Viewport-filling Mobile Game Overlay (Right mockup screen at 390x844) */}
      {currentMode === 'play-overlay' && (
        <GameOverlay onExit={handleOverlayExit}>
          <DioramaCanvas
            mode="play-overlay"
            isMobile={true}
            recenterSignal={recenterSignal}
            showMarkers={false}
            onSelectCheckpoint={handleNavigateSection}
          />
        </GameOverlay>
      )}
    </div>
  );
}
