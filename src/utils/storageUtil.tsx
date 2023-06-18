import AsyncStorage from '@react-native-async-storage/async-storage';
import {LoginResponse, User} from '../types/network/types';

export const saveStorageData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    console.log(
      '🚀 ~ file: storageUtil.tsx:6 ~ saveStorageData ~ jsonValue:',
      jsonValue,
    );
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log('storeData error: ', e);
  }
};

export const loadStorageData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);

    return jsonValue != null ? (JSON.parse(jsonValue) as LoginResponse) : null;
  } catch (e) {
    console.log('getStorageData error: ', e);
  }
};
