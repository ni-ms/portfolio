import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { _roots } from '@react-three/fiber';
import PortfolioPages from '../../../src/pages/PortfolioPages';
import GameStage from '../../../src/game/GameStage';
import { gameStore } from '../../../src/game/gameStore';
import { livePlayerTransform } from '../../../src/game/playerTransform';

function getR3FRoot() {
  const canvas = document.querySelector('canvas');
  if (!canvas) return null;
  return (_roots as any).get(canvas);
}

function getPhysicsWorld() {
  let result: any = null;
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
  const root = getR3FRoot();
  if (root?.fiber?.current) {
    visit(root.fiber.current);
  }
  return result;
}

function getPlayerBody() {
  let found: any = null;
  const phys = getPhysicsWorld();
  if (phys?.world) {
    phys.world.forEachRigidBody((rb: any) => {
      if (rb.userData?.type === 'player') {
        found = rb;
      }
    });
  }
  return found;
}

function getSnapshot() {
  const r3f = getR3FRoot()?.store?.getState();
  const player = livePlayerTransform;
  const body = getPlayerBody();
  const canvasEl = document.querySelector('canvas');
  const canvasContainer = document.querySelector('.scene-canvas-container');
  const slotWrapper = document.querySelector('.game-slot-wrapper');
  const homeRoot = document.querySelector('.home-game-root');
  const perimeterEl = document.querySelector('.home-game-perimeter');
  const markerEls = Array.from(document.querySelectorAll('[name="scene-markers"] a, .scene-markers a, [aria-label*="Jump to"]'));

  return {
    t: performance.now(),
    canvasCount: document.querySelectorAll('canvas').length,
    canvasRect: canvasEl ? canvasEl.getBoundingClientRect().toJSON() : null,
    canvasContainerRect: canvasContainer ? canvasContainer.getBoundingClientRect().toJSON() : null,
    slotWrapperRect: slotWrapper ? slotWrapper.getBoundingClientRect().toJSON() : null,
    homeRootRect: homeRoot ? homeRoot.getBoundingClientRect().toJSON() : null,
    perimeterRect: perimeterEl ? perimeterEl.getBoundingClientRect().toJSON() : null,
    isPerimeterRelaxed:
      homeRoot?.classList.contains('is-relaxed') ||
      homeRoot?.classList.contains('is-playing') ||
      homeRoot?.classList.contains('is-overlay'),
    mode: gameStore.getState().mode,
    currentCheckpointId: gameStore.getState().currentCheckpointId,
    unlockedCheckpoints: gameStore.getState().checkpoints.filter((cp) => cp.unlocked).map((cp) => cp.id),
    frameloop: r3f?.frameloop,
    renderFrame: r3f?.gl.info.render.frame,
    hidden: document.hidden,
    scrollY: window.scrollY,
    activeElementId: (document.activeElement as HTMLElement)?.getAttribute('data-testid') || document.activeElement?.id,
    playerPosition: player.position.toArray(),
    physicalTranslation: body?.translation(),
    isGrounded: player.isGrounded,
    markerLabels: markerEls.map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        text: el.textContent?.trim(),
        rect: rect.toJSON(),
      };
    }),
  };
}

function HarnessApp() {
  const [path, setPath] = useState('/');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // In test harness, prevent synthetic unhandled link clicks (like Ctrl-click) from unloading the harness
  useEffect(() => {
    const handleHarnessClick = (e: MouseEvent) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
        setTimeout(() => window.stop(), 0);
      }
    };
    window.addEventListener('click', handleHarnessClick);
    return () => window.removeEventListener('click', handleHarnessClick);
  }, []);

  // Expose global test handle
  (window as any).__homeGame = {
    snapshot: getSnapshot,
    setPath,
    setTheme,
    getPlayerBody,
    getPhysicsWorld,
    gameStore,
  };

  return (
    <>
      <div id="harness-controls">
        <span style={{ color: 'var(--color-accent, #D6FF64)', fontWeight: 600 }}>T06 HARNESS</span>
        <button id="toggle-theme-btn" onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>
          Theme: {theme}
        </button>
        <button id="nav-home" onClick={() => setPath('/')}>
          Route: /
        </button>
        <button id="nav-projects" onClick={() => setPath('/projects')}>
          Route: /projects
        </button>
        <button id="nav-about" onClick={() => setPath('/about')}>
          Route: /about
        </button>
        <button id="nav-resume" onClick={() => setPath('/resume')}>
          Route: /resume
        </button>
        <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }}>
          Active Route: {path}
        </span>
      </div>

      <PortfolioPages
        path={path}
        gameSlot={
          <GameStage
            theme={theme}
            onNavigate={(dest) => {
              setPath(dest);
              (window as any).__lastNav = dest;
            }}
            forceDeterministic={true}
          />
        }
      />

      <div id="after-scroll">
        <h3>Below-the-fold content for viewport and offscreen suspension verification</h3>
        <p>Testing that scrolling down pauses the 3D frameloop and saves render cycles.</p>
      </div>
    </>
  );
}

const mountRoot = document.getElementById('home-game-harness-root');
if (mountRoot) {
  createRoot(mountRoot).render(<HarnessApp />);
}
