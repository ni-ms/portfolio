import { useEffect, useRef, type RefObject } from 'react';

type PosterStatus = 'idle' | 'loading' | 'unsupported' | 'error';

export function GamePoster({
  theme,
  status,
  onPlay,
  onCancel,
  playRef,
}: {
  theme: 'dark' | 'light';
  status: PosterStatus;
  onPlay?: () => void;
  onCancel?: () => void;
  playRef?: RefObject<HTMLButtonElement | null>;
}) {
  const failureLink = useRef<HTMLAnchorElement>(null);
  const failed = status === 'error' || status === 'unsupported';

  useEffect(() => {
    if (failed) failureLink.current?.focus({ preventScroll: true });
  }, [failed]);

  return (
    <section
      className="home-game-poster"
      aria-label="Parkour Game preview"
      data-testid={failed ? 'home-game-fallback' : 'home-game-poster'}
    >
      <img src={`/images/rooftop-preview/${theme}.jpg`} width={960} height={390} alt="" />
      <div className="home-game-poster-actions">
        {status === 'idle' && (
          <button ref={playRef} type="button" className="home-game-play" data-testid="enter-play-btn" onClick={onPlay}>
            <span aria-hidden="true">▶</span> Play Parkour Game
          </button>
        )}
        {status === 'loading' && (
          <>
            <p role="status">Loading Parkour Game…</p>
            {onCancel && <button type="button" className="home-game-cancel" onClick={onCancel}>Cancel</button>}
          </>
        )}
        {failed && (
          <>
            <p role="status">{status === 'unsupported' ? 'WebGL is unavailable.' : 'The Parkour Game couldn’t load.'}</p>
            <a ref={failureLink} href="/projects">View projects →</a>
          </>
        )}
      </div>
    </section>
  );
}
