import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {IUser} from '../../types/network/types';

interface UserInfoProps {
  user: IUser;
}

const UserInfo = ({user}: UserInfoProps) => {
  const tags = user.tags?.split(';');

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.label}>Id:</Text>
        <Text style={styles.value}>{user.id}</Text>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user.username}</Text>
        <Text style={styles.label}>Tags:</Text>
        <View style={styles.tagContainer}>
          {tags?.map((tag, idx) => (
            <Text key={idx} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
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
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
    marginBottom: 10,
  },
  tag: {
    color: '#FFFFFF', // 白色文本
    fontSize: 14, // 字体大小
    fontWeight: 'bold', // 粗体字
    backgroundColor: '#007AFF', // 蓝色背景
    borderRadius: 4, // 圆角边框
    paddingHorizontal: 8, // 左右留白
    paddingVertical: 4, // 上下留白
    marginHorizontal: 4, // 左右留白
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
