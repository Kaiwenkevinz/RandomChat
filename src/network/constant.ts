// 登录
export const API_LOGIN = '/login/go';
// 注册
export const API_SEND_EMAIL = '/login/send-verifyemail';
export const API_REGISTER = '/login/register';
// 更新用户信息
export const API_UPDATE_USER_INFO = '/login/register';
// 获取用户信息
export const API_GET_USER_INFO = '/user/getUserInfo';
// 获取用户好友列表
export const API_GET_FRIEND_LIST = '/user/getFriendList';
// 获取与所有好友的所有聊天记录
export const API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES = '/user/getChatInfo';

export const API_ERROR_MSG = {
  NO_SUCH_USER: 'No such user!',
  INVALID_VERIFY_CODE: 'Invalid verification code!',
  USERNAME_ALREADY_EXIST: 'User name has been registered!',
  NEED_EMAIL_VAERIFICATION: 'Need Email verification!',
};
