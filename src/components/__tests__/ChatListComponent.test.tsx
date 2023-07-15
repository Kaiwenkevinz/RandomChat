import renderer from 'react-test-renderer';
import React from 'react';
import TagComponent from '../TagComponent/TagComponent';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: jest.fn()}),
}));

xit('renders correctly', () => {
  const tree = renderer.create(<TagComponent text="Tag" />).toJSON();
  expect(tree).toMatchSnapshot();
});
