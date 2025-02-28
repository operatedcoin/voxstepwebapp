import { Stack } from 'expo-router';
import { BackgroundAudioProvider } from '@/components/BackgroundAudioContext';
import { SoundProvider } from '@/components/SoundContext';
import { AnswerProvider } from '@/components/AnswerContext';
import { KeepAwakeProvider, KeepAwakeContext } from '@/components/KeepAwakeContext';
import { useContext } from 'react';
import KeepAwakeComponent from '@/components/KeepAwakeComponent'; // Import your custom component

export default function RootLayout() {
  return (
    <SoundProvider>
      <BackgroundAudioProvider>
        <AnswerProvider>
          <KeepAwakeProvider>
            <MainStack />
          </KeepAwakeProvider>
        </AnswerProvider>
      </BackgroundAudioProvider>
    </SoundProvider>
  );
}

function MainStack() {
  const { keepAwake } = useContext(KeepAwakeContext);

  return (
    <>
      {keepAwake && <KeepAwakeComponent />}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="mcdIntro" />
        <Stack.Screen name="aichatIntro" />
        <Stack.Screen name="aichatRealTime" />
        <Stack.Screen name="aichatDemo" />
        <Stack.Screen name="chapterOne" />
        <Stack.Screen name="chapterTwo" />
        <Stack.Screen name="chapterThree" />
        <Stack.Screen name="chapterFour" />
        <Stack.Screen name="chapterFive" />
        <Stack.Screen name="end" />
      </Stack>
    </>
  );
}
