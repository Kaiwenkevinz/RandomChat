import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {useDebounce} from '../hooks/useDebounce';

interface Props {
  text: string;
  handleOnPress: () => void;
}

const DebounceButton = ({handleOnPress, text}: Props) => {
  const debouncedPress = useDebounce(handleOnPress, 1000);

  return (
    <TouchableOpacity style={styles.button} onPress={debouncedPress}>
      <Text style={styles.buttonText}>{text}</Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DebounceButton;
