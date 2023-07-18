import {KEYCHAIN_KEY_SECRET_KEY, LOCAL_STORAGE_KEY_AUTH} from './constant';
import {goToHomeTab, goToLogin} from '../navigation/NavigationService';
import {initAuthInceptor} from '../network/axios.config';
import {operateReadRoomAsync} from '../store/chat/chatSlice';
import {store} from '../store/store';
import {ILoginResponse, IUser} from '../types/network/types';
import {loadStorageData, saveKeychainData} from './storageUtil';
import {authService} from '../network/lib/auth';
import {
  getScoreThresholdAsync,
  getScoreMemoAsync,
  getProfileAsync,
} from '../store/user/thunks';
import {addNewUserInfo, addToken} from '../store/user/userSlice';

const getAuth = async () => {
  const data = await loadStorageData<ILoginResponse>(LOCAL_STORAGE_KEY_AUTH);

  if (!data || !data.user?.id || !data.token) {
    const errMsg = 'prepareToken: data or user id or token is null!';
    console.warn(errMsg);
    goToLogin();

    return Promise.reject(errMsg);
  }

  return data;
};

export const initConfigAndGoHome = async () => {
  const data = await getAuth();
  const {token, user} = data;

  initAuthInceptor(token, user.id);

  store.dispatch(addNewUserInfo(data.user as IUser));
  store.dispatch(addToken(token));

  // preload data
  const results = await Promise.all([
    authService.fetchSecretKey(),
    store.dispatch(operateReadRoomAsync({option: 'read', newData: null})),
    store.dispatch(getScoreThresholdAsync()),
    store.dispatch(getScoreMemoAsync()),
    store.dispatch(getProfileAsync()),
  ]);

  await saveKeychainData(KEYCHAIN_KEY_SECRET_KEY, results[0].data);

  goToHomeTab();
};
