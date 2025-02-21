import { Text, Pressable, ImageBackground, View, TextInput, FlatList, } from 'react-native';
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
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>(uuidv4());
  const apiURL = 'https://openrouter.ai/api/v1/chat/completions';
  const apiKey = 'REPLACEWITHKEY';

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
        content: 'Please provide responses in the voice of a Pirate.'
      };
  
      // Include the system prompt at the beginning
      const payloadMessages = [systemPrompt, ...conversationMessages];
  
      // Call the API
      const response = await axios.post(apiURL, {
        model: 'sophosympatheia/rogue-rose-103b-v0.2:free',
        messages: payloadMessages, 
        top_p: 0.99,
        temperature: 1.77,
        frequency_penalty: 0.15,
        presence_penalty: 1.1,
        repetition_penalty: 1,
        top_k: 41,
        max_tokens: 200 
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
        await updateDoc(chatRef, {
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
      </View>
    </ImageBackground>
  );
}
