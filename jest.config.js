/** @type {import('jest').Config} */
const config = {
  preset: 'react-native',
  setupFiles: ['./jestSetupFile.js'],
  transform: {
    '.(ts|tsx)$': 'babel-jest',
    '.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [],
};

module.exports = config;
