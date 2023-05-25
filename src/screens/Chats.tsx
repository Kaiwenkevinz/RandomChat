import {View, Text, FlatList, Pressable} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {SafeAreaView} from 'react-navigation';
import {styles} from '../utils/styles';
import {ChatComponent} from '../network/components/ChatComponent';

const Chats = () => {
  //👇🏻 Dummy list of rooms
  const rooms = [
    {
      id: '1',
      user: 'Novu Hangouts',
      messages: [
        {
          id: '1a',
          text: 'Hello, my name is Novu',
          time: 1684930783,
          user: 'Novu Hangouts',
        },
        {
          id: '1b',
          text: 'Hi Novu, thank you! 😇',
          time: 1684930951,
          user: 'David',
        },
      ],
    },
    {
      id: '2',
      user: 'Jade',
      messages: [
        {
          id: '2a',
          text: "I am Jade, How's it going?",
          time: 1684930951,
          user: 'Jade',
        },
        {
          id: '2b',
          text: "What's up? 🧑🏻‍💻",
          time: 1684930951,
          user: 'David',
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.chatscreen}>
      <View style={styles.chatlistContainer}>
        {rooms.length > 0 ? (
          <FlatList
            data={rooms}
            renderItem={({item}) => <ChatComponent item={item} />}
            keyExtractor={item => item.id}
          />
        ) : (
          <View style={styles.chatemptyContainer}>
            <Text style={styles.chatemptyText}>Chats is empty.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Chats;
