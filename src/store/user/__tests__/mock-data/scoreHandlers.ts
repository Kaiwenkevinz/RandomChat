import {rest} from 'msw';
import {API_GET_SCORES} from '../../../../network/constant';
import {generateMockResponse} from '../../../../network/mocks/mockData';
import {IScoreResponse} from '../../../../types/network/types';
import server from '../../../../services/jest/server';

const handlers = [
  rest.post('http://localhost' + API_GET_SCORES, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        generateMockResponse<IScoreResponse[]>([
          {userId: 1, score: 100},
          {userId: 2, score: 200},
        ]),
      ),
    );
  }),
];

export const setupScoreHandlers = () => {
  server.use(...handlers);
};
