import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation/types';
import {StackActions, useNavigation} from '@react-navigation/native';
import {authService} from '../network/lib/auth';
import {showToast, toastType} from '../utils/toastUtil';

type VerifyEmailProps = StackScreenProps<RootStackParamList, 'VerifyEmail'>;

const VerifyEmail = ({route}: VerifyEmailProps) => {
  const navigation = useNavigation();
  const {username, password, email} = route.params;

  const [code, setCode] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);
  const REMAIN_TIME_SECOND = 60;

  useEffect(() => {
    authService.sendVerifyEmail(username, email);
  }, []);

  useEffect(() => {
    disableButtonAndSetTimer();
  }, [disabled]);

  const handleResendCode = async () => {
    await authService.sendVerifyEmail(username, email);
    setDisabled(true);
  };

  const disableButtonAndSetTimer = () => {
    if (disabled) {
      setRemainingTime(REMAIN_TIME_SECOND);
      // 开始倒计时
      const timer = setInterval(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000);

      // 60秒后重新激活按钮
      setTimeout(() => {
        setDisabled(false);
        clearInterval(timer);
      }, REMAIN_TIME_SECOND * 1000);

      // 组件卸载时清除定时器
      return () => clearInterval(timer);
    }
  };

  const handleRegister = async () => {
    await authService.register(username, password, email, code);
    showToast(toastType.SUCCESS, 'Success', 'Register successfully');
    navigation.dispatch(StackActions.popToTop());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textMiddleSize}>
        Verification code has been sent to your email:
      </Text>
      <Text style={styles.email}>{email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter verification code"
        value={code}
        onChangeText={setCode}
      />
      <Text
        style={styles.textResendCode}
        onPress={handleResendCode}
        disabled={disabled}>
        {disabled ? `Resend code in ${remainingTime} seconds` : 'Resend code'}
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  textMiddleSize: {
    fontSize: 14,
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 50,
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textResendCode: {
    color: '#5086CE',
    textAlign: 'right',
    marginBottom: 20,
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

export default VerifyEmail;
