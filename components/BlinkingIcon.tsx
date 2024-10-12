// src/components/BlinkingIcon.tsx
import React, { useState, useEffect } from 'react';
import { Animated, ImageSourcePropType, Dimensions, Easing, StyleSheet } from 'react-native';

interface BlinkingIconProps {
  source: ImageSourcePropType;
  shouldReverse: boolean;
  onReverseAnimationComplete?: () => void;
  onAnimationComplete?: () => void;
  startPosition?: { x: number; y: number };
  endPosition?: { x: number; y: number };
  startSize?: number;
  endSize?: number;
  animationDelay?: number;
}

export const BlinkingIcon: React.FC<BlinkingIconProps> = ({
  source,
  shouldReverse,
  onReverseAnimationComplete,
  onAnimationComplete, // New prop
  startPosition = { x: -Dimensions.get('window').width / 2 + 38, y: -Dimensions.get('window').height / 2 + 45 },
  endPosition = { x: 0, y: 0 },
  startSize = 0.25,
  endSize = 1,
  animationDelay = 0,
}) => {
  const [opacity] = useState(new Animated.Value(1));
  const [position] = useState(new Animated.ValueXY(startPosition));
  const [size] = useState(new Animated.Value(startSize));
  const opacityAnimationRef = React.useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Start blinking animation
    const opacityAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    opacityAnimationRef.current = opacityAnimation;
    opacityAnimation.start();

    // Start position and size animation
    const animationTimeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(position, {
          toValue: endPosition,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(size, {
          toValue: endSize,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Forward animation completed
        if (!shouldReverse && onAnimationComplete) {
          onAnimationComplete(); // Trigger forward animation complete callback
        }
      });
    }, animationDelay);

    return () => {
      // Clean up animations
      if (opacityAnimationRef.current) {
        opacityAnimationRef.current.stop();
      }
      clearTimeout(animationTimeout);
    };
  }, []);

  useEffect(() => {
    if (shouldReverse) {
      // Start reverse animations
      Animated.parallel([
        Animated.timing(position, {
          toValue: startPosition, // move back to original position
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(size, {
          toValue: startSize, // shrink the size back
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Reverse animation completed
        if (onReverseAnimationComplete) {
          onReverseAnimationComplete();
        }
      });
    }
  }, [shouldReverse]);

  return (
    <Animated.Image
      source={source}
      style={[
        styles.circleImage,
        { opacity },
        {
          transform: [
            { translateX: position.x },
            { translateY: position.y },
            { scale: size },
          ],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  circleImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});
