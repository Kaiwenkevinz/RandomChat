import renderer from 'react-test-renderer';
import React from 'react';
import TagComponent from '../TagComponent';

it('renders correctly', () => {
  const tree = renderer.create(<TagComponent text="tag text" />).toJSON();
  expect(tree).toMatchSnapshot();
});
