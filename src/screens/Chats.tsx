import {View, Text, FlatList, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-navigation';
import {ChatListComponent} from '../components/ChatListComponent';
import {IChatRoom} from '../types/network/types';
import {useChatWebSocket as useInitWebSocket} from '../hooks/useChatWebSocket';
import {useAppSelector} from '../hooks/customReduxHooks';
import {selectChat} from '../store/chat/chatSlice';
import {getChatsAsync} from '../store/chat/thunks/getChatsAsyncThunk';
import {store} from '../store/store';
import {LoadingView} from '../components/LoadingView';
import eventEmitter from '../services/event-emitter';
import {EVENT_SERVER_REFRESH_SCORE} from '../services/event-emitter/constants';
import {WebSocketSingleton} from '../services/event-emitter/WebSocketSingleton';

const Chats = () => {
  const {data: rooms, chatStatus: status} = useAppSelector(selectChat);
  const token = useAppSelector(state => state.user.token);
  useInitWebSocket(token);

  const loading = status === 'loading';

  const fetchChats = () => {
    store.dispatch(getChatsAsync());
  };

  useEffect(() => {
    console.log('Chats mounted');
    fetchChats();

    eventEmitter.on(EVENT_SERVER_REFRESH_SCORE, fetchChats);

    return () => {
      eventEmitter.off(EVENT_SERVER_REFRESH_SCORE, fetchChats);
      WebSocketSingleton.closeAndReset();
    };
  }, []);

  return (
    <SafeAreaView style={styles.chatscreen}>
      {status === 'loading' ? (
        <LoadingView />
      ) : (
        <View style={styles.chatlistContainer}>
          {rooms && rooms.length > 0 ? (
            <FlatList
              data={rooms}
              renderItem={({item}) => renderChatComponent(item)}
              keyExtractor={item => item.otherUserId.toString()}
              refreshing={loading}
              onRefresh={fetchChats}
            />
          ) : (
            <View style={styles.chatemptyContainer}>
              <Text style={styles.chatemptyText}>Chats is empty.</Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const renderChatComponent = (item: IChatRoom) => {
  const {messages, otherUserId, otherUserName, otherUserAvatarUrl, total} =
    item;

  return (
    <ChatListComponent
      otherUserId={otherUserId}
      otherUserName={otherUserName}
      otherUserAvatarUrl={otherUserAvatarUrl}
      messages={messages}
      total={total}
    />
  );
};

const styles = StyleSheet.create({
  chatscreen: {
    flex: 1,
    margin: 10,
  },
  chatlistContainer: {
    marginHorizontal: 10,
    flex: 1,
  },
  chatemptyContainer: {
    width: '100%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatemptyText: {fontWeight: 'bold', fontSize: 24, paddingBottom: 30},
});

export default Chats;
