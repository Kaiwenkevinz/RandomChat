/** @type {import('jest').Config} */
const config = {
  preset: 'react-native',
  setupFiles: ['./jestSetupFile.js'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
};

module.exports = config;
