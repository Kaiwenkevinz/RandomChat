import {View, Text} from 'react-native';
import React, {useEffect} from 'react';

const ChatRoom = () => {
  useEffect(() => {
    const ws = new WebSocket('ws://host.com/path');

    ws.onopen = () => {
      // connection opened
      ws.send('something'); // send a message
    };

    ws.onmessage = e => {
      // a message was received
      console.log(e.data);
    };

    ws.onerror = e => {
      // an error occurred
      console.log(e.message);
    };

    ws.onclose = e => {
      // connection closed
      console.log(e.code, e.reason);
    };
  }, []);
  return (
    <View>
      <Text>ChatRoom</Text>
    </View>
  );
};

export default ChatRoom;
