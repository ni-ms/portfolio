import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { _roots } from '@react-three/fiber';
import { GameExperience } from '../../../src/game/GameExperience';
import { gameStore } from '../../../src/game/gameStore';
import { livePlayerTransform } from '../../../src/game/playerTransform';
import { CHECKPOINTS, COURSE_BOUNDS } from '../../../src/game/courseConfig';

function root() {
  return (_roots as any).get(document.querySelector('canvas'));
}

function physics() {
  let result: any;
  const visit = (fiber: any) => {
    if (!fiber || result) return;
    const value = fiber.memoizedProps?.value;
    if (value?.world && value?.rigidBodyStates) {
      result = value;
      return;
    }
    visit(fiber.child);
    visit(fiber.sibling);
  };
  visit(root()?.fiber?.current);
  return result;
}

function body() {
  let found: any;
  physics()?.world.forEachRigidBody((rb: any) => {
    if (rb.userData?.type === 'player') found = rb;
  });
  return found;
}

function snapshot() {
  const r = root()?.store?.getState();
  const p = livePlayerTransform;
  const b = body();
  return {
    t: performance.now(),
    mode: gameStore.getState().mode,
    cp: gameStore.getState().currentCheckpointId,
    unlocked: gameStore.getState().checkpoints.filter((cp) => cp.unlocked).map((cp) => cp.id),
    input: { ...gameStore.getState().input },
    grounded: p.isGrounded,
    p: p.position.toArray(),
    v: p.linvel.toArray(),
    physical: b?.translation(),
    physicalV: b?.linvel(),
    frameloop: r?.frameloop,
    hidden: document.hidden,
    visibility: document.visibilityState,
    rect: document.querySelector('.scene-canvas-container')?.getBoundingClientRect().toJSON(),
    canvas: document.querySelectorAll('canvas').length,
    renderFrame: r?.gl.info.render.frame,
    locked: document.body.classList.contains('scroll-locked'),
    scrollY: window.scrollY,
    focus:
      (document.activeElement as HTMLElement)?.getAttribute('data-testid') ||
      document.activeElement?.id ||
      document.activeElement?.tagName,
  };
}

(window as any).__gameplay = {
  snapshot,
  physics,
  body,
  CHECKPOINTS,
  COURSE_BOUNDS,
  gameStore,
};

function App() {
  const [mounted, setMounted] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  (window as any).__gameplay.setMounted = setMounted;
  (window as any).__gameplay.setTheme = setTheme;

  return (
    <>
      <div id="toolbar">
        <a id="before-link" href="#after">
          Outside before
        </a>
        <button id="theme-btn" onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>
          Toggle Theme
        </button>
      </div>
      <div id="viewport">
        {mounted && (
          <GameExperience
            theme={theme}
            forceDeterministic={true}
            onNavigate={(href) => {
              (window as any).__lastNav = href;
            }}
          />
        )}
      </div>
      <div id="after">
        <a id="after-link" href="#toolbar">
          Outside after
        </a>
        <p>Scrollable page content for viewport and focus cleanup verification.</p>
      </div>
    </>
  );
}

createRoot(document.getElementById('gameplay-root')!).render(<App />);
