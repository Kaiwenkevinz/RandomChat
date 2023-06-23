import {
  ILoginResponse,
  IMessagePackReceive,
  MessagePackSend,
  Result,
  IUser,
} from '../../types/network/types';

export const generageMockResponse = <T>(data: T | null = null) =>
  ({
    data,
    msg: 'success',
    status: 'ok',
  } as Result<T>);

export const mockUser: IUser = {
  id: 1,
  username: 'Kevin',
  gender: 'male',
  age: 25,
  hometown: 'Mars',
  major: 'Nutural Science',
  telephone_number: '123456789',
  mail: '123@email.com',
  birthday: '1996-01-01',
  school: 'Mars University',
  mbti: 'INTJ',
  avatar_url:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG1hjynbpQaeK6JUxCK6WyZ1E5uJmjAxQncw&usqp=CAU',
};

export const mockLogin = {
  mockRequestBody: {
    username: 'Kevin',
    password: '123456',
  },
  mockResponse: generageMockResponse<ILoginResponse>({
    user: mockUser,
    token: 'jwt1234567890',
  }),
};

export const mockSendVerifyEmail = {
  mockRequestBody: {
    username: 'Kevin',
    email: '123@email.com',
  },
  mockResponse: generageMockResponse(),
};

export const mockRegister = {
  mockRequestBody: {
    username: 'Kevin',
    password: '123456',
    email: '123@email.com',
    code: 'e-m-a-i-l',
  },
  mockResponse: generageMockResponse<IUser>(),
};

export const mockUserProfile = {
  mockResponse: generageMockResponse<IUser>(mockUser),
};

export const generateMockChatMessage = (
  id: string,
  content: string,
  sender_id: number = 200,
  receiver_id: number = 1,
  type = 'text',
) => {
  return {
    id,
    message_type: type,
    content,
    sender_id,
    receiver_id,
    send_time: '2023-04-08T08:07:23.000+00:00',
  } as IMessagePackReceive;
};

export const mockAllFriendAllChatMessages = {
  mockRequestBody: {
    id: 1,
  },
  mockResponse: generageMockResponse([
    {
      otherUserId: 200,
      otherUserName: 'Novu Hangouts',
      otherUserAvatarUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-6fdvJtz4yfmwA5pVvP7Q-o-i-tSnp8lapNonInKuREA7eXL95wpwlh9kYx4dalUI5uQ&usqp=CAU',
      hasUnreadMessage: false,
      messages: [
        generateMockChatMessage('1a', 'Hello, my name is Novu', 200, 1),
        generateMockChatMessage('1b', 'Hi Novu, my name is Kevin! 😇', 1, 200),
        generateMockChatMessage(
          '2a',
          'https://picsum.photos/200/300',
          1,
          200,
          'image',
        ),
        generateMockChatMessage(
          '3a',
          'https://picsum.photos/200/300',
          200,
          1,
          'image',
        ),
      ],
    },
    {
      otherUserId: 300,
      otherUserName: 'Alex',
      otherUserAvatarUrl: null,
      hasUnreadMessage: true,
      messages: [
        generateMockChatMessage('1a', 'Hello, 我是一条很长的他人的消息'),
      ],
    },
  ]),
};

export const mockSendNewMessage: MessagePackSend = {
  id: 'new-message-id',
  type: 'text',
  content: 'This is new message from user id 200',
  fromId: 200,
  toId: 1,
  isGroup: 0,
};

export const mockUploadImageRepsonse: Result<string> = generageMockResponse(
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEZ89N0rGa9eYLJ4sK5rgg5IrIPtAa-pvXRANZ4JIG2b-D_83D7VElzIHfbh-SOOFbAic&usqp=CAU',
);
