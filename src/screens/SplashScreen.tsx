import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet} from 'react-native';
import images from '../../assets';
import {LOCAL_STORAGE_KEY_AUTH} from '../constant';
import {initAuthInceptor} from '../network/axios.config';
import {store} from '../store/store';
import {
  addNewUserInfo,
  addToken,
  getProfileAsync,
  getScoreMemoAsync,
  getScoreThresholdAsync,
} from '../store/userSlice';
import {ILoginResponse, IUser} from '../types/network/types';
import {loadStorageData} from '../utils/storageUtil';
import {
  goToChats,
  goToHomeTab,
  goToLogin,
} from '../navigation/NavigationService';

const LOADING_IMAGE = 'Loading image';
const FADE_IN_IMAGE = 'Fade in image';
const WAIT_FOR_APP_TO_BE_READY = 'Wait for app to be ready';
const FADE_OUT = 'Fade out';
const HIDDEN = 'Hidden';

export const SplashScreen = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;

  const [state, setState] = useState<
    | typeof LOADING_IMAGE
    | typeof FADE_IN_IMAGE
    | typeof WAIT_FOR_APP_TO_BE_READY
    | typeof FADE_OUT
    | typeof HIDDEN
  >(LOADING_IMAGE);

  useEffect(() => {
    console.log('Splash screen mounted');

    setTimeout(() => {
      prepareConfigs().finally(() => {
        setIsAppReady(true);
      });
    }, 1000);

    return () => {
      console.log('Splash screen unmounted');
    };
  }, []);

  const handleTokenAndUserInfo = (storageData: ILoginResponse) => {
    let token = storageData?.token;
    let user = storageData?.user;
    let userId = user?.id;

    // TODO: validate JWT
    const valid = token !== null;

    // token not valid, go to login
    if (!valid) {
      console.log('Token invalid, go to login');
      goToLogin();

      return;
    }

    // add token to axios interceptor, so that every request will have token
    if (!token) {
      token = '';
    }
    if (!userId) {
      userId = 0;
    }
    initAuthInceptor(token, userId);

    // add user info to redux store
    store.dispatch(addNewUserInfo(user as IUser));
    store.dispatch(addToken(token));
  };

  /**
   * 处理 tokens，配置项
   */
  const prepareConfigs = async () => {
    const data = await loadStorageData<ILoginResponse>(LOCAL_STORAGE_KEY_AUTH);

    if (!data) {
      console.log('No token found, go to login');
      goToLogin();

      return;
    }

    handleTokenAndUserInfo(data);
    Promise.all([
      store.dispatch(getScoreThresholdAsync()),
      store.dispatch(getScoreMemoAsync()),
      store.dispatch(getProfileAsync()),
    ]).then(() => {
      goToHomeTab();
    }, console.log);
  };

  useEffect(() => {
    if (state === FADE_IN_IMAGE) {
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 1000, // Fade in duration
        useNativeDriver: true,
      }).start(() => {
        setState(WAIT_FOR_APP_TO_BE_READY);
      });
    }
  }, [imageOpacity, state]);

  useEffect(() => {
    if (state === WAIT_FOR_APP_TO_BE_READY) {
      if (isAppReady) {
        setState(FADE_OUT);
      }
    }
  }, [isAppReady, state]);

  useEffect(() => {
    if (state === FADE_OUT) {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 1000, // Fade out duration
        delay: 1000, // Minimum time the logo will stay visible
        useNativeDriver: true,
      }).start(() => {
        setState(HIDDEN);
      });
    }
  }, [containerOpacity, state]);

  if (state === HIDDEN) {
    return null;
  }

  return (
    <Animated.View
      collapsable={false}
      style={[style.container, {opacity: containerOpacity}]}>
      <Animated.Image
        source={images.appIcon}
        fadeDuration={0}
        onLoad={() => {
          setState(FADE_IN_IMAGE);
        }}
        style={[style.image, {opacity: imageOpacity}]}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const style = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 250,
  },
});
