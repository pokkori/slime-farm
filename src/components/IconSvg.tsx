/**
 * SVG icons for Slime Ranch - replaces all emoji usage
 * react-native-svg based, fully accessible
 */
import React from 'react';
import Svg, { Circle, Path, Rect, G, Ellipse, Line } from 'react-native-svg';

export type SlimeIconName =
  | 'moon'
  | 'timer'
  | 'coin'
  | 'gem'
  | 'megaphone'
  | 'sparkle'
  | 'checkmark'
  | 'checkbox_checked'
  | 'checkbox_empty'
  | 'checkbox_done';

interface IconSvgProps {
  name: SlimeIconName;
  size?: number;
  color?: string;
}

export const IconSvg: React.FC<IconSvgProps> = ({ name, size = 24, color = '#FFD700' }) => {
  switch (name) {
    case 'moon':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="月">
          <Path
            d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"
            fill="#F4C430"
          />
          <Circle cx="8" cy="8" r="0.8" fill="#E8A800" />
          <Circle cx="11" cy="14" r="0.5" fill="#E8A800" />
        </Svg>
      );

    case 'timer':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="タイマー">
          <Circle cx="12" cy="13" r="8" fill="none" stroke={color} strokeWidth="2" />
          <Path d="M12 9v4l3 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <Rect x="10" y="2" width="4" height="2" rx="1" fill={color} />
          <Path d="M7.5 4.5l-1-1M16.5 4.5l1-1" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </Svg>
      );

    case 'coin':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="コイン">
          <Circle cx="12" cy="12" r="10" fill="#FFD700" />
          <Circle cx="12" cy="12" r="8" fill="#FFA000" />
          <Path
            d="M12 7v10M9 9h4.5c.83 0 1.5.67 1.5 1.5S14.33 12 13.5 12H10.5c-.83 0-1.5.67-1.5 1.5S9.67 15 10.5 15H15"
            stroke="#FFD700"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'gem':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="ジェム">
          <Path d="M5 7l-2 5 9 9 9-9-2-5H5z" fill="#7C4DFF" />
          <Path d="M8 7l-1 5h10l-1-5H8z" fill="#B388FF" />
          <Path d="M12 12l-5 0 5 9 5-9H12z" fill="#651FFF" />
        </Svg>
      );

    case 'megaphone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="広告">
          <Path d="M18 3v18l-6-4H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h6l6-4z" fill={color} />
          <Path d="M20.5 9.5a3.5 3.5 0 0 1 0 5" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </Svg>
      );

    case 'sparkle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="特殊能力">
          <Path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#FFD700" />
          <Path d="M19 8l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="#FFA000" />
        </Svg>
      );

    case 'checkmark':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="完了">
          <Circle cx="12" cy="12" r="10" fill="#4CAF50" />
          <Path d="M8 12l3 3 5-6" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    case 'checkbox_checked':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="達成済み">
          <Rect x="3" y="3" width="18" height="18" rx="3" fill="#4CAF50" />
          <Path d="M8 12l3 3 5-6" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    case 'checkbox_empty':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="未達成">
          <Rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="#999" strokeWidth="2" />
        </Svg>
      );

    case 'checkbox_done':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="受取済み">
          <Rect x="3" y="3" width="18" height="18" rx="3" fill="#888" />
          <Path d="M8 12l3 3 5-6" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    default:
      return null;
  }
};

/**
 * SVG star rating (replaces \u2605/\u2606 characters)
 */
export const StarRating: React.FC<{ filled: number; total?: number; size?: number }> = ({
  filled,
  total = 6,
  size = 12,
}) => {
  const stars = [];
  for (let i = 0; i < total; i++) {
    stars.push(
      <Svg key={i} width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={i < filled ? '#FFD700' : '#E0E0E0'}
        />
      </Svg>
    );
  }
  return <>{stars}</>;
};
