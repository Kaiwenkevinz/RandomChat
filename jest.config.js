/** @type {import('jest').Config} */
const config = {
  preset: 'react-native',
  setupFiles: ['./jestSetupFile.js'],
  transform: {
    '.(ts|tsx)$': 'babel-jest',
    '.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [],
  // 是否显示覆盖率报告
  collectCoverage: true,
  // 告诉 Jest 哪些文件需要经过单元测试测试
  collectCoverageFrom: ['**/*.ts', '**/*.tsx', '!**/node_modules/**'],
};

module.exports = config;
