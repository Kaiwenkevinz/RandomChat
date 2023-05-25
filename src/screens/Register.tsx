import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationScreenProp} from 'react-navigation';
import {authService} from '../network/lib/auth';
import {showToast, toastType} from '../utils/toastUtil';

type Props = {
  navigation: NavigationScreenProp<any, any>;
};

export default function Register(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reEnteredPassword, setPasswordAgain] = useState('');

  useEffect(() => {
    console.log('Register screen mounted');

    return () => {
      console.log('Register screen unmounted');
    };
  }, []);

  const handleRegister = async () => {
    console.log(
      `username: ${username}, password: ${password}, confirmPassword: ${reEnteredPassword}`,
    );

    // validate password and re-entered password
    const isPasswordValid = password === reEnteredPassword;
    if (!isPasswordValid) {
      setPassword('');
      setPasswordAgain('');
      showToast(toastType.ERROR, 'Error', 'Password does not match');

      return;
    }

    try {
      await authService.register(username, password);
      showToast(toastType.SUCCESS, 'Success', 'Register successfully');
      // go back to home screen
      props.navigation.goBack();
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
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
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // flexbox 布局容器
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
