import {CONFIG} from '../config';

export const isDevEnvironment = () => {
  return process.env.NODE_ENV === 'development';
};

export const isTurnOnMockAPI = () => {
  return isDevEnvironment() && CONFIG.TURN_ON_MOCK_API === '1';
};

export const mockAPI = () => {
  require('../network/mocks/mockAPI');
};
