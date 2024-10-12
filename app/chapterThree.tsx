import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  ImageSourcePropType,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSound } from '@/components/SoundContext';
import { AnswerContext
  
 } from '@/components/AnswerContext';
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

export default function ChapterThree() {
  const router = useRouter();
  const { playSound, fadeOutSound } = useSound(); 
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

  useEffect(() => {
    if (typingIndex < questions[currentQuestionIndex].question.length) {
      const delay = typingIndex === 0 ? 2000 : 50; // Delay first letter by 2000ms, others by 50ms
      const timeout = setTimeout(() => {
        setDisplayedText(
          (prev) => prev + questions[currentQuestionIndex].question[typingIndex]
        );
        setTypingIndex(typingIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      // Once typing is complete
      const pauseTimeout = setTimeout(() => {
        setIsTypingComplete(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
        if (currentQuestionIndex === questions.length - 1) {
          setTimeout(() => {
            fadeOutSound('mystery', 2000);
            router.push('./chapterFour');
          }, 3000);
        }
      }, 1000);
      return () => clearTimeout(pauseTimeout);
    }
  }, [typingIndex, currentQuestionIndex, fadeAnim]);

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
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.questionText}>
          <BlinkingIcon source={require('@/assets/images/blackCircle.png')} />
          {displayedText}
        </Text>
      </View>
      {isTypingComplete &&
        !hideAnswers &&
        questions[currentQuestionIndex].answers.length > 0 && (
          <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim }]}>
            {questions[currentQuestionIndex].answers.map((answer, index) => (
              <Animated.View key={index} style={{ opacity: buttonsFadeAnim[index] }}>
                <Pressable
                  onPress={() => handleAnswerPress(answer, index)}
                  style={({ pressed }) => [
                    styles.button,
                    index === 0 && styles.firstButton,
                    index > 0 &&
                      index < questions[currentQuestionIndex].answers.length - 1 &&
                      styles.remainingButton,
                    index === questions[currentQuestionIndex].answers.length - 1 &&
                      styles.lastButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.buttonText}>{answer}</Text>
                </Pressable>
              </Animated.View>
            ))}
          </Animated.View>
        )}
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
   bottomContainer: {
     justifyContent: 'flex-end',
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
   button: {
     width: '100%',
     paddingVertical: 15,
     paddingHorizontal: 20,
     borderWidth: 1,
     borderColor: '#000',
   },
   firstButton: {
     borderTopLeftRadius: 10,
     borderTopRightRadius: 10,
   },
   remainingButton: {
     borderLeftWidth: 1,
     borderRightWidth: 1,
     borderBottomWidth: 1,
     borderTopWidth: 0,
   },
   lastButton: {
     borderBottomLeftRadius: 10,
     borderBottomRightRadius: 10,
     borderLeftWidth: 1,
     borderRightWidth: 1,
     borderBottomWidth: 1,
     borderTopWidth: 0,
   },
   buttonPressed: {
     backgroundColor: '#ddd',
   },
   buttonText: {
     textAlign: 'center',
     fontSize: 18,
   },
 });