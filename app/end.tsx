import { Text, Image, ImageBackground, View, StyleSheet } from 'react-native';

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
    <View style={styles.container}>
        <Image
          source={require('@/assets/images/voxstep_logo.png')}
          style={{ width: 240, height: 91, marginBottom: 20 }}
          />

          <View style={styles.textContainer}>
          <Text style={{color: '#C0FF91',marginBottom: 20, textAlign: 'center'}}>
            Thanks for participating in our Voxstep demo. This is a short extract from a larger performance that invites audiences to explore public spaces in their city.{'\n'}{'\n'}
            Operated Coin mixes theatre, mobile media and virtual production to make new experiences that are social and adventurous. {'\n'}{'\n'}
            If you have a venue, place, community or event and are interested in hosting short or long-form experiences, we’d love to hear from you. If this isn’t you, but you would still like to chat about our work, we’d love to hear from you too.{'\n'}{'\n'}
            You can contact Nick on nick@operatedcoin.com.
          </Text>
        </View>

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
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    maxWidth: 600,
  }
});