let _navigator: any;

function setTopLevelNavigator(navigatorRef: any) {
  _navigator = navigatorRef;
}

function navigate(routeName: string, params?: object | undefined) {
  _navigator.navigate(routeName, params);
}

export function goToLogin() {
  navigate('Login');
}

export default {
  navigate,
  setTopLevelNavigator,
};
