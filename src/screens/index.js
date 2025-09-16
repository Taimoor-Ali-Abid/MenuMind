import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { wp, hp } from '../constant';

const Chat = ({ navigation, route }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your restaurant AI assistant. I can help you with menu items, recommendations, and answer any questions about our food. What would you like to know?",
      isUser: false,
      timestamp: '10:52',
      avatar: require('../assets/images/Profilepic.png'),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const insets = useSafeAreaInsets();

  // Get restaurant_id from navigation params
  const restaurantId = route?.params?.restaurantId;

  // Send message function
  const sendMessage = async () => {
    if (!inputText.trim() || !restaurantId) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      avatar: require('../assets/images/Profilepic.png'),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      const response = await fetch(
        'https://mm.workbrink.com/api/public/chatBot',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            messages: [{ role: 'user', content: inputText.trim() }],
          }),
        },
      );

      const json = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        text: json.reply,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        avatar: require('../assets/images/Profilepic.png'),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        avatar: require('../assets/images/Profilepic.png'),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const renderMessage = message => (
    <View key={message.id} style={styles.messageContainer}>
      {!message.isUser && (
        <Image
          source={message.avatar}
          style={[styles.avatar, { marginRight: wp(3) }]}
        />
      )}
      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userMessage : styles.aiMessage,
        ]}
      >
        <View style={styles.messageContent}>
          <Text
            style={[
              styles.messageText,
              message.isUser ? styles.userMessageText : styles.aiMessageText,
            ]}
          >
            {message.text}
          </Text>
          {message.timestamp && (
            <Text style={styles.timestamp}>{message.timestamp}</Text>
          )}
        </View>
      </View>
      {message.isUser && (
        <Image
          source={message.avatar}
          style={[styles.avatar2, { marginLeft: wp(3) }]}
        />
      )}
      {!message.isUser && (
        <View style={styles.messageActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Image
              source={require('../assets/images/copy.png')}
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Image
              source={require('../assets/images/Like.png')}
              style={styles.actionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Image
              source={require('../assets/images/Dislike.png')}
              style={styles.actionIcon}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity> */}
        <View style={styles.headerLeft}>
          <Image
            source={require('../assets/images/MenuMindLogo.png')}
            style={styles.logo}
          />
          <Text style={styles.headerTitle}>MenuMind Chat</Text>
        </View>
        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => navigation.navigate('QrScreen')}
        >
          <Image
            source={require('../assets/images/Qr.png')}
            style={styles.qrIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachmentButton}>
          <Image
            source={require('../assets/images/Attachement.png')}
            style={styles.inputIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton}>
          <Image
            source={require('../assets/images/Album.png')}
            style={styles.inputIcon}
          />
        </TouchableOpacity>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message here."
            placeholderTextColor="#999999"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
        </View>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Image
            source={require('../assets/images/Send.png')}
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: wp(2),
    marginRight: wp(2),
  },
  backButtonText: {
    fontSize: wp(6),
    color: '#3050e8',
    fontWeight: 'bold',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: wp(8),
    height: wp(8),
    marginRight: wp(3),
  },
  headerTitle: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#000000',
  },
  qrButton: {
    padding: wp(2),
  },
  qrIcon: {
    width: wp(6),
    height: wp(6),
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatContent: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  messageContainer: {
    marginBottom: hp(2),
  },
  messageBubble: {
    maxWidth: wp(85),
    borderRadius: wp(4),
    padding: wp(4),
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aiMessage: {
    backgroundColor: '#F5F5F5',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#3050e8',
    alignSelf: 'flex-end',
    shadowColor: '#3050e8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  avatar: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    marginVertical: hp(2),
  },
  avatar2: {
    width: wp(10),
    height: wp(10),
    marginVertical: hp(1),
    borderRadius: wp(5),
    alignSelf: 'flex-end',
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: wp(4),
    lineHeight: wp(5.5),
    marginBottom: wp(2),
  },
  aiMessageText: {
    color: '#999999',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: wp(3.2),
    color: '#999999',
    textAlign: 'right',
    marginBottom: wp(2),
  },
  messageActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: wp(2),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(4),
  },
  actionIcon: {
    width: wp(4),
    height: wp(4),
    marginRight: wp(1),
  },
  actionText: {
    fontSize: wp(3.5),
    color: '#666666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5E5',
  },
  attachmentButton: {
    padding: wp(2),
    marginRight: wp(2),
  },
  imageButton: {
    padding: wp(2),
    marginRight: wp(2),
  },
  inputIcon: {
    width: wp(6),
    height: wp(6),
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: wp(6),
    paddingHorizontal: wp(4),
    paddingVertical: wp(3),
    marginRight: wp(2),
    maxHeight: hp(12),
  },
  textInput: {
    fontSize: wp(4),
    color: '#999999',
    textAlignVertical: 'top',
  },
  sendButton: {
    padding: wp(2),
  },
  sendIcon: {
    width: wp(6),
    height: wp(6),
  },
});
