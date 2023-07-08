import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import TagComponent from '../TagComponent/TagComponent';

interface UserInfoProps {
  username?: string;
  tags?: string[];
  age?: number;
  birthday?: string;
  gender?: string;
  hometown?: string;
  email?: string;
  major?: string;
  mbti?: string;
  school?: string;
  telephoneNumber?: string;
}

const UserInfo = (props: UserInfoProps) => {
  let {
    username,
    tags,
    age,
    birthday,
    gender,
    hometown,
    email,
    major,
    mbti,
    school,
    telephoneNumber,
  } = props;

  if (!tags) {
    tags = [];
  }

  const renderField = (label: string, value?: string) => {
    if (value && value !== '') {
      return (
        <View>
          <Text style={styles.label}>{label + ':'}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {renderField('Name', username)}
      {tags.length > 0 && (
        <View>
          <Text style={styles.label}>Tags:</Text>
          <View style={styles.tagContainer}>
            {tags.map((tag, idx) => (
              <TagComponent key={idx} text={tag} />
            ))}
          </View>
        </View>
      )}
      {renderField('MBTI', mbti)}
      {renderField('Gender', gender)}
      {renderField('Age', !age ? undefined : age.toString())}
      {renderField('Hometown', hometown)}
      {renderField('Email', email)}
      {renderField('Major', major)}
      {renderField('Birthday', birthday)}
      {renderField('School', school)}
      {renderField('Phone Number', telephoneNumber)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UserInfo;
