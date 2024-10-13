import { Text, Image, ImageBackground, View, Linking } from 'react-native';
import globalStyles from '@/constants/globalStylesheet';

export default function EndScreen() {
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
            Thanks for participating in our Voxstep demo. This is a short extract from a larger performance that invites audiences to explore public spaces in their city.{'\n'}{'\n'}
            Operated Coin mixes theatre, mobile media and virtual production to make new experiences that are social and adventurous. {'\n'}{'\n'}
            If you have a venue, place, community or event and are interested in hosting short or long-form experiences, we’d love to hear from you. If this isn’t you, but you would still like to chat about our work, we’d love to hear from you too.{'\n'}{'\n'}
            You can contact Nick on {''}
            <Text style={{color: '#C7019C', textDecorationLine: 'underline'}} onPress={() => Linking.openURL('mailto:nick@operatedcoin.com')}>
              nick@operatedcoin.com
            </Text>.
          </Text>
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