import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { useBackgroundAudio } from './BackgroundAudioContext';
import { useSound } from './SoundContext';

const { width } = Dimensions.get('window');

interface DeviceData {
  dancingBearTimer: number;
  dancingBearText: string;
  dancingBearButton: string;
}

interface DancingBearChatProps {
  deviceData: DeviceData;
  onClose: () => void;
  showHeader?: boolean;
}

const DancingBearChat: React.FC<DancingBearChatProps> = ({
  deviceData,
  onClose,
  showHeader = true,
}) => {
  const { pauseBackgroundAudio, resumeBackgroundAudio } = useBackgroundAudio();
  const { playSound, stopSound } = useSound();
  const [showChat, setShowChat] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const chatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

 // Ref for ScrollView (specify the type as ScrollView)
 const scrollViewRef = useRef<ScrollView>(null);

 // Effect for scrolling to the end whenever the typedText updates
 useEffect(() => {
   if (scrollViewRef.current) {
     scrollViewRef.current.scrollToEnd({ animated: true });
   }
 }, [typedText]);

  useEffect(() => {
    if (!showChat) {
      clearChatTimer();
      if (deviceData.dancingBearTimer > 0) {
        const timer = setTimeout(() => {
          setShowChat(true);
          playAudio();
          pauseBackgroundAudio();
        }, deviceData.dancingBearTimer);
        chatTimerRef.current = timer;
      } else {
        setShowChat(true);
        playAudio();
        pauseBackgroundAudio();
      }
    }

    return () => {
      clearChatTimer();
    };
  }, [deviceData.dancingBearTimer, showChat, pauseBackgroundAudio]);

  useEffect(() => {
    return () => {
      resumeBackgroundAudio();
    };
  }, [resumeBackgroundAudio]);

  useEffect(() => {
    if (showChat) {
      typingIntervalRef.current = setInterval(() => {
        if (typingIndex < deviceData.dancingBearText.length) {
          setTypedText(
            deviceData.dancingBearText.slice(0, typingIndex + 1) + '▎'
          );
          setTypingIndex((prevIndex) => prevIndex + 1);
        } else {
          clearTypingInterval();
        }
      }, 50);
    }

    return () => {
      clearTypingInterval();
    };
  }, [showChat, deviceData.dancingBearText, typingIndex]);

  const playAudio = async () => {
    try {
      await playSound('dancingBearAudio');
    } catch (error) {
      console.log('Error playing audio:', error);
    }
  };

  const handleCloseChat = async () => {
    setShowChat(false);
    setTypingIndex(0);
    setTypedText('');
    await stopSound('dancingBearAudio');
    onClose();
    resumeBackgroundAudio();
  };

  const clearChatTimer = () => {
    if (chatTimerRef.current) {
      clearTimeout(chatTimerRef.current);
      chatTimerRef.current = null;
    }
  };

  const clearTypingInterval = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  };

  const generateStarsLine = () => {
    const stars = '*'.repeat(Math.floor(width / 10));
    return stars;
  };

  return showChat ? (
    <View style={styles.chatOverlay}>
      <View style={styles.chatContainer}>
        {showHeader && (
          <View style={styles.topContainer}>
            <Image
              source={require('../assets/images/dancingBearLogo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.starsLine}>{generateStarsLine()}</Text>
          </View>
        )}
      <ScrollView 
          style={styles.chatTextContainer} 
          ref={scrollViewRef} // Attach ref to the ScrollView
        >
          <Text style={styles.chatText}>DB: {typedText}</Text>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <Text style={styles.starsLine}>{generateStarsLine()}</Text>
          <TouchableOpacity style={styles.button} onPress={handleCloseChat}>
            <Text style={styles.buttonText}>{deviceData.dancingBearButton}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ) : null;
};



const styles = StyleSheet.create({
    chatOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgb(0, 0, 0)',
      zIndex: 1,
    },
    chatContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingHorizontal: 10,
      paddingBottom: 10,
      paddingTop: 0,
    },
    chatTextContainer: {
      flex: 1, // Allow the text area to take up available space
      marginBottom: 20,
    },
    topContainer: {marginBottom:30,},
    bottomContainer: {
      marginTop: 'auto',
    },
    logoImage: {
      width: '100%',
      height: '100%',
      aspectRatio: 4,
      marginBottom: 0,
      tintColor: '#24FF00',
    },
    starsLine: {
      fontSize: 16,
      color: '#24FF00',
      letterSpacing: -0.008,
      fontFamily: 'courier',
    },
    chatText: {
      fontSize: 16,
      marginBottom: 20,
      color: '#24FF00',
      fontFamily: 'courier',
    },
    button: {
      padding: 30,
      borderColor: '#24FF00',
      borderWidth: 1,
    },
    buttonText: {
      color: '#24FF00',
      fontWeight: 'bold',
      textAlign: 'center',
      fontFamily: 'courier',
    },
  });
  
  export default DancingBearChat;