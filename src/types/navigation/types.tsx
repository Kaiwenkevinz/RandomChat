import {UserProfile} from '../network/types';
import {UserInfo} from '../network/types';

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
  ProfileEdit: UserInfo & UserProfile;
  Contacts: undefined;
  ChatRoom: {
    otherUserId: string;
    otherUserAvatarUrl: string;
    websocket: WebSocket;
  };
};
