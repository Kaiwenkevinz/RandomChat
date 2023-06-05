/**
 * Define the types of navigation params here.
 */

import {User} from '../network/types';

export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  HomeTab: undefined;
  Chats: undefined;
  Search: undefined;
  Profile: undefined;
  Contacts: undefined;
  ChatRoom: {
    roomId: string;
    otherUserId: string;
    user: User;
    websocket: WebSocket;
  };
};
