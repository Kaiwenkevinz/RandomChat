import {rest} from 'msw';
import {API_GET_USER_INFO} from '../../../../network/constant';
import {generateMockResponse} from '../../../../network/mocks/mockData';
import {IUser} from '../../../../types/network/types';
import server from '../../../../services/jest/server';

const handlers = [
  rest.post('http://localhost' + API_GET_USER_INFO, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(generateMockResponse<IUser>({id: 1, avatar_url: undefined})),
    );
  }),
];

export const setupUserProfileHandlers = () => {
  server.use(...handlers);
};
