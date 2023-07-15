import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {userService} from '../network/lib/user';
import {IUser} from '../types/network/types';
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

  if (friendList.length === 0 && !loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You have no friends.</Text>
        <Text style={styles.emptyText}>Go to Recommend to get friends.</Text>
      </View>
    );
  }

  return (
    <>
      {loading ? (
        <LoadingView />
      ) : (
        <FlatList
          data={friendList}
          renderItem={({item}) => (
            <ContactListComponent user={item} fromRecommendation={true} />
          )}
          refreshing={loading}
          onRefresh={getFriendList}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    width: '100%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
  },
});

export default Contacts;
