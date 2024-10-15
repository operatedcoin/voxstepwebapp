import React, { useState, useEffect, useContext } from 'react';
import {View, Text, Pressable, Dimensions, Animated, ImageSourcePropType, ImageBackground} from 'react-native';
import { useRouter } from 'expo-router';
import { useSound } from '@/components/SoundContext';
import globalStyles from '@/constants/globalStylesheet';
import { AnswerContext} from '@/components/AnswerContext';
interface Question {
  question: string;
  answers: string[];
}

// BlinkingIcon Component
function BlinkingIcon({ source }: { source: ImageSourcePropType }) {
  const [opacity] = useState(new Animated.Value(1));

  useEffect(() => {
    const opacityAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
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

export default function ChapterThree() {
  const router = useRouter();
  const { playSound, fadeOutSound, stopSound } = useSound(); 
  const { selectedAnswers, setSelectedAnswers } = useContext(AnswerContext);

  useEffect(() => {
    playSound('mystery');
  }, []);

  const questions: Question[] = [
    {
      question: 'Are you good with maps?',
      answers: [
        'No way. I’m a mess',
        'Not really',
        'Um. Yeah?',
        'Of course, I am. I have an incredible sense of direction',
        'I prefer not to disclose sensitive material about myself',
      ],
    },
    {
      question: 'What kind of shoes are you wearing?',
      answers: [
        'Comfortable',
        'Uncomfortable',
        'I’m not wearing shoes. No one said I had to wear shoes',
        'I prefer not to disclose sensitive material about myself',
      ],
    },
    {
      question: 'Have you ever had a run in with law enforcement?',
      answers: [
        'Never',
        'Maybe. But it was nothing, really',
        'Major. Let’s not talk about it',
        'Major. And I would like to talk about it',
        'Why would I tell you about that?',
      ],
    },
    {
      question: 'Are you sure?',
      answers: ['Yes', 'No'],
    },
    {
      question: 'Perfect.',
      answers: [],
    },
  ];

  // State and animation variables
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [typingIndex, setTypingIndex] = useState<number>(0);
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [hideAnswers, setHideAnswers] = useState<boolean>(false);
  const [buttonsFadeAnim, setButtonsFadeAnim] = useState<Animated.Value[]>([]);

  useEffect(() => {
    setDisplayedText('');
    setTypingIndex(0);
    setIsTypingComplete(false);
    fadeAnim.setValue(0);
    setButtonsFadeAnim(
      questions[currentQuestionIndex].answers.map(() => new Animated.Value(0))
    );
  }, [currentQuestionIndex]);

  // Efficient sound control
useEffect(() => {
  if (typingIndex < questions[currentQuestionIndex].question.length) {
    const delay = typingIndex === 0 ? 2000 : 50;  // Delay first letter by 2000ms, others by 50ms
    const timeout = setTimeout(() => {
      // Start the 'click' sound when the first letter appears
      if (typingIndex === 0) {
        playSound('click');  // Start the 'click' sound in a loop at the beginning of typing
      }
      setDisplayedText(
        (prev) => prev + questions[currentQuestionIndex].question[typingIndex]
      );
      setTypingIndex(typingIndex + 1);
    }, delay);
    return () => clearTimeout(timeout);
  } else {
    // Stop the 'click' sound once the text has finished typing
    stopSound('click');

    // Once typing is complete, start fade-in animation
    const pauseTimeout = setTimeout(() => {
      setIsTypingComplete(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      if (currentQuestionIndex === questions.length - 1) {
        setTimeout(() => {
          fadeOutSound('mystery', 2000); // Fade out mystery sound
          router.push('./chapterFour');
        }, 3000);
      }
    }, 1000);
    return () => clearTimeout(pauseTimeout);
  }
}, [typingIndex, currentQuestionIndex, fadeAnim, playSound, stopSound]);


  useEffect(() => {
    if (isTypingComplete && buttonsFadeAnim.length > 0) {
      const randomizedIndexes = buttonsFadeAnim
        .map((_, index) => index)
        .sort(() => Math.random() - 0.5);

      randomizedIndexes.forEach((index, i) => {
        setTimeout(() => {
          Animated.timing(buttonsFadeAnim[index], {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, i * 1000); // Delay between buttons appearing
      });
    }
  }, [isTypingComplete, buttonsFadeAnim]);

  // Function to convert index to letter
  const indexToLetter = (index: number) => String.fromCharCode(97 + index); // 0 => 'a', 1 => 'b', etc.

  // Function to handle answer selection
  const handleAnswerPress = (answer: string, answerIndex: number) => {
    const questionNumber = currentQuestionIndex + 1;
    const answerCode = `${questionNumber}${indexToLetter(answerIndex)}`;

    // Save the selected answer code
    setSelectedAnswers((prevAnswers) => [...prevAnswers, answerCode]);

    // Move to the next question or navigate to the next screen
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
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
      {isTypingComplete &&
        !hideAnswers &&
        questions[currentQuestionIndex].answers.length > 0 && (
          <Animated.View style={[globalStyles.convoBottomContainer, { opacity: fadeAnim }]}>
            {questions[currentQuestionIndex].answers.map((answer, index) => (
              <Animated.View key={index} style={{ opacity: buttonsFadeAnim[index] }}>
                <Pressable
                  onPress={() => handleAnswerPress(answer, index)}
                  style={({ pressed }) => [
                    globalStyles.questionButton,
                    index === 0 && globalStyles.questionFirstButton,
                    index > 0 &&
                      index < questions[currentQuestionIndex].answers.length - 1 &&
                      globalStyles.questionRemainingButton,
                    index === questions[currentQuestionIndex].answers.length - 1 &&
                      globalStyles.questionLastButton,
                    pressed && globalStyles.questionButtonPressed,
                  ]}
                >
                  <Text style={globalStyles.questionButtonText}>{answer}</Text>
                </Pressable>
              </Animated.View>
            ))}
          </Animated.View>
        )}
    </View>
    </ImageBackground>
  );
}