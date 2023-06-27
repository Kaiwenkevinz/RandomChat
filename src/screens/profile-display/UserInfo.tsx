import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {IUser} from '../../types/network/types';

interface UserInfoProps {
  user: IUser;
}

const UserInfo = ({user}: UserInfoProps) => {
  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.label}>Id:</Text>
        <Text style={styles.value}>{user.id}</Text>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user.username}</Text>
        <Text style={styles.label}>Gender:</Text>
        <Text style={styles.value}>{user.gender}</Text>
        <Text style={styles.label}>Age:</Text>
        <Text style={styles.value}>{user.age}</Text>
        <Text style={styles.label}>Hometown:</Text>
        <Text style={styles.value}>{user.hometown}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.mail}</Text>
        <Text style={styles.label}>Major:</Text>
        <Text style={styles.value}>{user.major}</Text>
        <Text style={styles.label}>Birthday:</Text>
        <Text style={styles.value}>{user.birthday}</Text>
        <Text style={styles.label}>School:</Text>
        <Text style={styles.value}>{user.school}</Text>
        <Text style={styles.label}>MBTI:</Text>
        <Text style={styles.value}>{user.mbti}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UserInfo;
