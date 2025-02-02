import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  //Primary
  primaryButton: {
    backgroundColor: '#C7019C',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  primaryButtonText:{
    color: '#C0FF91',
    fontSize: 16,
  },

  //Briefing Sections  
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  briefingTextContainer: {
    maxWidth: 500,
  },
  briefingText: {
    color: '#C0FF91',
    marginBottom: 20, 
    textAlign: 'center',
    fontSize: 16,
  },
  bottomLogoImage: {
    position: 'absolute',
    marginBottom: 50,
    bottom: 0,
    width: 165,
    height: 14,
    resizeMode: 'contain',
  },
  bottomText:{
    color: '#C7019C',
    textAlign: 'center',
    marginTop: 10,
  },

  //Conversation Sections
  convoContainer:{
    flex: 1,
    padding: 20,
  },
  convoTopContainer:{
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  convoBottomContainer:{
    justifyContent: 'flex-end',
  },
  convoIconImage:{
    width: 34,
    height: 34,
    marginRight: 10,
    resizeMode: 'contain',
  },
  questionText:{
    fontSize: 36,
    textAlign: 'left',
    marginBottom: 20,
    // marginTop: 60,
    lineHeight: 38,
    color:'#C0FF91',
  },
  questionButton:{
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#C7019C',
    backgroundColor: '#C0FF91',
  },
  questionSingleButton:{
    borderRadius: 10,
  },
  questionFirstButton:{
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  questionRemainingButton:{
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 0,
  },
  questionLastButton:{
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 0,
  },
  questionButtonPressed:{
    backgroundColor: '#C7019C',
  },
  questionButtonText:{
    textAlign: 'center',
    fontSize: 16,
    color: '#C7019C',
  },

  //AI Chat Styles
  messageContainer: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '80%'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  userMessage: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#e4e6eb',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  }

});

export default globalStyles;