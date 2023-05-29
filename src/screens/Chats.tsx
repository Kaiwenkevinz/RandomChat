import {View, Text, FlatList} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-navigation';
import {styles} from '../utils/styles';
import {ChatListComponent} from '../network/components/ChatListComponent';
import {ChatService} from '../network/lib/message';
import {ChatComponentProps, User} from '../types/network/types';
import {AuthContext} from './Home';

const Chats = () => {
  const {user} = useContext(AuthContext);

  const [rooms, setRooms] = useState<ChatComponentProps[]>([]);

  const fetchRooms = async () => {
    const res = await ChatService.getRooms();
    const fetchedRooms = res.data.rooms;
    setRooms(fetchedRooms);
  };

  useEffect(() => {
    fetchRooms().catch(console.error);
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
  const {roomId, messages, otherUserName} = item;
  const latestMsg = messages[0];

  return (
    <ChatListComponent
      roomId={roomId}
      otherUserName={otherUserName}
      user={user}
      message={latestMsg}
    />
  );
};

export default Chats;
