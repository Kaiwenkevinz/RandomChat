import {IPagination, IMessagePackReceive} from './../../types/network/types';
import {
  ILoginResponse,
  MessagePackSend,
  Result,
  IUser,
  IScoreResponse,
} from '../../types/network/types';

export const generageMockResponse = <T>(data: T | null = null) =>
  ({
    data,
    msg: 'success',
    status: 'ok',
  } as Result<T>);

export const mockUser: IUser = {
  id: 1,
  role: '美妆',
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

/**
 * 生成十条聊天记录
 */
const generateMockMessageHistory = (
  myId: number,
  otherId: number,
  page: number,
  size: number,
) => {
  const res = [];
  for (let i = 0; i < 50; i++) {
    let from;
    let to;
    let fromName;
    let otherName;
    if (i % 2 === 0) {
      from = myId;
      to = otherId;
      fromName = 'Kevin';
      otherName = 'Alex';
    } else {
      from = otherId;
      to = myId;
      fromName = 'Alex';
      otherName = 'Kevin';
    }
    res.push(
      generateMockChatMessage(
        `${i}`,
        `Hi ${otherName}. I am ${i} th message. I am ${fromName}`,
        from,
        to,
      ),
    );
  }

  const data = res.slice(page * size, page * size + size);
  const paginationObj: IPagination<IMessagePackReceive[]> = {
    total: 30,
    pageSize: 10,
    page: 1,
    data,
  };

  return paginationObj;
};

export const mockMessageHistory = {
  mockResponse: generageMockResponse(generateMockMessageHistory(1, 300, 1, 10)),
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
      messages: [
        generateMockChatMessage('1a', 'Hello, my name is Novu', 200, 1),
        generateMockChatMessage('1b', 'Hi Novu, my name is Kevin!', 1, 200),
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
        generateMockChatMessage(
          '4a',
          '这是一很长条很长很长很长很长很长很长的消息',
          1,
          200,
        ),
      ],
    },
    {
      otherUserId: 300,
      otherUserName: 'Alex',
      otherUserAvatarUrl: null,
      messages: [
        generateMockChatMessage('1a', 'Hello, 我Kevin', 1, 300),
        generateMockChatMessage('1b', 'Hello, 我Alex', 300, 1),
      ],
    },
  ]),
};

export const mockSendNewMessage: MessagePackSend = {
  id: 'new-message-id',
  type: 'text',
  content: 'This is new message from user id 200',
  sender_avatar_url: 'https://picsum.photos/200/300',
  sender_name: 'Novu Hangouts',
  fromId: 200,
  toId: 1,
  isGroup: 0,
};

export const mockUploadImageRepsonse: Result<string> = generageMockResponse(
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEZ89N0rGa9eYLJ4sK5rgg5IrIPtAa-pvXRANZ4JIG2b-D_83D7VElzIHfbh-SOOFbAic&usqp=CAU',
);

const generateMockFriend = (
  id: number,
  username: string,
  avatar_url: string,
): IUser => {
  return {
    id,
    username,
    gender: 'male',
    age: 34,
    hometown: 'Mars' + id,
    major: 'Nutural Science' + id,
    telephone_number: '123456789',
    mail: id + '@email.com',
    birthday: '1996-01-01',
    school: 'Mars University' + id,
    mbti: 'INTJ' + id,
    avatar_url,
  };
};

export const mockFriendList = {
  mockResponse: generageMockResponse<IUser[]>([
    generateMockFriend(
      300,
      'Jack',
      'https://www.shutterstock.com/image-vector/man-character-face-avatar-glasses-260nw-562077406.jpg',
    ),
    generateMockFriend(
      200,
      'Yudia',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjxv0lgOtSOUpJs1kJnib1w_XYBOehqRnrC-CqLQ2trA&s',
    ),
  ]),
};

export const mockScores = {
  mockResponse: generageMockResponse<IScoreResponse[]>([
    {userId: 200, score: 19900},
    {userId: 300, score: 2000},
  ]),
};
