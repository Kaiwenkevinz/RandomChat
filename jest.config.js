/** @type {import('jest').Config} */
const config = {
  preset: 'react-native',
  transform: {
    '.(ts|tsx)$': 'ts-jest',
    '.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [],
  testEnvironment: 'node',
};

module.exports = config;
