import {View, Text, FlatList} from 'react-native';
import React, {useState} from 'react';
import ContactListComponent from '../components/ContactListComponent';
import {userService} from '../network/lib/user';
import {IUser} from '../types/network/types';
import DebounceButton from '../components/DebounceButton';

const Recommend = () => {
  const [loading, setIsLoading] = useState(false);
  const [recommendList, setRecommendList] = useState<IUser[]>([]);

  const getRecommendList = async () => {
    setIsLoading(true);
    const res = await userService.getRecommendFriendList().finally(() => {
      setIsLoading(false);
    });
    setRecommendList(res.data);
  };

  return (
    <View>
      <DebounceButton
        text={'Get Recommendation'}
        handleOnPress={getRecommendList}
      />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={recommendList}
          renderItem={({item}) => <ContactListComponent user={item} />}
        />
      )}
    </View>
  );
};

export default Recommend;
