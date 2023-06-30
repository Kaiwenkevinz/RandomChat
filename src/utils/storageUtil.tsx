import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveStorageData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    console.log('Save to Storage, key: ', key, ', value: ', jsonValue);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('storeData error: ', e);
  }
};

export const loadStorageData = async <T,>(key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    const obj = jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
    console.log('Load from Storage, key: ', key, ', value: ', obj);

    return obj;
  } catch (e) {
    console.error('getStorageData error: ', e);
  }
};

export const removeStorageData = async (key: string) => {
  try {
    console.log('Remove storage, key: ', key);
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('removeStorageData error: ', e);
  }
};
