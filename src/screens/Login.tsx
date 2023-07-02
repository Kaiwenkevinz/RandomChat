import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {showToast, toastType} from '../utils/toastUtil';
import {authService} from '../network/lib/auth';
import {StackActions, useNavigation} from '@react-navigation/native';
import {saveStorageData} from '../utils/storageUtil';
import {LOCAL_STORAGE_KEY_AUTH} from '../constant';
import {goToChats} from '../navigation/NavigationService';

export default function Login() {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    console.log('Login screen mounted');

    return () => {
      console.log('Login screen unmounted');
    };
  }, []);

  const onHandleLogin = async () => {
    if (!username || !password) {
      showToast(
        toastType.ERROR,
        'Error',
        'Username or password cannot be empty',
      );

      return;
    }

    const res = await authService.login(username, password);
    const data = res.data;
    await saveStorageData(LOCAL_STORAGE_KEY_AUTH, data);

    navigation.dispatch(StackActions.replace('HomeTab'));
    goToChats;
  };

  const handleForgetPassword = () => {
    navigation.navigate('ForgetPassword');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Login</Text>
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
      <Text style={styles.forgetPasswordText} onPress={handleForgetPassword}>
        forget password?
      </Text>
      <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={{marginTop: 10}}>
        Don't have an account?{' '}
        <Text
          style={{color: '#5086CE'}}
          onPress={() => {
            navigation.navigate('Register');
          }}>
          Sign up
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  forgetPasswordText: {
    textAlign: 'right',
    marginTop: 5,
    marginBottom: 16,
    color: '#5086CE',
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
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
