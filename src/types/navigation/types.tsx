import {IUser} from '../network/types';

/**
 * Define the types of navigation params here.
 */
export interface IVerifyEmail {
  username: string;
  password: string;
  email: string;
}

export type RootStackParamList = {
  Register: undefined;
  VerifyEmail: IVerifyEmail;
  Login: undefined;
  ForgetPassword: undefined;
  HomeTab: undefined;
  Chats: undefined;
  Recommend: undefined;
  Profile: undefined;
  ProfileEdit: IUser;
  Contacts: undefined;
  ChatRoom: {
    otherUserId: number;
    otherUserName: string;
    otherUserAvatarUrl: string;
    score: number;
    scoreThreshold: number;
  };
  FriendProfile: IUser;
};
