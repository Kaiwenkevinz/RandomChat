import {View, Text, FlatList} from 'react-native';
import React, {useState} from 'react';
import ContactListComponent from '../components/ContactListComponent';
import {userService} from '../network/lib/user';
import {IUser} from '../types/network/types';
import DebounceButton from '../components/DebounceButton';
import {LoadingView} from '../components/LoadingView.tsx';

const Recommend = () => {
  const [loading, setIsLoading] = useState(false);
  const [recommendList, setRecommendList] = useState<IUser[]>([]);
  const [btnText, setBtnText] = useState('Get Recommendation');

  const getRecommendList = async () => {
    setIsLoading(true);
    setBtnText('Getting Recommendation...');

    const res = await userService.getRecommendFriendList();
    setIsLoading(false);
    setBtnText('Get Recommendation');

    setRecommendList(res.data);
  };

  return (
    <>
      <DebounceButton
        disabled={loading}
        text={btnText}
        handleOnPress={getRecommendList}
      />
      {loading ? (
        <LoadingView />
      ) : (
        <FlatList
          data={recommendList}
          renderItem={({item}) => <ContactListComponent user={item} />}
        />
      )}
    </>
  );
};

export default Recommend;
