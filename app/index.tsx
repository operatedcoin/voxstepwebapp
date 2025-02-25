import { Text, Image, Pressable, ImageBackground, View } from 'react-native';
import { useRouter } from 'expo-router';
import globalStyles from '@/constants/globalStylesheet';

export default function Index() {
  const router = useRouter();

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
      Select from the following demos{'\n'}{'\n'}
    </Text>
    <Pressable
        onPress={() =>router.push('./mcdIntro')}
        style={globalStyles.primaryButton}
      >
        <Text style={globalStyles.primaryButtonText}>
          Multiple Choice Demo</Text>
      </Pressable>
      <Pressable
        onPress={() =>router.push('./aichatIntro')}
        style={globalStyles.primaryButton}
      >
        <Text style={globalStyles.primaryButtonText}>
          AI Chat Demo</Text>
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