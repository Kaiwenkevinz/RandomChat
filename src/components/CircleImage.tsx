import {Image, StyleSheet} from 'react-native';
import React from 'react';
import {useAppSelector} from '../hooks/customReduxHooks';
import {selectUser} from '../store/user/userSlice';

interface CircleImageProps {
  avatarUrl: string | null | undefined;
  borderColor?: string;
  size?: number;
}

const CircleImage = ({avatarUrl, size, borderColor}: CircleImageProps) => {
  const userStore = useAppSelector(selectUser);
  const token = userStore.token;

  if (!avatarUrl) {
    avatarUrl = 'https://i.imgur.com/An9lt5Q.png';
  }
  if (!size) {
    size = 100;
  }
  if (!borderColor) {
    borderColor = '#3478F6';
  }

  const styles = StyleSheet.create({
    image: {
      width: size,
      height: size,
      borderColor,
      borderWidth: 1,
      borderRadius: 75,
    },
  });

  return (
    <Image
      source={{
        uri: avatarUrl,
        headers: {
          Authorization: `Bearer ${token}}`,
        },
      }}
      resizeMode="cover"
      style={styles.image}
    />
  );
};

export default CircleImage;
