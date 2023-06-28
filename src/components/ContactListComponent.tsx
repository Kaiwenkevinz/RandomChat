import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Pressable, View, Text, StyleSheet} from 'react-native';
import {IUser} from '../types/network/types';
import UserAvatar from 'react-native-user-avatar';

interface FriendListProps {
  user: IUser;
}

const ContactListComponent = ({user}: FriendListProps) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('FriendProfile', user);
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.container}>
        <UserAvatar
          bgColor="#fff"
          size={50}
          name={user.username}
          src={user.avatar_url}
          style={styles.avatar}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{user.username}</Text>
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
