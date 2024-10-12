// ChapterFive.tsx
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ImageSourcePropType,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSound } from '@/components/SoundContext';
import { AnswerContext } from '@/components/AnswerContext';

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

export default function ChapterFive() {
  const router = useRouter();
  const { playSound, stopSound } = useSound();
  const { selectedAnswers } = useContext(AnswerContext);

  useEffect(() => {
    playSound('mystery');
  }, []);

  // Mapping of answer codes to text fragments
  const answerCodeToText: { [key: string]: string } = {
    // Question 1
    '1a': 'is not very good with maps',
    '1b': 'is not very good with maps',
    '1c': 'can handle a map',
    '1d': 'can handle a map',
    '1e': 'doesn’t want to talk about maps',
    // Question 2
    '2a': 'has comfortable shoes',
    '2b': 'has uncomfortable shoes',
    '2c': 'isn’t wearing shoes because no one told them they should',
    '2d': 'doesn’t want to talk about shoes',
    // Question 3
    '3a': 'and hasn’t had a major run in with the law',
    '3b': 'and may have had a minor run-in with the law',
    '3c': "and has had a run in with the law but doesn’t want to talk about it",
    '3d': "and has had a run in with the law and wants to talk about it",
    '3e': 'and is skeptical of sharing any info with a stranger',
  };

  // Build the dynamic text
  const baseTextStart = "I've been looking for someone that ";
  const baseTextEnd = " I've finally found you and I need your help.";

  const textFragments = selectedAnswers
    .slice(0, 3)
    .map((code) => answerCodeToText[code]);

  const middleText = textFragments.join(', ');

  const initialText = `${baseTextStart}${middleText}.${baseTextEnd}`;

  // State variables
  const [stage, setStage] = useState(1);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [typingIndex, setTypingIndex] = useState<number>(0);
  const [textToDisplay, setTextToDisplay] = useState<string>(initialText);

  useEffect(() => {
    if (typingIndex < textToDisplay.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + textToDisplay[typingIndex]);
        setTypingIndex(typingIndex + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      // Typing is complete
      if (stage === 1) {
        // Initial text typed completely
        const timer = setTimeout(() => {
          // After 6 seconds, proceed to next stage
          setDisplayedText(''); // Clear the displayed text
          setTextToDisplay('But to get away, we first need to get lost.');
          setTypingIndex(0);
          setStage(2);
        }, 5000);
        return () => clearTimeout(timer);
      } else if (stage === 2) {
        // Final line typed completely
        const timer = setTimeout(() => {
          // After 5 seconds, navigate to './end'
          stopSound('mystery');
          router.push('./end');
        }, 4000);
        return () => clearTimeout(timer);
      }
    }
  }, [typingIndex, textToDisplay, stage]);

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
