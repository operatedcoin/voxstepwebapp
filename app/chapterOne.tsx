import React, { useEffect } from 'react';
import { Text, Image, Pressable, ImageBackground, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSound } from '@/components/SoundContext';
import globalStyles from '@/constants/globalStylesheet';

export default function chapterOne() {
  const router = useRouter();
  const { playSound, stopSound } = useSound();

  useEffect(() => {
    playSound('samba');
  }, []);

  const handleBeginButtonPress = async () => {
    stopSound('samba');
    router.push('./chapterTwo');
  };

  return (
    <ImageBackground
      source={require('@/assets/images/voxstep_bg_gradient.png')}
      resizeMode='stretch'
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >

    <View style={globalStyles.container}>
    <Image
      source={require('@/assets/images/volumeIcon.png')}
      style={{width: 121, height: 91, marginBottom: 20 }}
    />

    <View style={globalStyles.briefingTextContainer}>
    <Text
      style={globalStyles.briefingText}>
      This experience uses audio, so we recommend using headphones if you have them. {'\n'}{'\n'}
      Now’s your chance to turn your volume on or up. If you can hear the music, click the button below.{'\n'}{'\n'}
      We recommend you try this demo when you're in a public place or surrounded by other people.
    </Text>
    <Pressable
        onPress={handleBeginButtonPress}
        style={globalStyles.primaryButton}
      >
        <Text style={globalStyles.primaryButtonText}>
          I can hear the music</Text>
      </Pressable>
      </View>

      {/* Bottom Image anchored to the screen's bottom */}
      <Image
        source={require('@/assets/images/operatedcoinLogo.png')}
        style={globalStyles.bottomLogoImage}
      />
      </View>

    </ImageBackground>
  );
}