/**
 * SlimeCharacter.tsx
 *
 * スライム牧場用キャラクターコンポーネント（6色+光沢+idle bounce+タッチ反応）
 * Reanimated v4専用。旧Animated API禁止。
 *
 * 6色: green / blue / pink / purple / gold / rainbow
 * RadialGradient風の光沢表現（ViewベースのfakeRadial）
 * idle bounce + wobble + タッチでスクイッシュ反応
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  interpolate,
} from 'react-native-reanimated';

export type SlimeColor = 'green' | 'blue' | 'pink' | 'purple' | 'gold' | 'rainbow';

interface SlimeCharacterProps {
  color?: SlimeColor;
  size?: number;
  onPress?: () => void;
  style?: object;
}

const COLOR_MAP: Record<SlimeColor, { base: string; highlight: string; shadow: string; eye: string; cheek: string }> = {
  green:  { base: '#7BC67E', highlight: '#A8E6AB', shadow: '#4A9E4E', eye: '#333', cheek: 'rgba(255,150,150,0.3)' },
  blue:   { base: '#64B5F6', highlight: '#90CAF9', shadow: '#1E88E5', eye: '#333', cheek: 'rgba(200,200,255,0.3)' },
  pink:   { base: '#F48FB1', highlight: '#F8BBD0', shadow: '#E91E63', eye: '#333', cheek: 'rgba(255,100,150,0.4)' },
  purple: { base: '#B39DDB', highlight: '#D1C4E9', shadow: '#7E57C2', eye: '#333', cheek: 'rgba(200,150,255,0.3)' },
  gold:   { base: '#FFD54F', highlight: '#FFF176', shadow: '#FFB300', eye: '#333', cheek: 'rgba(255,200,100,0.3)' },
  rainbow:{ base: '#FF7EB3', highlight: '#FFD93D', shadow: '#7C4DFF', eye: '#333', cheek: 'rgba(255,255,200,0.4)' },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const SlimeCharacter: React.FC<SlimeCharacterProps> = ({
  color = 'green',
  size = 80,
  onPress,
  style,
}) => {
  const colors = COLOR_MAP[color];
  const scale = useSharedValue(1);
  const wobbleX = useSharedValue(0);
  const wobbleY = useSharedValue(0);

  // Idle bounce + wobble
  useEffect(() => {
    wobbleX.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 700, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );

    wobbleY.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 500, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, []);

  const handlePress = () => {
    // Squish on tap
    scale.value = withSequence(
      withTiming(1.2, { duration: 80 }),
      withSpring(1, { damping: 8, stiffness: 300 }),
    );
    onPress?.();
  };

  const bodyStyle = useAnimatedStyle(() => {
    const scaleX = interpolate(wobbleX.value, [0, 1], [0.97, 1.03]) * scale.value;
    const scaleY = interpolate(wobbleY.value, [0, 1], [1.03, 0.97]) * scale.value;
    const translateY = interpolate(wobbleY.value, [0, 1], [0, -3]);
    return {
      transform: [
        { scaleX },
        { scaleY },
        { translateY },
      ],
    };
  });

  const r = size / 2;
  const eyeSize = size * 0.1;
  const eyeGap = size * 0.14;
  const pupilSize = eyeSize * 0.6;
  const mouthWidth = size * 0.15;
  const mouthHeight = size * 0.08;
  const cheekSize = size * 0.1;
  const highlightSize = size * 0.5;

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[style, bodyStyle]}
      accessibilityRole="button"
      accessibilityLabel={`${color}色のスライム`}
    >
      {/* Shadow */}
      <View style={[localStyles.shadow, {
        width: size * 0.7,
        height: size * 0.15,
        borderRadius: size * 0.35,
        bottom: -size * 0.05,
        left: size * 0.15,
      }]} />

      {/* Body (circular blob) */}
      <View style={[localStyles.body, {
        width: size,
        height: size,
        borderRadius: r,
        backgroundColor: colors.base,
      }]}>
        {/* Highlight (fake radial gradient top-left) */}
        <View style={[localStyles.highlight, {
          width: highlightSize,
          height: highlightSize,
          borderRadius: highlightSize / 2,
          backgroundColor: colors.highlight,
          top: size * 0.08,
          left: size * 0.08,
        }]} />

        {/* Glossy shine spot */}
        <View style={[localStyles.shine, {
          width: size * 0.15,
          height: size * 0.1,
          borderRadius: size * 0.075,
          top: size * 0.15,
          left: size * 0.2,
        }]} />

        {/* Eyes */}
        <View style={[localStyles.eyeRow, { top: size * 0.3 }]}>
          <View style={[localStyles.eye, {
            width: eyeSize, height: eyeSize * 1.2,
            borderRadius: eyeSize / 2,
            marginRight: eyeGap,
          }]}>
            <View style={[localStyles.pupil, {
              width: pupilSize, height: pupilSize,
              borderRadius: pupilSize / 2,
            }]} />
          </View>
          <View style={[localStyles.eye, {
            width: eyeSize, height: eyeSize * 1.2,
            borderRadius: eyeSize / 2,
          }]}>
            <View style={[localStyles.pupil, {
              width: pupilSize, height: pupilSize,
              borderRadius: pupilSize / 2,
            }]} />
          </View>
        </View>

        {/* Mouth */}
        <View style={[localStyles.mouth, {
          width: mouthWidth, height: mouthHeight,
          borderBottomLeftRadius: mouthHeight,
          borderBottomRightRadius: mouthHeight,
          top: size * 0.55,
        }]} />

        {/* Cheeks */}
        <View style={[localStyles.cheek, {
          width: cheekSize, height: cheekSize * 0.6,
          borderRadius: cheekSize / 2,
          backgroundColor: colors.cheek,
          left: size * 0.1,
          top: size * 0.48,
        }]} />
        <View style={[localStyles.cheek, {
          width: cheekSize, height: cheekSize * 0.6,
          borderRadius: cheekSize / 2,
          backgroundColor: colors.cheek,
          right: size * 0.1,
          top: size * 0.48,
        }]} />
      </View>
    </AnimatedPressable>
  );
};

const localStyles = StyleSheet.create({
  shadow: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  body: {
    overflow: 'hidden',
    position: 'relative',
  },
  highlight: {
    position: 'absolute',
    opacity: 0.4,
  },
  shine: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  eyeRow: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  eye: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pupil: {
    backgroundColor: '#333333',
  },
  mouth: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignSelf: 'center',
  },
  cheek: {
    position: 'absolute',
  },
});
