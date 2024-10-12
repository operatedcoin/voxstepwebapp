import { Text, Image, Pressable, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useSound } from '@/components/SoundContext';

export default function Index() {
  const router = useRouter();
  const { preloadSounds } = useSound();

  const handleBeginButtonPress = async () => {
    await preloadSounds(); // Preload and unlock audio context - files are listed in the SoundContext component
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