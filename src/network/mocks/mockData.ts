import {LoginResponse, User} from '../../types/network/types';

export const generageMockResponse = <T>(data: T | null = null) => ({
  data,
  msg: 'success',
  status: 200,
});

export const mockUser: User = {
  id: 100,
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
  mockResponse: generageMockResponse<LoginResponse>({
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
  mockResponse: generageMockResponse<User>(),
};
