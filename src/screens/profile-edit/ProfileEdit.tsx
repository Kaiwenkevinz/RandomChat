import {Text, TextInput, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/navigation/types';
import {ScrollView} from 'react-native-gesture-handler';
import {
  genderItems,
  homeTownItems,
  majorItems,
  mbtiItems,
  schoolItems,
} from './constant';
import {userService} from '../../network/lib/user';
import {useNavigation} from '@react-navigation/native';
import {showToast, toastType} from '../../utils/toastUtil';
import eventEmitter from '../../services/event-emitter';
import {EVENT_UPDATE_USER_PROFILE} from '../../services/event-emitter/constants';
import {IUser} from '../../types/network/types';
import DebounceButton from '../../components/DebounceButton';
import {Dropdown} from '../../components/Dropdown';
import DatePicker from 'react-native-date-picker';

type ProfileEditProps = StackScreenProps<RootStackParamList, 'ProfileEdit'>;

const ProfileEdit = ({route}: ProfileEditProps) => {
  const navigation = useNavigation();
  const params = route.params;
  const [userObj, setUserObj] = useState<IUser>({
    ...params,
  });

  const [loading, setLoading] = useState(false);

  const [mbtiValue, setMbtiValue] = useState(mbtiItems[0].value);
  const [homeTownValue, setHomeTownValue] = useState(homeTownItems[0].value);
  const [genderValue, setGenderValue] = useState(genderItems[0].value);
  const [schoolValue, setSchoolValue] = useState(schoolItems[0].value);
  const [majorValue, setMajorValue] = useState(majorItems[0].value);
  const [age, setAge] = useState(userObj.age?.toString() || '0');

  const [birthday, setBirthday] = useState(new Date());
  const [birthdayPickerOpen, setBirthdayPickerOpen] = useState(false);

  const handleOnPress = () => {
    const newUserObj = {
      ...userObj,
      gender: genderValue,
      school: schoolValue,
      major: majorValue,
      age: parseInt(age, 10) || 0,
      birthday: birthday.toISOString(),
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

        <Text style={styles.label}>Birthday</Text>
        <Text
          style={styles.input}
          onPress={() => {
            setBirthdayPickerOpen(true);
          }}>
          {birthday.toLocaleDateString()}
        </Text>
        <DatePicker
          modal
          mode="date"
          open={birthdayPickerOpen}
          date={birthday}
          onConfirm={date => {
            setBirthdayPickerOpen(false);
            setBirthday(date);
          }}
          onCancel={() => {
            setBirthdayPickerOpen(false);
          }}
        />

        <Text style={styles.label}>MBTI</Text>
        <Dropdown
          onValueChange={setMbtiValue}
          items={mbtiItems}
          value={mbtiValue}
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          value={age}
          onChangeText={setAge}
        />

        <Text style={styles.label}>Gender</Text>
        <Dropdown
          onValueChange={setGenderValue}
          items={genderItems}
          value={genderValue}
        />

        <Text style={styles.label}>Home Town</Text>
        <Dropdown
          onValueChange={setHomeTownValue}
          items={homeTownItems}
          value={homeTownValue}
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
        <DebounceButton text={'Save'} handleOnPress={handleOnPress} />
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
});

export default ProfileEdit;
