import {View, Text, FlatList} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {SafeAreaView} from 'react-navigation';
import {styles} from '../utils/styles';
import {ChatListComponent} from '../components/ChatListComponent';
import {ChatComponentProps, User} from '../types/network/types';
import {AuthContext} from './Home';
import {useChatWebSocket} from '../hooks/useChatWebSocket';
import {useAppSelector} from '../hooks/customReduxHooks';
import {getChatsAsync, selectRooms} from '../store/chatSlice';
import {store} from '../store/store';

const Chats = () => {
  const {user} = useContext(AuthContext);

  const {websocket} = useChatWebSocket();

  const {rooms, status} = useAppSelector(selectRooms);

  useEffect(() => {
    console.log('Chats mounted');

    store.dispatch(getChatsAsync());

    return () => {
      console.log('Chats unmounted');
    };
  }, []);

  return (
    <SafeAreaView style={styles.chatscreen}>
      <View style={styles.chatlistContainer}>
        {rooms && rooms.length > 0 ? (
          <FlatList
            data={rooms}
            renderItem={({item}) => renderChatComponent(item, user, websocket)}
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

const renderChatComponent = (item: ChatComponentProps, user: User, websocket: WebSocket) => {
  const {roomId, messages, otherUserId} = item;

  return (
    <ChatListComponent
      roomId={roomId}
      otherUserId={otherUserId}
      user={user}
      messages={messages}
      websocket={websocket}
    />
  );
};

export default Chats;
