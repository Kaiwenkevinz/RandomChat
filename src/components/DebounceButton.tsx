import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {useDebounce} from '../hooks/useDebounce';

interface Props {
  text: string;
  disabled?: boolean;
  fontSize?: number;
  handleOnPress: () => void;
}

const DebounceButton = ({handleOnPress, disabled, text, fontSize}: Props) => {
  if (!fontSize) {
    fontSize = 18;
  }

  const debouncedPress = useDebounce(handleOnPress, 1000);
  if (!disabled) {
    disabled = false;
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={debouncedPress}
      disabled={disabled}>
      <Text style={[styles.buttonText, {fontSize}]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DebounceButton;
