import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
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
import {IUser} from '../../types/network/types';

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
      style={pickerSelectStyles}
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
  const [userObj, setUserObj] = useState<IUser>({
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
      .then(
        () => {
          eventEmitter.emit(EVENT_UPDATE_USER_PROFILE);
          showToast(toastType.SUCCESS, '', 'Update profile successfully');
          navigation.goBack();
        },
        err => {
          showToast(toastType.ERROR, '', err.message);
        },
      )
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {loading ? <Text>Loading...</Text> : null}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={userObj.username}
          onChangeText={e => {
            setUserObj({...userObj, username: e});
          }}
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          value={userObj.age?.toString()}
          onChangeText={e => {
            setUserObj({...userObj, age: parseInt(e, 10)});
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
            setUserObj({...userObj, telephone_number: e});
          }}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={userObj.mail}
          onChangeText={e => {
            setUserObj({...userObj, mail: e});
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

      <View style={{backgroundColor: '#fff'}}>
        <TouchableOpacity style={styles.button} onPress={handleOnPress}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 12,
  },
  input: {
    height: 40,
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 16,
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    fontSize: 16,
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  inputAndroid: {
    height: 50,
    fontSize: 16,
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  placeholder: {
    color: '#9EA0A4',
    fontWeight: 'bold',
  },
});

export default ProfileEdit;
