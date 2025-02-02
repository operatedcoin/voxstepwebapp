import { Text, Image, Pressable, ImageBackground, Platform, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSound } from '@/components/SoundContext';
import { useEffect, useContext } from 'react';
import { KeepAwakeContext } from '@/components/KeepAwakeContext';
import globalStyles from '@/constants/globalStylesheet';
import ReactGA from 'react-ga4';


export default function MCDIntro() {
  const router = useRouter();
  const { preloadSounds } = useSound();
  const { setKeepAwake } = useContext(KeepAwakeContext);

  useEffect(() => {
    if (Platform.OS === 'web') {
      ReactGA.initialize('G-RSYG02G559'); // Ensure this is your actual Measurement ID
      ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });
    }
  }, []);

  const handleBeginButtonPress = async () => {
    if (Platform.OS === 'web') {
      ReactGA.event({
        category: 'Navigation',
        action: 'Clicked Begin Button',
      });
    }

    await preloadSounds(); // Preload and unlock audio context
    setKeepAwake(true); 
    router.push('./chapterOne');
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
      source={require('@/assets/images/voxstep_logo.png')}
      style={{ width: 240, height: 91, marginBottom: 20 }}
      />


  <View style={globalStyles.briefingTextContainer}>
    <Text
      style={globalStyles.briefingText}>
      A short performance. A quick escape.{'\n'}{'\n'}
     Run Time: 3 - 5 minutes.{'\n'}{'\n'}
      We recommend trying this demo when you're in a public place or surrounded by other people.{'\n'}
    </Text>
    <Pressable
        onPress={handleBeginButtonPress}
        style={globalStyles.primaryButton}
      >
        <Text style={globalStyles.primaryButtonText}>
          Continue</Text>
      </Pressable>
      <Pressable
        onPress={() =>router.push('./')}>
        <Text
        style={globalStyles.bottomText}>Back</Text>
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