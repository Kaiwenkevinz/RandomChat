import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {ImagePickerAvatar} from './ImagePickerAvatar';
import UserInfo from '../../components/UserInfo/UserInfo';
import {IUser} from '../../types/network/types';

type Props = {
  user: IUser;
  tags: string[];
  onHandleNewAvatar: (imageUrl: string) => void;
  onLogout: () => void;
  onEditProfile: () => void;
};

const ProfileDumb = ({
  user,
  tags,
  onHandleNewAvatar,
  onLogout,
  onEditProfile,
}: Props) => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <ImagePickerAvatar
          pickerDisabled={false}
          avatarUrl={user.avatar_url}
          imageName={`${user.id}_avatar`}
          onConfirm={onHandleNewAvatar}
        />
        <UserInfo
          username={user.username}
          tags={tags}
          age={user.age}
          birthday={user.birthday}
          gender={user.gender}
          hometown={user.hometown}
          email={user.mail}
          major={user.mail}
          mbti={user.mbti}
          telephoneNumber={user.telephone_number}
        />
        <TouchableOpacity style={styles.button} onPress={onEditProfile}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {margin: 20}]}
          onPress={onLogout}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 10,
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

export default ProfileDumb;
