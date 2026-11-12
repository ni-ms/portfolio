import { Suspense, useEffect, useRef, useState } from 'react';
import { GamePoster } from '../components/GamePoster';
import "../styles/home-game.css";
import { GameExperience } from './GameExperience';
import { gameStore, useGameStore } from './gameStore';

export default function GameStage({
  theme = 'dark',
  onNavigate,
  startPlaying = false,
  onClose,
  forceDeterministic = false,
}: {
  theme?: 'dark' | 'light';
  onNavigate?: (href: string) => void;
  startPlaying?: boolean;
  onClose?: () => void;
  forceDeterministic?: boolean;
}) {
  const mode = useGameStore((state) => state.mode);
  const [contextLost, setContextLost] = useState(false);
  const canvasWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextLost = (event: Event) => {
      if (event.target !== canvasWrap.current?.querySelector('canvas')) return;
      event.preventDefault();
      gameStore.getState().actions.setMode('preview');
      setContextLost(true);
    };
    window.addEventListener('webglcontextlost', handleContextLost, true);
    return () => window.removeEventListener('webglcontextlost', handleContextLost, true);
  }, []);

  return (
    <div
      className={`home-game-root theme-${theme}${mode !== 'preview' ? ' is-playing is-relaxed' : ''}${mode === 'play-overlay' ? ' is-overlay' : ''}`}
      data-testid="home-game-root"
    >
      {contextLost ? <GamePoster theme={theme} status="error" /> : (
        <div className="home-game-canvas-wrap" ref={canvasWrap}>
          <Suspense fallback={<GamePoster theme={theme} status="loading" onCancel={onClose} />}>
            <GameExperience
              theme={theme}
              onNavigate={onNavigate}
              forceDeterministic={forceDeterministic}
              startPlaying={startPlaying}
              onStop={onClose}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
