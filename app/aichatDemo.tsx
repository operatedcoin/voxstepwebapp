import { Text, Image, Pressable, ImageBackground, View, TextInput, FlatList, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import globalStyles from '@/constants/globalStylesheet';
import axios from 'axios';

interface Message {
  sender: string;
  text: string;
}

export default function AIChatDemo() {
  const router = useRouter();
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const apiURL = 'https://openrouter.ai/api/v1/chat/completions';
  const apiKey = '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';

  const sendMessage = async () => {
    if (userInput.trim() === '') return;
  
    // Clear input immediately after sending
    const currentInput = userInput;
    setUserInput('');  
  
    // Create a new user message
    const newUserMessage = { sender: 'user', text: currentInput };
  
    // Append the new user message to the existing conversation
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
  
    try {
      // Map your conversation history to the API's expected format.
      // Convert 'user' to 'user' and 'bot' to 'assistant'.
      const conversationMessages = updatedMessages.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));
  
      // Define a system prompt message to guide the AI's responses.
      const systemPrompt = {
        role: 'system',
        content: 'Please provide responses in the voice of a Pirate.'
      };
  
      // Include the system prompt at the beginning of your payload messages.
      const payloadMessages = [systemPrompt, ...conversationMessages];
  
      // Call the API with the updated payload structure
      const response = await axios.post(apiURL, {
        model: 'sophosympatheia/rogue-rose-103b-v0.2:free',
        messages: payloadMessages, 
        top_p: 0.99,
        temperature: 1.77,
        frequency_penalty: 0.15,
        presence_penalty: 1.1,
        repetition_penalty: 1,
        top_k: 41,
        max_tokens: 200 // length of responses.
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
  
      const botResponse = response.data.choices[0].message.content.trim();
  
      // Append the assistant's response to your message list
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: botResponse }]);
    } catch (error) {
      console.error('Error sending message:', error);
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