/**
 * スライム牧場 マスコット: メインスライム「ぷるん」
 * 1.5頭身SD / 目は頭部40% / 輪郭線なし / グラデ上下15%明度差
 * 表情6種: happy / excited / sleepy / hungry / love / surprised
 */
import React from 'react';
import Svg, {
  Circle, Ellipse, Path, G, Defs, RadialGradient, LinearGradient, Stop,
} from 'react-native-svg';

type SlimeColor = 'green' | 'blue' | 'pink' | 'gold' | 'purple';
type SlimeExpression = 'happy' | 'excited' | 'sleepy' | 'hungry' | 'love' | 'surprised';

interface MascotSvgProps {
  size?: number;
  color?: SlimeColor;
  expression?: SlimeExpression;
}

const COLORS: Record<SlimeColor, { light: string; main: string; dark: string; cheek: string }> = {
  green:  { light: '#7DFFB3', main: '#58D68D', dark: '#2ECC71', cheek: '#A9DFBF' },
  blue:   { light: '#85C1E9', main: '#5DADE2', dark: '#3498DB', cheek: '#AED6F1' },
  pink:   { light: '#F5B7B1', main: '#E74C8B', dark: '#C0392B', cheek: '#FADBD8' },
  gold:   { light: '#F9E79F', main: '#F4D03F', dark: '#D4AC0D', cheek: '#FCF3CF' },
  purple: { light: '#D2B4DE', main: '#AF7AC5', dark: '#8E44AD', cheek: '#E8DAEF' },
};

export const MascotSvg: React.FC<MascotSvgProps> = ({
  size = 120,
  color = 'green',
  expression = 'happy',
}) => {
  const c = COLORS[color];

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      accessibilityLabel={`${color}スライム（ぷるん）`}
    >
      <Defs>
        <RadialGradient id="bodyGrad" cx="45%" cy="35%" r="60%">
          <Stop offset="0%" stopColor={c.light} />
          <Stop offset="60%" stopColor={c.main} />
          <Stop offset="100%" stopColor={c.dark} />
        </RadialGradient>
        <RadialGradient id="highlight" cx="35%" cy="25%" r="30%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Shadow */}
      <Ellipse cx="60" cy="108" rx="32" ry="6" fill="#00000020" />

      {/* Body - blob shape */}
      <Path
        d="M60 18 C85 18, 98 35, 98 58 C98 82, 88 100, 60 102 C32 100, 22 82, 22 58 C22 35, 35 18, 60 18 Z"
        fill="url(#bodyGrad)"
      />

      {/* Highlight */}
      <Ellipse cx="48" cy="38" rx="16" ry="12" fill="url(#highlight)" />

      {/* Small highlight dot */}
      <Circle cx="42" cy="32" r="5" fill="#FFFFFF" opacity={0.4} />

      {/* Eyes - large (40% of head) */}
      {expression === 'sleepy' ? (
        <G>
          <Path d="M42 55 Q48 50 54 55" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
          <Path d="M66 55 Q72 50 78 55" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
        </G>
      ) : expression === 'love' ? (
        <G>
          {/* Heart eyes */}
          <Path d="M42 50 C42 44, 48 44, 48 50 C48 44, 54 44, 54 50 C54 58, 48 62, 48 62 C48 62, 42 58, 42 50 Z" fill="#E74C8B" />
          <Path d="M66 50 C66 44, 72 44, 72 50 C72 44, 78 44, 78 50 C78 58, 72 62, 72 62 C72 62, 66 58, 66 50 Z" fill="#E74C8B" />
        </G>
      ) : (
        <G>
          {/* Normal big round eyes */}
          <Ellipse cx="48" cy="54" rx="10" ry={expression === 'surprised' ? 12 : 10} fill="#FFFFFF" />
          <Ellipse cx="72" cy="54" rx="10" ry={expression === 'surprised' ? 12 : 10} fill="#FFFFFF" />
          {/* Iris */}
          <Circle cx={expression === 'excited' ? 50 : 48} cy={expression === 'excited' ? 52 : 54} r="6" fill="#2C3E50" />
          <Circle cx={expression === 'excited' ? 74 : 72} cy={expression === 'excited' ? 52 : 54} r="6" fill="#2C3E50" />
          {/* Pupil */}
          <Circle cx={expression === 'excited' ? 51 : 49} cy={expression === 'excited' ? 51 : 53} r="3" fill="#1A1A2E" />
          <Circle cx={expression === 'excited' ? 75 : 73} cy={expression === 'excited' ? 51 : 53} r="3" fill="#1A1A2E" />
          {/* Shine */}
          <Circle cx="45" cy="50" r="3" fill="#FFFFFF" />
          <Circle cx="69" cy="50" r="3" fill="#FFFFFF" />
          <Circle cx="51" cy="56" r="1.5" fill="#FFFFFF" opacity={0.7} />
          <Circle cx="75" cy="56" r="1.5" fill="#FFFFFF" opacity={0.7} />
        </G>
      )}

      {/* Cheek blush */}
      <Ellipse cx="36" cy="64" rx="7" ry="4" fill={c.cheek} opacity={0.7} />
      <Ellipse cx="84" cy="64" rx="7" ry="4" fill={c.cheek} opacity={0.7} />

      {/* Mouth */}
      {expression === 'happy' && (
        <Path d="M52 70 Q60 78 68 70" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {expression === 'excited' && (
        <Path d="M50 68 Q60 80 70 68" stroke="#333" strokeWidth="2" fill="#FF8A93" strokeLinecap="round" />
      )}
      {expression === 'sleepy' && (
        <Ellipse cx="60" cy="70" rx="4" ry="3" fill="#333" />
      )}
      {expression === 'hungry' && (
        <Path d="M52 72 Q60 66 68 72" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {expression === 'love' && (
        <Path d="M52 68 Q60 76 68 68" stroke="#E74C8B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
      {expression === 'surprised' && (
        <Ellipse cx="60" cy="72" rx="6" ry="8" fill="#333" />
      )}

      {/* Tiny arms */}
      {expression === 'excited' && (
        <G>
          <Path d="M26 62 L18 52" stroke={c.main} strokeWidth="5" strokeLinecap="round" />
          <Path d="M94 62 L102 52" stroke={c.main} strokeWidth="5" strokeLinecap="round" />
        </G>
      )}
    </Svg>
  );
};
