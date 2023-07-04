import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Pressable, View, Text, StyleSheet} from 'react-native';
import {IUser} from '../types/network/types';
import CircleImage from './CircleImage';
import {useAppSelector} from '../hooks/customReduxHooks';
import ScoreTag from './ScoreTag';

interface FriendListProps {
  user: IUser;
  fromRecommendation?: boolean;
}

const ContactListComponent = ({user, fromRecommendation}: FriendListProps) => {
  const navigation = useNavigation();

  if (!fromRecommendation) {
    fromRecommendation = false;
  }

  const scoreThreshold = useAppSelector(state => state.user.scoreThreshold);
  const scoreMemo = useAppSelector(state => state.user.scoreMemo);
  const score = scoreMemo[user.id] || 0;

  const handlePress = () => {
    navigation.navigate('FriendProfile', user);
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.container}>
        <CircleImage size={50} avatarUrl={user.avatar_url} borderColor="#fff" />
        <View style={styles.infoContainer}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.name}>{user.username}</Text>
            {fromRecommendation && (
              <ScoreTag score={score} threshold={scoreThreshold} />
            )}
          </View>
          <Text style={styles.info}>{`${user.hometown} | ${user.major}`}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 5,
    height: 80,
    padding: 12,
  },
  infoContainer: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  avatar: {
    // flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  info: {
    flex: 1,
  },
});

export default ContactListComponent;
