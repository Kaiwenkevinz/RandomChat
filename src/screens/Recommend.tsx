import {View, Text, FlatList} from 'react-native';
import React, {useState} from 'react';
import ContactListComponent from '../components/ContactListComponent';
import {userService} from '../network/lib/user';
import {IUser} from '../types/network/types';
import DebounceButton from '../components/DebounceButton';
import {LoadingView} from '../components/LoadingView.tsx';
import {showToast, toastType} from '../utils/toastUtil';
import eventEmitter from '../services/event-emitter';
import {EVENT_UPDATE_FRIENDS} from '../services/event-emitter/constants';

const Recommend = () => {
  const [loading, setIsLoading] = useState(false);
  const [recommendList, setRecommendList] = useState<IUser[]>([]);
  const [btnText, setBtnText] = useState('Get Recommendation');

  const getRecommendList = async () => {
    setIsLoading(true);
    setBtnText('Getting Recommendation...');

    try {
      const res = await userService.getRecommendFriendList();
      setBtnText('Get Recommendation');
      setRecommendList(res.data);
      eventEmitter.emit(EVENT_UPDATE_FRIENDS);
    } catch (error) {
      showToast(toastType.ERROR, 'Error getting recommendation', '');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
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
