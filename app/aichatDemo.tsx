import { Text, Pressable, ImageBackground, View, TextInput, FlatList, Modal, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import globalStyles from '@/constants/globalStylesheet';
import axios from 'axios';
import { db } from '@/firebaseConfig';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  sender: string;
  text: string;
  timestamp: number;
}

export default function AIChatDemo() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>(uuidv4());
  const apiURL = 'https://openrouter.ai/api/v1/chat/completions';
  const apiKey = 'REPLACEWITHKEY';
  
  //API Variables
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sysPrompt, setSysPrompt] = useState('Please provide responses in the voice of a Pirate.')
  const [topPValue, setTopPValue] = useState('0.99');
  const [topKValue, setTopKValue] = useState('41');
  const [tempValue, setTempValue] = useState('1.77');
  const [freqPValue, setFreqPValue] = useState('0.15');
  const [presPValue, setPresPValue] = useState('1.1');
  const [repPValue, setRepPValue] = useState('1');
  const [maxTokensValue, setMaxTokensValue] = useState('4096');

  // Function to open and close modal
  const [showModal, setShowModal] = useState(true);
  const toggleModal = () => setShowModal(!showModal);

  const sendMessage = async () => {
    if (userInput.trim() === '') return;
  
    // Clear input immediately after sending
    const currentInput = userInput;
    setUserInput('');
  
    // Create a new user message
    const newUserMessage: Message = {
      sender: 'user',
      text: currentInput,
      timestamp: Date.now()
    };
  
    // Append the new user message to the existing conversation
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
  
    try {

      // Map conversation history to API's expected format
      const conversationMessages = updatedMessages.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));
  
      // Define a system prompt message
      const systemPrompt = {
        role: 'system',
        content: sysPrompt
      };
  
      // Include the system prompt at the beginning
      const payloadMessages = [systemPrompt, ...conversationMessages];

      // Log the request payload for debugging
      console.log('Payload being sent to OpenRouter API:', {
        model: 'sophosympatheia/rogue-rose-103b-v0.2:free',
        messages: payloadMessages,
        top_p: parseFloat(topPValue),
        temperature: parseFloat(tempValue),
        frequency_penalty: parseFloat(freqPValue),
        presence_penalty: parseFloat(presPValue),
        repetition_penalty: parseFloat(repPValue),
        top_k: parseFloat(topKValue),
        max_tokens: parseFloat(maxTokensValue)
      });
  
      // Call the API
      const response = await axios.post(apiURL, {
        model: 'sophosympatheia/rogue-rose-103b-v0.2:free',
        messages: payloadMessages, 
        top_p: parseFloat(topPValue),
        temperature: parseFloat(tempValue),
        frequency_penalty: parseFloat(freqPValue),
        presence_penalty: parseFloat(presPValue),
        repetition_penalty: parseFloat(repPValue),
        top_k: parseFloat(topKValue),
        max_tokens: parseFloat(maxTokensValue)
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
        
      const botResponse = response.data.choices[0].message.content.trim();
  
      // Append the bot's response
      const newBotMessage: Message = {
        sender: 'bot',
        text: botResponse,
        timestamp: Date.now()
      };
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
  
      // Update Firestore with the complete messages array
      const chatRef = doc(db, 'darkPatternChats', sessionId);
      try {
        await setDoc(chatRef, {
          messages: [...updatedMessages, newBotMessage]
        });
        console.log('Firebase update successful');
      } catch (error) {
        console.error('Detailed Firebase Error:', JSON.stringify(error));
      }
      
    } catch (error) {
      console.error('General error in sendMessage:', error);
    }
  };
  

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[globalStyles.messageContainer, globalStyles[item.sender === 'user' ? 'userMessage' : 'botMessage']]}>
      <Text style={globalStyles.messageText}>{item.text}</Text>
    </View>
  );

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
    <View style={{flex:1, padding: 20, paddingTop: 0, width: '100%'}}>

      <FlatList
        data={[...messages].reverse()}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        inverted={true}
        contentContainerStyle={{ flexGrow: 1 }}
      />
       <View style={globalStyles.inputContainer}>
        <TextInput
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Type your message..."
          style={globalStyles.input}
        />
      <Pressable
        onPress={sendMessage}
        style={globalStyles.primaryButton}
      >
        <Text style={globalStyles.primaryButtonText}>
          Send</Text>
      </Pressable>
    
      </View>

      <View style={globalStyles.inputContainer}>
        <Pressable  onPress={() =>router.push('./aichatIntro')}>
          <Text style={globalStyles.bottomText}>Back</Text>
        </Pressable>
        <View style={{flexGrow: 1}} />
        <Pressable onPress={toggleModal}>
          <Text style={globalStyles.bottomText}>Settings</Text>
        </Pressable>
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={globalStyles.modalOverlay}>
          <View style={globalStyles.modalContent}>
            {/* All parameter inputs in the modal */}
            <Text style={globalStyles.modalTitle}>Settings</Text>

            <ScrollView contentContainerStyle={globalStyles.parameterContainer}>
              {/* System Prompt (Full width with larger height) */}
              <View style={globalStyles.fullWidthContainer}>
                <Text style={globalStyles.label}>System Prompt</Text>
                <TextInput
                  value={sysPrompt}
                  onChangeText={setSysPrompt}
                  placeholder="System Prompt"
                  multiline={true}
                  style={[{ height: 100, lineHeight: 20, marginBottom: 10, borderColor: '#ccc', borderWidth: 1, paddingHorizontal: 10, borderRadius: 5, verticalAlign: 'top' }]}
                />

              </View>

              {/* Two columns for the rest of the parameters */}
              <View style={globalStyles.row}>
                <View style={globalStyles.column}>
                  <Text style={globalStyles.label}>Temperature</Text>
                  <TextInput
                    value={tempValue}
                    onChangeText={setTempValue}
                    placeholder="Temperature"
                    style={globalStyles.input}
                  />
                  <Text style={globalStyles.label}>Top P</Text>
                  <TextInput
                    value={topPValue}
                    onChangeText={setTopPValue}
                    placeholder="Top P"
                    style={globalStyles.input}
                  />
                  <Text style={globalStyles.label}>Top K</Text>
                  <TextInput
                    value={topKValue}
                    onChangeText={setTopKValue}
                    placeholder="Top K"
                    style={globalStyles.input}
                  />
                </View>

                <View style={globalStyles.column}>
                  <Text style={globalStyles.label}>Frequency Penalty</Text>
                  <TextInput
                    value={freqPValue}
                    onChangeText={setFreqPValue}
                    placeholder="Frequency Penalty"
                    style={globalStyles.input}
                  />
                  <Text style={globalStyles.label}>Repetition Penalty</Text>
                  <TextInput
                    value={repPValue}
                    onChangeText={setRepPValue}
                    placeholder="Repetition Penalty"
                    style={globalStyles.input}
                  />
                  <Text style={globalStyles.label}>Presence Penalty</Text>
                  <TextInput
                    value={presPValue}
                    onChangeText={setPresPValue}
                    placeholder="Presence Penalty"
                    style={globalStyles.input}
                  />
                  <Text style={globalStyles.label}>Max Tokens</Text>
                  <TextInput
                    value={maxTokensValue}
                    onChangeText={setMaxTokensValue}
                    placeholder="Max Tokens"
                    style={globalStyles.input}
                  />
                </View>
              </View>
            </ScrollView>

            {/* Close Button */}
            <Pressable onPress={toggleModal} style={globalStyles.closeButton}>
              <Text style={globalStyles.bottomText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      </View>
    </ImageBackground>
  );
}
