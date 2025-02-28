import { Text, ImageBackground, Platform, View, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import globalStyles from '@/constants/globalStylesheet';
import ReactGA from 'react-ga4';
import { getFirestore, collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';

// Define the message type
interface Message {
    sender: 'user' | 'bot';
    text: string;
  }

export default function AIChatRealTime() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const db = getFirestore();

  useEffect(() => {
    if (Platform.OS === 'web') {
      ReactGA.initialize('G-RSYG02G559');
      ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });
    }
  }, []);

  useEffect(() => {
    const collectionRef = collection(db, 'darkPatternChats');
    console.log('Listening for updates in collection: darkPatternChats');

    // Listen for real-time updates on all documents in the collection
    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        console.log('Received snapshot from Firestore');
        console.log('Total documents found:', querySnapshot.size);

        if (querySnapshot.empty) {
          console.log('No chat documents found!');
          setMessages([]); // Clear messages if no documents exist
          return;
        }

        let allUserMessages: Message[] = [];

        querySnapshot.forEach((docSnap) => {
          console.log(`Processing document: ${docSnap.id}`, docSnap.data());

          const data = docSnap.data();
          if (!data || !data.messages) {
            console.log(`Document ${docSnap.id} has no 'messages' field`);
            return;
          }

          const newMessages: Message[] = data.messages as Message[];
          const userMessages = newMessages.filter((msg) => msg.sender === 'user');
          console.log(`User messages in ${docSnap.id}:`, userMessages);

          allUserMessages = [...allUserMessages, ...userMessages];
        });

        console.log('Final list of user messages:', allUserMessages);
        setMessages(allUserMessages);
      },
      (error: Error) => {
        console.error('Firestore onSnapshot error:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  

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


  <View style={globalStyles.briefingTextContainer}>
  <FlatList
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 10 }}>
                <Text>{item.text}</Text>
              </View>
            )}
          />
      </View>

      {/* Close Button */}
      <Pressable style={globalStyles.bottomLogoImage} onPress={() =>router.push('./aichatIntro')}>
              <Text style={globalStyles.bottomText}>Back</Text>
            </Pressable>
      </View>
    </ImageBackground>
  );
}