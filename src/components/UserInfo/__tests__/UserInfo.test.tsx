import renderer from 'react-test-renderer';
import React from 'react';

describe('测试 Profile 界面', () => {
  beforeAll(() => {});
  beforeEach(() => {});
  afterEach(() => {});
  afterAll(() => {});

  it('should 展示所给 user 数据相对应的 user 信息', () => {
    const tree = renderer
      .create(
        <ChatListComponent
          roomId="1"
          otherUserName="Jade"
          user={{id: 'usr1', username: 'Kevin'}}
          websocket={new WebSocket(WEB_SOCKET_URL)}
          messages={[
            {
              id: '1',
              content: 'Hello',
              send_time: 1627777777777,
              sender_id: 'Jade',
              receiver_id: 'Kevin',
              isSent: false,
            },
          ]}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
