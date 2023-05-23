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

type Props = {
  navigation: NavigationScreenProp<any, any>;
};

export default function Register(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reEnteredPassword, setPasswordAgain] = useState('');
  const [errorShown, setErrorShown] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    console.log('Register screen mounted');

    return () => {
      console.log('Register screen unmounted');
    };
  }, []);

  const handleRegister = () => {
    console.log(
      `username: ${username}, password: ${password}, confirmPassword: ${reEnteredPassword}`,
    );

    // validate password and re-entered password
    const isPasswordValid = password === reEnteredPassword;
    setErrorShown(isPasswordValid);
    setErrorMsg('Password and re-entered password are not the same');
    if (!isPasswordValid) {
      return;
    }

    authService.register(username, password);

    // go back to home screen
    props.navigation.goBack();
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
      {errorShown && <Text>{errorMsg}</Text>}
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
