// 登录
export const API_LOGIN = '/login/go';
// 忘记密码
export const API_FORGET_PASSWORD = '/login/find-password';
// 注册
export const API_SEND_EMAIL = '/login/send-verifyemail';
export const API_REGISTER = '/login/register';
// 更新用户信息
export const API_UPDATE_USER_INFO = '/user/update';
// 获取用户信息
export const API_GET_USER_INFO = '/user/getUserInfo';
// 获取用户好友列表
export const API_GET_FRIEND_LIST = '/user/getFriendList';
// 获取与所有好友的所有聊天记录
export const API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES = '/user/getChatInfo';
// 上传图片
export const API_UPLOAD_IMAGE = '/file/get';
// 获取图片
export const API_GET_IMAGE = '/file/post';
// 上传头像
export const API_UPLOAD_AVATAR = '/file/get-avatar';
// 获取推荐好友列表
export const API_GET_RECOMMEND_LIST = '/recommend/add';
// 获取亲密度阈值
export const API_GET_SCORE_THRESHOLD = '/score/limit';
// 获取所有好友亲密度
export const API_GET_SCORES = '/score/getlist';
// 分页获取和某个好友的聊天记录
export const API_GET_MESSAGE_HISTORY = '/user/getMessageHistory';

export const API_GET_SECRET_KEY = '/secretKey';
export const API_GET_CHAT_GPT = '/chatgpt';

// 上传照片墙照片
export const API_UPLOAD_PHOTO_WALL = '/file/add-photo';
// 获取照片墙
export const API_GET_PHOTO_WALL = '/file/get-photo';
// 删除照片墙的照片
export const API_DELETE_PHOTO_WALL = '/file/delete-photo';

export const API_ERROR_MSG = {
  NO_SUCH_USER: 'No such user!',
  INVALID_VERIFY_CODE: 'Invalid verification code!',
  USERNAME_ALREADY_EXIST: 'User name has been registered!',
  NEED_EMAIL_VAERIFICATION: 'Need Email verification!',
};
