import {Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {userService} from '../network/lib/user';
import {IUser} from '../types/network/types';
import {FlatList} from 'react-native-gesture-handler';

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
    <View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View>
          <FlatList
            data={friendList}
            renderItem={({item}) => <Text>{item.username}</Text>}
          />
        </View>
      )}
    </View>
  );
};

export default Contacts;
