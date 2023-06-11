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
  Contacts: undefined;
  ChatRoom: {
    otherUserId: string;
    websocket: WebSocket;
  };
};
