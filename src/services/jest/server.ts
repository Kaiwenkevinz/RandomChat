import {setupServer} from 'msw/node';
import {commonHandlers} from './commonMswHandlers';

const server = setupServer(...commonHandlers);

export default server;
