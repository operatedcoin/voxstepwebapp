import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ImageSourcePropType,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSound } from '@/components/SoundContext';

// BlinkingIcon Component
function BlinkingIcon({ source }: { source: ImageSourcePropType }) {
  const [opacity] = useState(new Animated.Value(1));

  useEffect(() => {
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

    opacityAnimation.start();

    return () => {
      opacityAnimation.stop();
    };
  }, [opacity]);

  return (
    <Animated.Image
      source={source}
      style={[styles.circleImage, { opacity }]}
    />
  );
}

export default function chapterFive() {
  const router = useRouter();
  const { playSound, stopSound } = useSound();

  useEffect(() => {
    playSound('mystery');
  }, []);

  // Define the text to display
  const textToDisplay =
    "I've been looking forward to someone that is XXXXXXXXX. And finally I've found you. To get away, we first need to get lost...";

  // State variables
  const [displayedText, setDisplayedText] = useState<string>('');
  const [typingIndex, setTypingIndex] = useState<number>(0);

  useEffect(() => {
    if (typingIndex < textToDisplay.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + textToDisplay[typingIndex]);
        setTypingIndex(typingIndex + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      const timer = setTimeout(() => {
        stopSound('mystery');
        router.push('./end');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [typingIndex]);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.questionText}>
          <BlinkingIcon source={require('@/assets/images/blackCircle.png')} />
          {displayedText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  topContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  questionText: {
    fontSize: 48,
    textAlign: 'left',
    marginBottom: 20,
    lineHeight: 48,
  },
  circleImage: {
    width: 34,
    height: 34,
    marginRight: 10,
    resizeMode: 'contain',
  },
});
