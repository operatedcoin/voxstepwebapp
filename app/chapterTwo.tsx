// ChapterTwo.tsx
import React from 'react';
import { View, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { BlinkingIcon } from '@/components/BlinkingIcon';

export default function ChapterTwo() {
  const router = useRouter();

  const { width, height } = Dimensions.get('window');
  const startPosition = { x: 0, y: 0 }; // Center of the screen
  const endPosition = { x: -width / 2 + 38, y: -height / 2 + 45 }; // Top left
  const startSize = 1; // Full size
  const endSize = 0.15; // Smaller size

  const onAnimationComplete = () => {
    router.push('./chapterThree');
  };

  return (
    <ImageBackground
    source={require('@/assets/images/voxstep_bg_gradient.png')}
    resizeMode='stretch'
    style={{
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <View style={styles.container}>
      <BlinkingIcon
        source={require('@/assets/images/entity.png')}
        shouldReverse={false} 
        startPosition={startPosition}
        endPosition={endPosition}
        startSize={startSize}
        endSize={endSize}
        animationDelay={3000} // Delay before starting the position and size animations (3 seconds)
        onAnimationComplete={onAnimationComplete} // Navigate to Chapter Three when done
      />
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
