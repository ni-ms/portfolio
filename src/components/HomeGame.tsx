import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { GamePoster } from './GamePoster';
import '../styles/home-game.css';

interface HomeGameProps {
  theme?: 'dark' | 'light';
  onNavigate?: (href: string) => void;
}

const LazyGameStage = React.lazy(() => import('../game/GameStage'));

function supportsWebGL() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

class GameErrorBoundary extends React.Component<{
  theme: 'dark' | 'light';
  children: React.ReactNode;
}, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.warn('Rooftop game failed:', error);
  }

  render() {
    return this.state.failed ? <GamePoster theme={this.props.theme} status="error" /> : this.props.children;
  }
}

export function HomeGame({ theme = 'dark', onNavigate }: HomeGameProps) {
  const [status, setStatus] = useState<'idle' | 'open' | 'unsupported'>('idle');
  const playRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);

  useEffect(() => {
    if (status === 'idle' && restoreFocus.current) {
      restoreFocus.current = false;
      playRef.current?.focus({ preventScroll: true });
    }
  }, [status]);

  const close = useCallback(() => {
    restoreFocus.current = true;
    setStatus('idle');
  }, []);

  if (status === 'open') {
    return (
      <GameErrorBoundary theme={theme}>
        <Suspense fallback={
          <div className={`home-game-root theme-${theme}`}>
            <GamePoster theme={theme} status="loading" onCancel={close} />
          </div>
        }>
          <LazyGameStage theme={theme} onNavigate={onNavigate} startPlaying onClose={close} />
        </Suspense>
      </GameErrorBoundary>
    );
  }

  return (
    <div className={`home-game-root theme-${theme}`} data-testid="home-game-root">
      <GamePoster
        theme={theme}
        status={status}
        playRef={playRef}
        onPlay={() => setStatus(supportsWebGL() ? 'open' : 'unsupported')}
      />
    </div>
  );
}
