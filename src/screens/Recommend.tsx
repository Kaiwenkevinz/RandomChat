import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import ContactListComponent from '../components/ContactListComponent';
import {userService} from '../network/lib/user';
import {IUser} from '../types/network/types';

const Recommend = () => {
  const [loading, setIsLoading] = useState(false);
  const [recommendList, setRecommendList] = useState<IUser[]>([]);

  const getRecommendList = async () => {
    setIsLoading(true);
    const res = await userService.getRecommendFriendList();
    setRecommendList(res.data);
    setIsLoading(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={getRecommendList}>
        <Text style={styles.buttonText}>Get Recommendation</Text>
      </TouchableOpacity>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={recommendList}
          renderItem={({item}) => <ContactListComponent user={item} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Recommend;
