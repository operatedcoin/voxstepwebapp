import { Text, Image, Pressable, ImageBackground, Platform, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useContext } from 'react';
import { KeepAwakeContext } from '@/components/KeepAwakeContext';
import globalStyles from '@/constants/globalStylesheet';
import ReactGA from 'react-ga4';


export default function AIChatIntro() {
  const router = useRouter();
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
    //setKeepAwake(true); 
    router.push('./aichatDemo');
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
      A demo interaction with an AI Chat Bot{'\n'}{'\n'}
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