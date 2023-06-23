import {User} from '../network/types';

/**
 * Define the types of navigation params here.
 */
export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  HomeTab: undefined;
  Chats: undefined;
  Search: undefined;
  Profile: undefined;
  ProfileEdit: User;
  Contacts: undefined;
  ChatRoom: {
    otherUserId: number;
    otherUserName: string;
    otherUserAvatarUrl: string;
  };
};
