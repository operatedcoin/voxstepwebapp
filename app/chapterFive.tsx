// ChapterFive.tsx
import React, { useState, useEffect, useContext } from 'react';
import {View, Text, StyleSheet, Animated, ImageSourcePropType, ImageBackground, Pressable} from 'react-native';
import { useRouter } from 'expo-router';
import { useSound } from '@/components/SoundContext';
import globalStyles from '@/constants/globalStylesheet';
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
      style={[globalStyles.convoIconImage, { opacity }, {
        transform: [
          { translateX: 1 },
          { translateY: 4 },
        ],
      },]}
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
          // Show button instead of immediately continuing
          setStage(2);
        }, 1000);
        return () => clearTimeout(timer);
      } else if (stage === 3) {
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

  const handleButtonPress = () => {
    setDisplayedText(''); // Clear the displayed text
    setTextToDisplay('But to get away, we first need to get lost.');
    setTypingIndex(0);
    setStage(3);
  };

  return (
    <ImageBackground
      source={require('@/assets/images/voxstep_bg_gradient.png')}
      resizeMode='stretch'
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
      }}
    >
      <View style={globalStyles.convoContainer}>
        <View style={globalStyles.convoTopContainer}>
          <Text style={globalStyles.questionText}>
            <BlinkingIcon source={require('@/assets/images/entity.png')} />
            {displayedText}
          </Text>
        </View>
        {stage === 2 && (
          <View style={globalStyles.convoBottomContainer}>
            <Pressable
              onPress={handleButtonPress}
              style={({ pressed }) => [
                globalStyles.questionButton, globalStyles.questionSingleButton,
                pressed && globalStyles.questionButtonPressed,
              ]}
            >
              <Text style={globalStyles.questionButtonText}>Um, okay</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}