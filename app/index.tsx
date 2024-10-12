import { Text, Image, Pressable, ImageBackground, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSound } from '@/components/SoundContext';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';


export default function Index() {
  const router = useRouter();
  const { preloadSounds } = useSound();

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

    <Image
      source={require('@/assets/images/voxstep_logo.png')}
      style={{ width: 240, height: 91, marginBottom: 20 }}
      />



    <Text
      style={{color: '#C0FF91',marginBottom: 20, textAlign: 'center'}}>
      Hi, welcome to Voxstep.{'\n'}
      This is a demo experience that lasts about 3–5 minutes.{'\n'}
      We recommend you try this demo when you're in a public place or surrounded by other people.{'\n'}
    </Text>
    <Pressable
        onPress={handleBeginButtonPress}
        style={{
          backgroundColor: '#C7019C',
          paddingVertical: 12,
          paddingHorizontal: 50,
          borderRadius: 25,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: '#C0FF91',
            fontSize: 16,
          }}
        >
          Let's begin</Text>
      </Pressable>

      {/* Bottom Image anchored to the screen's bottom */}
      <Image
        source={require('@/assets/images/operatedcoinLogo.png')} 
        style={{
          position: 'absolute',
          marginBottom: 50,
          bottom: 0, 
          width: 165,
          height: 14,
          resizeMode: 'contain', 
        }}
      />
    </ImageBackground>
  );
}