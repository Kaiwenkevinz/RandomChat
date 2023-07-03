import {View, Text} from 'react-native';
import React from 'react';
import {styles} from './styles';

interface TagProps {
  text: string;
  backgroundColor?: string;
  textColor?: string;
}

const TagComponent = ({text, backgroundColor, textColor}: TagProps) => {
  return (
    <View
      style={[
        styles.container,
        backgroundColor ? {backgroundColor: backgroundColor} : {},
      ]}>
      <Text style={[styles.text, textColor ? {color: textColor} : {}]}>
        {text}
      </Text>
    </View>
  );
};

export default TagComponent;
