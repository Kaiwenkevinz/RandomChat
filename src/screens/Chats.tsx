import {View, Text, FlatList} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-navigation';
import {styles} from '../utils/styles';
import {ChatListComponent} from '../components/ChatListComponent';
import {IChatRoom} from '../types/network/types';
import {useChatWebSocket as useInitWebSocket} from '../hooks/useChatWebSocket';
import {useAppSelector} from '../hooks/customReduxHooks';
import {getChatsAsync, selectRooms} from '../store/chatSlice';
import {store} from '../store/store';
import {getProfileAsync} from '../store/userSlice';

const Chats = () => {
  const token = useAppSelector(state => state.user.token);
  useInitWebSocket(token);

  const {data: rooms, status} = useAppSelector(selectRooms);

  useEffect(() => {
    console.log('Chats mounted');

    store.dispatch(getChatsAsync());
    store.dispatch(getProfileAsync());

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
            renderItem={({item}) => renderChatComponent(item)}
            keyExtractor={item => item.otherUserName}
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

const renderChatComponent = (item: IChatRoom) => {
  const {
    messages,
    otherUserId,
    otherUserName,
    otherUserAvatarUrl,
    hasUnreadMessage,
  } = item;

  return (
    <ChatListComponent
      otherUserId={otherUserId}
      otherUserName={otherUserName}
      otherUserAvatarUrl={otherUserAvatarUrl}
      hasUnreadMessage={hasUnreadMessage}
      messages={messages}
    />
  );
};

export default Chats;
