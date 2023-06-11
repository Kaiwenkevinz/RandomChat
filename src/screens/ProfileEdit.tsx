import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation/types';
import {UserInfo, UserProfile} from '../types/network/types';
import {ScrollView} from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';

type ProfileEditProps = StackScreenProps<RootStackParamList, 'ProfileEdit'>;
type UserType = UserInfo & UserProfile;

// TOOD: implement this Dropdown
export const Dropdown = () => {
  return (
    <RNPickerSelect
      onValueChange={value => console.log(value)}
      value={'football'}
      items={[
        {label: 'Football', value: 'football'},
        {label: 'Baseball', value: 'baseball'},
        {label: 'Hockey', value: 'hockey'},
      ]}
    />
  );
};

const ProfileEdit = ({route}: ProfileEditProps) => {
  const params = route.params;
  const [userObj, setUserObj] = useState<UserType>({
    ...params,
  });

  return (
    <>
      <ScrollView style={styles.container}>
        {/* <Dropdown /> */}

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={userObj.username}
          onChangeText={e => {
            userObj.username = e;
            setUserObj({...userObj});
          }}
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          value={userObj.age.toString()}
          onChangeText={e => {
            userObj.age = e;
            setUserObj({...userObj});
          }}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          value={userObj.contactNumber}
          onChangeText={e => {
            userObj.contactNumber = e;
            setUserObj({...userObj});
          }}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={userObj.email}
          onChangeText={e => {
            userObj.username = e;
            setUserObj({...userObj});
          }}
        />

        <Text style={styles.label}>School</Text>
        <TextInput
          style={styles.input}
          value={userObj.school}
          onChangeText={e => {
            userObj.school = e;
            setUserObj({...userObj});
          }}
        />

        <Text style={styles.label}>Major</Text>
        <TextInput
          style={styles.input}
          value={userObj.major}
          onChangeText={e => {
            userObj.major = e;
            setUserObj({...userObj});
          }}
        />
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    height: 50,
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
    padding: 10,
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

export default ProfileEdit;
