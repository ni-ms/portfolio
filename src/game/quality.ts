import { QualityPreset } from '../types/game';

export interface ExtendedQualityPreset extends QualityPreset {
  shadowBias: number;
  shadowNormalBias: number;
  maxAnisotropy: number;
  isDeterministicReview: boolean;
}

export const DESKTOP_QUALITY: ExtendedQualityPreset = {
  dpr: 2,
  shadowResolution: 2048,
  enableShadows: true,
  enablePostprocessing: false,
  foliageDensity: 'full',
  shadowBias: -0.0001,
  shadowNormalBias: 0.02,
  maxAnisotropy: 8,
  isDeterministicReview: false,
};

export const MOBILE_QUALITY: ExtendedQualityPreset = {
  dpr: 1.5,
  shadowResolution: 1024,
  enableShadows: true,
  enablePostprocessing: false,
  foliageDensity: 'sparse',
  shadowBias: -0.00015,
  shadowNormalBias: 0.03,
  maxAnisotropy: 4,
  isDeterministicReview: false,
};

export const DETERMINISTIC_REVIEW_QUALITY: ExtendedQualityPreset = {
  dpr: 2,
  shadowResolution: 2048,
  enableShadows: true,
  enablePostprocessing: false,
  foliageDensity: 'full',
  shadowBias: -0.0001,
  shadowNormalBias: 0.02,
  maxAnisotropy: 8,
  isDeterministicReview: true,
};

/**
 * Check if deterministic visual review mode is enabled via URL search param (?review=1)
 * or localStorage flag. In this mode, idle drift is paused and fixed camera angles are used.
 */
export function isDeterministicReviewMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('review') === 'true' || urlParams.get('review') === '1') {
      return true;
    }
    if (window.localStorage.getItem('parkour_deterministic_review') === 'true') {
      return true;
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
  return false;
}

/**
 * Get quality settings based on viewport size and review mode.
 */
export function getQualityPreset(isMobile: boolean, forceDeterministic?: boolean): ExtendedQualityPreset {
  const isReview = forceDeterministic ?? isDeterministicReviewMode();
  if (isReview) {
    return { ...DETERMINISTIC_REVIEW_QUALITY };
  }
  return isMobile ? { ...MOBILE_QUALITY } : { ...DESKTOP_QUALITY };
}
