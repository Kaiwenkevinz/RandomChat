import {globalLoading} from '../components/GlobalLoading';
import {LOCAL_STORAGE_KEY_AUTH} from './constant';
import {goToHomeTab, goToLogin} from '../navigation/NavigationService';
import {initAuthInceptor} from '../network/axios.config';
import {operateReadRoomAsync} from '../store/chatSlice';
import {store} from '../store/store';
import {
  addNewUserInfo,
  addToken,
  getScoreThresholdAsync,
  getScoreMemoAsync,
  getProfileAsync,
} from '../store/userSlice';
import {ILoginResponse, IUser} from '../types/network/types';
import {loadStorageData} from './storageUtil';

export const initConfigAndGoHome = async () => {
  const data = await loadStorageData<ILoginResponse>(LOCAL_STORAGE_KEY_AUTH);

  if (!data || !data.user?.id || !data.token) {
    const errMsg = 'prepareToken: data or user id or token is null!';
    console.warn(errMsg);
    goToLogin();

    return Promise.reject(errMsg);
  }

  const token = data.token;

  initAuthInceptor(token, data.user.id);

  store.dispatch(addNewUserInfo(data.user as IUser));
  store.dispatch(addToken(token));

  await Promise.all([
    store.dispatch(operateReadRoomAsync({option: 'read', newData: null})),
    store.dispatch(getScoreThresholdAsync()),
    store.dispatch(getScoreMemoAsync()),
    store.dispatch(getProfileAsync()),
  ]);

  goToHomeTab();
};
