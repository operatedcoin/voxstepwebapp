import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSound } from '@/components/SoundContext';
import { AVPlaybackStatus } from 'expo-av';
import { BlinkingIcon } from '@/components/BlinkingIcon';

export default function ChapterFour() {
  const { playSound, stopSound, setOnPlaybackStatusUpdate } = useSound();
  const router = useRouter();
  const [shouldReverse, setShouldReverse] = useState(false);
  const [isReversing, setIsReversing] = useState(false);

  const { width, height } = Dimensions.get('window');
  const startPosition = { x: -width / 2 + 38, y: -height / 2 + 45 }; 
  const endPosition = { x: 0, y: 0 }; 
  const startSize = 0.25; 
  const endSize = 1;

  useEffect(() => {
    let isMounted = true;

    // Callback for playback status updates
    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        if (status.error) {
          console.log(`Playback error: ${status.error}`);
        }
      } else {
        if (status.didJustFinish && !status.isLooping) {
          // Trigger reverse animation when the audio finishes
          if (isMounted && !isReversing) {
            setShouldReverse(true);
            setIsReversing(true);
          }
        }
      }
    };

    // Play the 'escape' sound and set the listener for playback status
    playSound('escape');
    setOnPlaybackStatusUpdate('escape', onPlaybackStatusUpdate);

    return () => {
      isMounted = false;
      // Stop the 'escape' sound when the component unmounts
      stopSound('escape');
    };
  }, []);

  // Callback when reverse animation completes
  const onReverseAnimationComplete = () => {
    // Only navigate to the next chapter after reverse animation completes
    router.push('./chapterFive');
  };

  const handleSkip = () => {
    stopSound('escape');

    if (!isReversing) {
      setShouldReverse(true);
      setIsReversing(true);
    }
  };

  return (
    <View style={styles.container}>
      <BlinkingIcon
        source={require('@/assets/images/blackCircle.png')}
        shouldReverse={shouldReverse}
        startPosition={startPosition}
        endPosition={endPosition}
        startSize={startSize}
        endSize={endSize}
        onReverseAnimationComplete={onReverseAnimationComplete}
        animationDelay={0} 
      />
      <Button title="Skip" onPress={handleSkip} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
