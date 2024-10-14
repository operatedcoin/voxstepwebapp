import React from 'react';
import { Text, Image, ImageBackground, View, Pressable, Linking } from 'react-native';
import globalStyles from '@/constants/globalStylesheet';
import { useRouter } from 'expo-router';
import { useSound } from '@/components/SoundContext'; // Assuming you have the useSound hook


export default function EndScreen() {
  const router = useRouter();
  const { stopSound } = useSound(); // Get the stopSound function

  const handleGoToIndex = () => {
    // Stop all sounds (assuming you have these sounds in the app)
    stopSound('mystery'); // Stop the mystery sound
    stopSound('click');   // Stop any click sounds
    // Add more stopSound calls if you have other sounds playing in the app

    // Reset the navigation and start from the beginning
    router.replace('/'); // Use replace to reset the navigation stack
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
    <View style={globalStyles.container}>
        <Image
          source={require('@/assets/images/voxstep_logo.png')}
          style={{ width: 240, height: 91, marginBottom: 20 }}
          />

          <View style={globalStyles.briefingTextContainer}>
          <Text style={globalStyles.briefingText}>
            You've taken your first Voxstep.{'\n'}{'\n'} 
            This demo is from a larger performance that invites audiences to explore their city.{'\n'}{'\n'}
            If you're interested in hosting short or long-form experiences, or would like to know more about our work, we’d love to hear from you.{'\n'}{'\n'}
            You can contact Nick on: {''}
            <Text style={{color: '#C7019C', textDecorationLine: 'underline'}} onPress={() => Linking.openURL('mailto:nick@operatedcoin.com')}>
              nick@operatedcoin.com
            </Text>{'\n'}{'\n'}
            Operated Coin mixes theatre, mobile media and virtual production to make new experiences that are social and adventurous. {'\n'}{'\n'}
            
          </Text>
        </View>

      {/* Bottom Image anchored to the screen's bottom */}
      <Image
        source={require('@/assets/images/operatedcoinLogo.png')} 
        style={globalStyles.bottomLogoImage}
      />
        <Pressable
          onPress={handleGoToIndex}
          style={globalStyles.primaryButton} // Assuming you have a primary button style
        >
          <Text style={globalStyles.primaryButtonText}>Begin Again</Text>
        </Pressable>

        {/* Bottom Image anchored to the screen's bottom */}
        <Image
          source={require('@/assets/images/operatedcoinLogo.png')} 
          style={globalStyles.bottomLogoImage}
        />
      </View>
    </ImageBackground>
  );
}