import {Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {userService} from '../network/lib/user';
import {IUser} from '../types/network/types';
import {FlatList} from 'react-native-gesture-handler';
import ContactListComponent from '../components/ContactListComponent';
import {LoadingView} from '../components/LoadingView.tsx';

const Contacts = () => {
  const [loading, setIsLoading] = useState(true);
  const [friendList, setFriendList] = useState<IUser[]>([]);

  const getFriendList = async () => {
    const res = await userService.getFriendList();
    setFriendList(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getFriendList();
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
