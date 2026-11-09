import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap/dist/gsap';
import { isReducedMotion, subscribeReducedMotion } from '../motion/reducedMotion';

interface BenchmarkComparisonProps {
  baselineMicroseconds?: number;
  optimizedMicroseconds?: number;
  reductionPercent?: number;
  theoreticalPeakPercent?: number;
  qualifier?: string;
  className?: string;
}

/**
 * Real HTML/CSS benchmark comparison visualization.
 * Concretely compares OpenCV baseline (684 µs) to FastCode AVX2/FMA (539 µs).
 * Strictly renders real DOM elements, legible text, and proper qualifiers.
 *
 * Motion contract:
 * - GSAP coordinates smooth bar reveal without animating factual text inaccurately.
 * - Live reduced-motion changes immediately render bars at full scale with zero lag.
 */
export const BenchmarkComparison: React.FC<BenchmarkComparisonProps> = ({
  baselineMicroseconds = 684,
  optimizedMicroseconds = 539,
  reductionPercent = 21,
  theoreticalPeakPercent = 91,
  qualifier = 'Results refer to the primary benchmark workload, not a universal speedup.',
  className = '',
}) => {
  // Proportions: 684 µs is 100%, 539 µs is ~78.8%
  const baselineWidth = 100;
  const optimizedWidth = Math.round((optimizedMicroseconds / baselineMicroseconds) * 1000) / 10;

  const containerRef = useRef<HTMLDivElement>(null);
  const baselineBarRef = useRef<HTMLDivElement>(null);
  const optimizedBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    const baseBar = baselineBarRef.current;
    const optBar = optimizedBarRef.current;
    if (!root || !baseBar || !optBar) return;

    if (isReducedMotion()) {
      gsap.set([baseBar, optBar], { scaleX: 1, clearProps: 'transform' });
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          baseBar,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.6, ease: 'power2.out' }
        );

        gsap.fromTo(
          optBar,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.7, delay: 0.08, ease: 'power2.out' }
        );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([baseBar, optBar], { scaleX: 1, clearProps: 'transform' });
      });
    }, root);

    const unsubscribe = subscribeReducedMotion((reduced) => {
      if (reduced) {
        ctx.revert();
        gsap.set([baseBar, optBar], { scaleX: 1, clearProps: 'transform' });
      }
    });

    return () => {
      unsubscribe();
      ctx.revert();
    };
  }, [baselineWidth, optimizedWidth]);

  return (
    <div
      ref={containerRef}
      className={`benchmark-comparison-card ${className}`}
      role="region"
      aria-label="Benchmark Comparison"
      data-testid="benchmark-comparison-card"
    >
      <div className="benchmark-header">
        <div className="benchmark-title-wrap">
          <span className="benchmark-badge-indicator" aria-hidden="true" />
          <h3 className="benchmark-heading">Primary Workload Benchmark (Single Core)</h3>
        </div>
        <span className="benchmark-target-pill">YOLOv8n FP32 1x1 Conv</span>
      </div>

      <div className="benchmark-bars-container">
        {/* Baseline Bar */}
        <div className="benchmark-row">
          <div className="benchmark-row-meta">
            <span className="benchmark-label">OpenCV Baseline (Reference)</span>
            <span className="benchmark-metric-value">{`${baselineMicroseconds} µs`}</span>
          </div>
          <div className="benchmark-bar-track" aria-hidden="true">
            <div
              ref={baselineBarRef}
              className="benchmark-bar-fill baseline-bar"
              style={{ width: `${baselineWidth}%` }}
              data-testid="benchmark-bar-baseline"
            />
          </div>
        </div>

        {/* Optimized Bar */}
        <div className="benchmark-row">
          <div className="benchmark-row-meta">
            <span className="benchmark-label highlight-label">FastCode (AVX2 / FMA Optimized)</span>
            <span className="benchmark-metric-value highlight-value">{`${optimizedMicroseconds} µs`}</span>
          </div>
          <div className="benchmark-bar-track" aria-hidden="true">
            <div
              ref={optimizedBarRef}
              className="benchmark-bar-fill optimized-bar"
              style={{ width: `${optimizedWidth}%` }}
              data-testid="benchmark-bar-optimized"
            />
          </div>
        </div>
      </div>

      {/* Metrics Callout Badges */}
      <div className="benchmark-callout-grid">
        <div className="benchmark-stat-box">
          <span className="stat-number">{`▼ ${reductionPercent}%`}</span>
          <span className="stat-label">Latency Reduction</span>
        </div>
        <div className="benchmark-stat-box">
          <span className="stat-number">{`~${theoreticalPeakPercent}%`}</span>
          <span className="stat-label">Theoretical Peak (Single Core)</span>
        </div>
        <div className="benchmark-stat-box">
          <span className="stat-number">145 µs</span>
          <span className="stat-label">Absolute Execution Savings</span>
        </div>
      </div>

      {/* Required Workload Qualifier */}
      {qualifier && (
        <p className="benchmark-qualifier">
          <span className="qualifier-mark" aria-hidden="true">ℹ</span>
          <span className="qualifier-text">{qualifier}</span>
        </p>
      )}
    </div>
  );
};
