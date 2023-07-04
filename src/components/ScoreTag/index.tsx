import React from 'react';
import TagComponent from '../TagComponent/TagComponent';
import {View} from 'react-native';

interface TagComponentProps {
  score: number;
  threshold: number;
}

const ScoreTag = ({score, threshold}: TagComponentProps) => {
  return (
    <View>
      {score > threshold ? (
        <TagComponent text={'\u{2B50}'} backgroundColor="#fff" />
      ) : (
        <TagComponent text={score.toString()} />
      )}
    </View>
  );
};

export default ScoreTag;
