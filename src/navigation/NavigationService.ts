let _navigator: any;

function setTopLevelNavigator(navigatorRef: any) {
  _navigator = navigatorRef;
}

function navigate(routeName: string, params?: object | undefined) {
  _navigator.navigate(routeName, params);
}

export function goToLogin() {
  _navigator.reset({
    index: 0,
    routes: [{name: 'Login'}],
  });
}

export function goToHomeTab() {
  navigate('HomeTab');
  goToChats();
}

export function goToChats() {
  navigate('Chats');
}

export default {
  navigate,
  setTopLevelNavigator,
};
