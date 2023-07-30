import Toast from 'react-native-toast-message';

export const toastType = {
  ERROR: 'error',
  SUCCESS: 'success',
  INFO: 'info',
};

export const showToast = (type: string, title: string, content: string) => {
  Toast.show({
    type,
    text1: title,
    text2: content,
  });
};
