import {View, Text, FlatList, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-navigation';
import {ChatListComponent} from '../components/ChatListComponent';
import {IChatRoom} from '../types/network/types';
import {useChatWebSocket as useInitWebSocket} from '../hooks/useChatWebSocket';
import {useAppSelector} from '../hooks/customReduxHooks';
import {
  getChatsAsync,
  operateReadRoomAsync,
  selectRooms,
} from '../store/chatSlice';
import {store} from '../store/store';
import {getProfileAsync} from '../store/userSlice';
import {LoadingView} from '../components/LoadingView';
import {WebSocketSingleton} from '../services/event-emitter/WebSocketSingleton';
import eventEmitter from '../services/event-emitter';
import {EVENT_SERVER_REFRESH_SCORE} from '../services/event-emitter/constants';
import {loadStorageData} from '../utils/storageUtil';
import {LOCAL_STORAGE_KEY_SCORE_THRESHOLD} from '../constant';

const Chats = () => {
  const token = useAppSelector(state => state.user.token);
  useInitWebSocket(token);

  const {data: rooms, status} = useAppSelector(selectRooms);
  const [scoreThreshold, setScoreThreshold] = useState<number>(0);

  const getScoreThreshold = async () => {
    const res = await loadStorageData<number>(
      LOCAL_STORAGE_KEY_SCORE_THRESHOLD,
    );
    if (!res) {
      return;
    }
    setScoreThreshold(res);
  };

  useEffect(() => {
    console.log('Chats mounted');

    getScoreThreshold();
    store.dispatch(getChatsAsync());
    store.dispatch(getProfileAsync());
    store.dispatch(operateReadRoomAsync({option: 'read', newData: null}));

    eventEmitter.on(EVENT_SERVER_REFRESH_SCORE, () => {
      store.dispatch(getChatsAsync());
    });

    return () => {
      console.log('Chats unmounted');
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
              renderItem={({item}) => renderChatComponent(item, scoreThreshold)}
              keyExtractor={item => item.otherUserId.toString()}
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

const renderChatComponent = (item: IChatRoom, scoreThreshold: number) => {
  const {score, messages, otherUserId, otherUserName, otherUserAvatarUrl} =
    item;

  return (
    <ChatListComponent
      scoreThreshold={scoreThreshold}
      score={score}
      otherUserId={otherUserId}
      otherUserName={otherUserName}
      otherUserAvatarUrl={otherUserAvatarUrl}
      messages={messages}
    />
  );
};

export default Chats;

const styles = StyleSheet.create({
  chatscreen: {
    flex: 1,
    margin: 10,
  },
  chatlistContainer: {
    marginHorizontal: 10,
  },
  chatemptyContainer: {
    width: '100%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatemptyText: {fontWeight: 'bold', fontSize: 24, paddingBottom: 30},
});
