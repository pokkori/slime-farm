import { useState } from 'react';

/**
 * useRewardedAd -- リワード広告フック（モック実装）
 *
 * 実際のAdMob接続はストアリリース後に行う。
 * 今はフォールバックとして即座にリワードを付与する。
 */
export function useRewardedAd() {
  const [isLoaded] = useState(true);

  const showAd = async (onReward: () => void) => {
    onReward();
  };

  return { isLoaded, showAd };
}
