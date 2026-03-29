/**
 * スライム牧場 ゲーム背景: 牧場メッシュグラデーション
 * 放置育成パレット: #87CEEB -> #98FB98 / UI #FFF8E7
 */
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Rect, Defs, RadialGradient, Stop, LinearGradient, Circle, Ellipse, Path, G,
} from 'react-native-svg';

const { width: W, height: H } = Dimensions.get('window');

interface GameBackgroundProps {
  timeOfDay?: 'day' | 'sunset' | 'night';
}

export const GameBackground: React.FC<GameBackgroundProps> = ({ timeOfDay = 'day' }) => {
  const isNight = timeOfDay === 'night';
  const isSunset = timeOfDay === 'sunset';

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={isNight ? '#0D1B2A' : isSunset ? '#FF6B35' : '#87CEEB'} />
            <Stop offset="40%" stopColor={isNight ? '#1B2838' : isSunset ? '#FF9A76' : '#B0E0E6'} />
            <Stop offset="70%" stopColor={isNight ? '#2A3D50' : isSunset ? '#FFD93D' : '#E0F7E0'} />
            <Stop offset="100%" stopColor={isNight ? '#1A3A2A' : '#98FB98'} />
          </LinearGradient>
          <RadialGradient id="sunGlow" cx="80%" cy="15%" r="25%">
            <Stop offset="0%" stopColor={isNight ? '#7B68EE' : isSunset ? '#FFD700' : '#FFE082'} stopOpacity="0.4" />
            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="grassGlow" cx="50%" cy="90%" r="40%">
            <Stop offset="0%" stopColor="#2ECC71" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect x="0" y="0" width={W} height={H} fill="url(#sky)" />
        <Rect x="0" y="0" width={W} height={H} fill="url(#sunGlow)" />
        <Rect x="0" y="0" width={W} height={H} fill="url(#grassGlow)" />

        {/* Clouds */}
        {!isNight && (
          <G opacity={0.6}>
            <Ellipse cx={W * 0.2} cy={H * 0.12} rx="30" ry="12" fill="#FFFFFF" />
            <Ellipse cx={W * 0.25} cy={H * 0.1} rx="22" ry="10" fill="#FFFFFF" />
            <Ellipse cx={W * 0.7} cy={H * 0.08} rx="25" ry="10" fill="#FFFFFF" />
            <Ellipse cx={W * 0.75} cy={H * 0.06} rx="18" ry="8" fill="#FFFFFF" />
          </G>
        )}

        {/* Stars at night */}
        {isNight && (
          <G>
            {[
              [0.1, 0.05], [0.3, 0.08], [0.5, 0.03], [0.7, 0.12], [0.9, 0.06],
              [0.15, 0.18], [0.45, 0.15], [0.65, 0.2], [0.85, 0.1],
            ].map(([x, y], i) => (
              <Circle key={i} cx={W * x} cy={H * y} r={1 + (i % 3)} fill="#FFFFFF" opacity={0.3 + (i % 3) * 0.15} />
            ))}
          </G>
        )}

        {/* Rolling hills */}
        <Path
          d={`M0 ${H * 0.75} Q${W * 0.25} ${H * 0.68} ${W * 0.5} ${H * 0.73} Q${W * 0.75} ${H * 0.78} ${W} ${H * 0.7} L${W} ${H} L0 ${H} Z`}
          fill={isNight ? '#1A3A2A' : '#7DCE82'}
          opacity={0.5}
        />
        <Path
          d={`M0 ${H * 0.82} Q${W * 0.3} ${H * 0.76} ${W * 0.6} ${H * 0.8} Q${W * 0.85} ${H * 0.84} ${W} ${H * 0.78} L${W} ${H} L0 ${H} Z`}
          fill={isNight ? '#2A4A3A' : '#98FB98'}
          opacity={0.6}
        />
      </Svg>
    </View>
  );
};
