import {View, Text, FlatList} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-navigation';
import {styles} from '../utils/styles';
import {ChatListComponent} from '../components/ChatListComponent';
import {ChatComponentProps} from '../types/network/types';
import {useChatWebSocket} from '../hooks/useChatWebSocket';
import {useAppSelector} from '../hooks/customReduxHooks';
import {getChatsAsync, selectRooms} from '../store/chatSlice';
import {store} from '../store/store';
import {getUserProfileAsync} from '../store/userSlice';

const Chats = () => {
  const {websocket} = useChatWebSocket();

  const {rooms, status} = useAppSelector(selectRooms);

  useEffect(() => {
    console.log('Chats mounted');

    store.dispatch(getChatsAsync());
    store.dispatch(getUserProfileAsync());

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
            renderItem={({item}) => renderChatComponent(item, websocket)}
            keyExtractor={item => item.otherUserId}
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

const renderChatComponent = (
  item: ChatComponentProps,
  websocket: WebSocket,
) => {
  const {messages, otherUserId, otherUserAvatarUrl} = item;

  return (
    <ChatListComponent
      otherUserId={otherUserId}
      otherUserAvatarUrl={otherUserAvatarUrl}
      messages={messages}
      websocket={websocket}
    />
  );
};

export default Chats;
