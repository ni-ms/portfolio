import React from 'react';

interface BenchmarkComparisonProps {
  baselineMicroseconds?: number;
  optimizedMicroseconds?: number;
  reductionPercent?: number;
  theoreticalPeakPercent?: number;
  qualifier?: string;
  className?: string;
}

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

  return (
    <div
      className={`benchmark-comparison-card ${className}`}
      role="region"
      aria-label="Benchmark Comparison"
      data-testid="benchmark-comparison-card"
    >
      <div className="benchmark-header">
        <div className="benchmark-title-wrap">
          <span className="benchmark-badge-indicator" aria-hidden="true" />
          <h3 className="benchmark-heading">Measured result</h3>
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
