/** @type {import('jest').Config} */
const config = {
  preset: 'react-native',
  setupFiles: ['./jestSetupFile.js'],
  transform: {
    '.(ts|tsx)$': 'ts-jest',
    '.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [],
};

module.exports = config;
