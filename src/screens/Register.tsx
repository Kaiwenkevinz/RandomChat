import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {IVerifyEmail} from '../types/navigation/types';
import {showToast, toastType} from '../utils/toastUtil';

export default function Register() {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reEnteredPassword, setPasswordAgain] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    console.log('Register screen mounted');

    return () => {
      console.log('Register screen unmounted');
    };
  }, []);

  const handlePressCreateAccount = () => {
    if (!password || password !== reEnteredPassword) {
      setPassword('');
      setPasswordAgain('');
      showToast(toastType.ERROR, 'Error', 'Password does not match');

      return;
    }

    const obj = {
      username,
      password,
      email,
    } as IVerifyEmail;
    navigation.navigate('VerifyEmail', obj);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry={true}
        value={reEnteredPassword}
        onChangeText={setPasswordAgain}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handlePressCreateAccount}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
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
