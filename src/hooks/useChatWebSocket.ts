import {useEffect, useRef} from 'react';
import {WEB_SOCKET_URL} from '../constant';

const useChatWebSocket = () => {
  const webSocketRef = useRef<WebSocket>(new WebSocket(WEB_SOCKET_URL));

  useEffect(() => {
    const webSocket = webSocketRef.current;
    webSocket.onopen = () => {
      webSocket.send('WebSocket Client Connected');
    };
    webSocket.onmessage = e => {
      console.log(e);
    };
    webSocket.onclose = () => {
      console.log('WebSocket Client Disconnected');
    };
    return () => {
      webSocket.close();
    };
  }, []);
};

export {useChatWebSocket};
