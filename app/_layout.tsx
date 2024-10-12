import { Stack } from "expo-router";
import { BackgroundAudioProvider } from "@/components/BackgroundAudioContext";
import { SoundProvider } from "@/components/SoundContext";
import { AnswerProvider } from "@/components/AnswerContext";

export default function RootLayout() {
  return (
    <SoundProvider>
    <BackgroundAudioProvider>
    <AnswerProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="chapterOne" />
      <Stack.Screen name="chapterTwo" />
      <Stack.Screen name="chapterThree" />
      <Stack.Screen name="chapterFour" />
      <Stack.Screen name="chapterFive" />
      <Stack.Screen name="end" />
    </Stack>
    </AnswerProvider>
    </BackgroundAudioProvider>
    </SoundProvider>
  );
}
