import {View, ActivityIndicator} from 'react-native';
import React from 'react';
import {styles} from './styles';

export const LoadingView = () => {
  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" />
    </View>
  );
};
