import {View, Text, Pressable} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {styles} from '../../utils/styles';

type messageType = {
  id?: string;
  text?: string;
  time?: number;
  user?: string;
};

type ChatComponentProps = {
  item: {
    id: string;
    user: string;
    messages: messageType[];
  };
};

/**
 * Item component for Chat list
 */
export const ChatComponent = ({item}: ChatComponentProps) => {
  const [messages, setMessages] = useState({} as messageType);

  useLayoutEffect(() => {
    setMessages(item.messages[item.messages.length - 1]);
  }, []);

  const handlePress = () => {};
  return (
    <Pressable style={styles.cchat} onPress={handlePress}>
      <View style={styles.crightContainer}>
        <View>
          <Text style={styles.cusername}>{item.user}</Text>
          <Text style={styles.cmessage}>
            {messages?.text ? messages.text : 'Tap to start chatting'}
          </Text>
        </View>
        <View>
          <Text style={styles.ctime}>
            {messages?.time ? messages.time : 'now'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
