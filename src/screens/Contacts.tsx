import {Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {userService} from '../network/lib/user';
import {IUser} from '../types/network/types';
import {FlatList} from 'react-native-gesture-handler';
import ContactListComponent from '../components/ContactListComponent';
import {LoadingView} from '../components/LoadingView';
import eventEmitter from '../services/event-emitter';
import {EVENT_SERVER_REFRESH_SCORE} from '../services/event-emitter/constants';

const Contacts = () => {
  const [loading, setIsLoading] = useState(true);
  const [friendList, setFriendList] = useState<IUser[]>([]);

  const getFriendList = async () => {
    setIsLoading(true);
    try {
      const res = await userService.getFriendList();
      setFriendList(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFriendList();
    eventEmitter.on('EVENT_UPDATE_FRIENDS', () => {
      getFriendList();
    });
    eventEmitter.on(EVENT_SERVER_REFRESH_SCORE, () => {
      getFriendList();
    });
  }, []);

  return (
    <>
      {loading ? (
        <LoadingView />
      ) : (
        <View>
          <FlatList
            data={friendList}
            renderItem={({item}) => <ContactListComponent user={item} />}
          />
        </View>
      )}
    </>
  );
};

export default Contacts;
