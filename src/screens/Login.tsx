import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {NavigationScreenProp} from 'react-navigation';
import React, {useEffect, useState} from 'react';
import {useAppSelector, useAppDispatch} from '../hooks/customReduxHooks';
import {increment, selectCount} from '../store/counterSlice';
import {getUser} from '../network/lib/user';
import {showToast, toastType} from '../util/toastUtil';
import {authService} from '../network/lib/auth';

type Props = {
  navigation: NavigationScreenProp<any, any>;
};

export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // useSelector 用于获取 redux store 中的数据
  const count = useAppSelector(selectCount);
  // dispatch 用于触发 redux action
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('Login screen mounted');
    return () => {
      console.log('Login screen unmounted');
    };
  }, []);

  const onHandleLogin = async () => {
    // 处理登录逻辑
    console.log(`username: ${username}, password: ${password}`);

    if (!username || !password) {
      showToast(
        toastType.ERROR,
        'Error',
        'Username or password cannot be empty',
      );

      return;
    }

    try {
      await authService.login(username, password);
      props.navigation.navigate('Home');
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Text onPress={() => dispatch(increment())}>{count}</Text>
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
      <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          props.navigation.navigate('Register');
        }}>
        <Text style={styles.buttonText}>Go to Register</Text>
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
