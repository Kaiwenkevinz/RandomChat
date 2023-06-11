import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {store} from '../store/store';
import {getUserProfileAsync, selectUser} from '../store/userSlice';
import {useAppSelector} from '../hooks/customReduxHooks';
import {ScrollView} from 'react-native-gesture-handler';

const Profile = () => {
  const userStore = useAppSelector(selectUser);
  const {userInfo, userProfile, status} = userStore;

  useEffect(() => {
    store.dispatch(getUserProfileAsync());
  }, []);

  return (
    // TODO: 增加基础的 UI 界面
    <>
      {status === 'loading' ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView style={styles.container}>
          <Text style={styles.label}>Id:</Text>
          <Text style={styles.value}>{userInfo.id}</Text>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{userInfo.username}</Text>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{userProfile.gender}</Text>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{userProfile.age}</Text>
          <Text style={styles.label}>Hometown:</Text>
          <Text style={styles.value}>{userProfile.hometown}</Text>
          <Text style={styles.label}>Major:</Text>
          <Text style={styles.value}>{userProfile.major}</Text>
          <Text style={styles.label}>Birthday:</Text>
          <Text style={styles.value}>{userProfile.birthday}</Text>
          <Text style={styles.label}>School:</Text>
          <Text style={styles.value}>{userProfile.school}</Text>
          <Text style={styles.label}>MBTI:</Text>
          <Text style={styles.value}>{userProfile.mbti}</Text>
          <TouchableOpacity>
            <Text>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
});

export default Profile;
