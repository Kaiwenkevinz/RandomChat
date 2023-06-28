import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {authService} from '../network/lib/auth';
import {showToast, toastType} from '../utils/toastUtil';

const ForgetPassword = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handlePress = async () => {
    if (!username || !email) {
      return;
    }

    await authService.forgetPassword(username, email);
    showToast(
      toastType.SUCCESS,
      'Success',
      `An email has been sent to ${email}`,
    );
    navigation.goBack();
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
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Forget Password</Text>
      </TouchableOpacity>
    </View>
  );
};

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

export default ForgetPassword;
