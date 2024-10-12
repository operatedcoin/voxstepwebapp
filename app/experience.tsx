import { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';
import DancingBearChat from '@/components/DancingBearChat';

export default function ExperienceScreen() {
  const video = useRef<Video>(null);  // Properly typing the video ref
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [videoPausedAt, setVideoPausedAt] = useState(0);
  const router = useRouter(); // Using the router to navigate to './end'
  const chatData = [
    {
      dancingBearTimer: 200,
      dancingBearText: `SAFE is testing you. They’re going to ask you to report a target.\n\nThese targets are innocent.\n\nThey’ve got problems, but they’re innocent.\n\nWe are the ones that triggered the operation.\n\nWe are the ones that brought you here. And we have a choice for you.\n\nReport ‘Sleeping Pills’ and your application will be approved.\n\nReport ‘Sleeping Pills’ and become our insider.\n\nReport any other target your application will be rejected and we will leave you be.\n\nWe don’t judge. We know it’s not for everyone.\n\nWe hope to see you on the other side.`,
      dancingBearButton: 'Continue',
      showHeader: true,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (video.current) {
        const status = await video.current.getStatusAsync();
        if (status && status.isLoaded) {
          setVideoPausedAt(status.positionMillis);
          await video.current.pauseAsync();
          setIsChatVisible(true);
        }
      }
    }, 26400);

    return () => clearTimeout(timer);
  }, []);

  const handleChatClose = async () => {
    if (video.current) {
      await video.current.setPositionAsync(videoPausedAt);
      await video.current.playAsync();
    }
    setIsChatVisible(false);
  };

    // Function to handle video playback status updates
    const handleVideoStatusUpdate = (status: any) => {
      if (status.didJustFinish) {
        // Navigate to './end' when the video finishes
        router.push('./end');
      }
    };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#C6C9BA',
      }}
    >
      <Video
        ref={video}
        source={require('../assets/video/6_MsgBank_scene_meditationv4.mp4')}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        videoStyle={{width: '100%', height: '100%'}}
        style={{ width: '100%', height: '100%' }}
        onPlaybackStatusUpdate={handleVideoStatusUpdate} // Callback for video status updates
      />

      {isChatVisible && (
        <DancingBearChat
          deviceData={chatData[0]}
          onClose={handleChatClose} // This is called when the chat is closed
        />
      )}
    </View>
  );
}