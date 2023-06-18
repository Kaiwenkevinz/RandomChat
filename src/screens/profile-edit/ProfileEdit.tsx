import {Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/navigation/types';
import {ScrollView} from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import {genderItems, majorItems, schoolItems} from './constant';
import {userService} from '../../network/lib/user';
import {useNavigation} from '@react-navigation/native';
import {showToast, toastType} from '../../utils/toastUtil';
import eventEmitter from '../../services/event-emitter';
import {EVENT_UPDATE_USER_PROFILE} from '../../services/event-emitter/constants';
import {User} from '../../types/network/types';

type ProfileEditProps = StackScreenProps<RootStackParamList, 'ProfileEdit'>;

// TODO: 抽取 Dropdown 组件
interface DropdownProps {
  onValueChange: (value: string) => void;
  items: {label: string; value: string}[];
  value: string;
}

export const Dropdown = (props: DropdownProps) => {
  const {onValueChange, items, value} = props;

  return (
    <RNPickerSelect
      onValueChange={v => {
        onValueChange(v);
      }}
      value={value}
      items={items}
    />
  );
};

const ProfileEdit = ({route}: ProfileEditProps) => {
  const navigation = useNavigation();
  const params = route.params;
  const [userObj, setUserObj] = useState<User>({
    ...params,
  });

  const [loading, setLoading] = useState(false);

  const [genderValue, setGenderValue] = useState(genderItems[0].value);
  const [schoolValue, setSchoolValue] = useState(schoolItems[0].value);
  const [majorValue, setMajorValue] = useState(majorItems[0].value);

  const handleOnPress = () => {
    const newUserObj = {
      ...userObj,
      gender: genderValue,
      school: schoolValue,
      major: majorValue,
    };
    setLoading(true);
    userService
      .updateUserProfile(newUserObj)
      .then(() => {
        eventEmitter.emit(EVENT_UPDATE_USER_PROFILE);
        showToast(toastType.SUCCESS, '', 'Update profile successfully');
        navigation.goBack();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {loading ? <Text>Loading...</Text> : null}
      <ScrollView style={styles.container}>
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
          value={userObj.age?.toString()}
          onChangeText={e => {
            userObj.age = parseInt(e, 10);
            setUserObj({...userObj});
          }}
        />

        <Text style={styles.label}>Gender</Text>
        <Dropdown
          onValueChange={setGenderValue}
          items={genderItems}
          value={genderValue}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          value={userObj.telephone_number}
          onChangeText={e => {
            userObj.telephone_number = e;
            setUserObj({...userObj});
          }}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={userObj.mail}
          onChangeText={e => {
            userObj.username = e;
            setUserObj({...userObj});
          }}
        />

        <Text style={styles.label}>School</Text>
        <Dropdown
          onValueChange={setSchoolValue}
          items={schoolItems}
          value={schoolValue}
        />

        <Text style={styles.label}>Major</Text>
        <Dropdown
          onValueChange={setMajorValue}
          items={majorItems}
          value={majorValue}
        />
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText} onPress={handleOnPress}>
          Save
        </Text>
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
