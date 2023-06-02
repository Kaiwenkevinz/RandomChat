import {View, Text, FlatList} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-navigation';
import {styles} from '../utils/styles';
import {ChatListComponent} from '../components/ChatListComponent';
import {ChatService} from '../network/lib/message';
import {ChatComponentProps, MessagePack, User} from '../types/network/types';
import {AuthContext} from './Home';
import {
  WebSocketMessagePackType,
  useChatWebSocket,
} from '../hooks/useChatWebSocket';

const Chats = () => {
  const {user} = useContext(AuthContext);

  const {ws} = useChatWebSocket();

  const [rooms, setRooms] = useState<ChatComponentProps[]>([]);

  const fetchAllChatMessages = async () => {
    const res = await ChatService.getAllChatMessages();
    const fetchedRooms = res.data.rooms;
    setRooms(fetchedRooms);
  };

  useEffect(() => {
    fetchAllChatMessages().catch(console.error);
  }, []);

  return (
    <SafeAreaView style={styles.chatscreen}>
      <View style={styles.chatlistContainer}>
        {rooms && rooms.length > 0 ? (
          <FlatList
            data={rooms}
            renderItem={({item}) => renderChatComponent(item, user)}
            keyExtractor={item => item.roomId}
          />
        ) : (
          <View style={styles.chatemptyContainer}>
            <Text style={styles.chatemptyText}>Chats is empty.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const renderChatComponent = (item: ChatComponentProps, user: User) => {
  const {roomId, messages, otherUserId} = item;

  return (
    <ChatListComponent
      roomId={roomId}
      otherUserId={otherUserId}
      user={user}
      messages={messages}
    />
  );
};

export default Chats;
