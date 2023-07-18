import {IPagination, IMessagePackReceive} from './../../types/network/types';
import {
  ILoginResponse,
  MessagePackSend,
  Result,
  IUser,
  IScoreResponse,
} from '../../types/network/types';

export const generateMockResponse = <T>(data: T | null = null) =>
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
  mockResponse: generateMockResponse<ILoginResponse>({
    user: mockUser,
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVfc2VjIjoiOTk5OTk5OTk5OSJ9.xAx38x7ALIEQRX7mLjqPa2E4iYj8QHGvEMl2PvrRM5s',
  }),
};

export const mockSendVerifyEmail = {
  mockRequestBody: {
    username: 'Kevin',
    email: '123@email.com',
  },
  mockResponse: generateMockResponse(),
};

export const mockRegister = {
  mockRequestBody: {
    username: 'Kevin',
    password: '123456',
    email: '123@email.com',
    code: 'e-m-a-i-l',
  },
  mockResponse: generateMockResponse<IUser>(),
};

export const mockUserProfile = {
  mockResponse: generateMockResponse<IUser>(mockUser),
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
  mockResponse: generateMockResponse(generateMockMessageHistory(1, 300, 1, 10)),
};

export const mockAllFriendAllChatMessages = {
  mockRequestBody: {
    id: 1,
  },
  mockResponse: generateMockResponse([
    {
      otherUserId: 200,
      otherUserName: 'Novu Hangouts',
      otherUserAvatarUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-6fdvJtz4yfmwA5pVvP7Q-o-i-tSnp8lapNonInKuREA7eXL95wpwlh9kYx4dalUI5uQ&usqp=CAU',
      total: 30,
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
      total: 1,
      messages: [generateMockChatMessage('1a', 'How are you?', 300, 1)],
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

export const mockUploadImageRepsonse: Result<string> = generateMockResponse(
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
  mockResponse: generateMockResponse<IUser[]>([
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
  mockResponse: generateMockResponse<IScoreResponse[]>([
    {userId: 200, score: 19900},
    {userId: 300, score: 2000},
  ]),
};

export const mockPhotoWall = {
  mockResponse: generateMockResponse<string[]>([
    'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg',
    'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8M3x8fGVufDB8fHx8fA%3D%3D&w=1000&q=80',
    'https://img.freepik.com/premium-photo/image-colorful-galaxy-sky-generative-ai_791316-9864.jpg?w=2000',
  ]),
};
