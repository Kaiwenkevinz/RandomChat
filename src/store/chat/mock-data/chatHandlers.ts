import {rest} from 'msw';
import {API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES} from '../../../network/constant';
import {
  generateMockChatMessage,
  generateMockResponse,
} from '../../../network/mocks/mockData';
import server from '../../../services/jest/server';

const mockChatMessages = generateMockResponse([
  {
    otherUserId: 200,
    otherUserName: 'Novu Hangouts',
    otherUserAvatarUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-6fdvJtz4yfmwA5pVvP7Q-o-i-tSnp8lapNonInKuREA7eXL95wpwlh9kYx4dalUI5uQ&usqp=CAU',
    total: 2,
    messages: [
      generateMockChatMessage('1a', 'Hello, my name is Novu', 200, 1),
      generateMockChatMessage('1b', 'Hi Novu, my name is Kevin!', 1, 200),
    ],
  },
  {
    otherUserId: 300,
    otherUserName: 'Alex',
    otherUserAvatarUrl: null,
    total: 1,
    messages: [generateMockChatMessage('1a', 'How are you?', 300, 1)],
  },
]);
const handlers = [
  rest.post(
    'http://localhost' + API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES,
    async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(mockChatMessages));
    },
  ),
];

export const setupChatHandlers = () => {
  server.use(...handlers);
};
