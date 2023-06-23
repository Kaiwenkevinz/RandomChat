/**
 * WebSocket 单例
 */
export class WebSocketSingleton {
  private static instance: WebSocketSingleton | null = null;
  public ws: WebSocket;

  private constructor(url: string, token: string) {
    this.ws = new WebSocket(url, null, {
      headers: {Authorization: `Bearer ${token}`},
    });
    console.log('WebSocket url: ', url);

    this.ws.onopen = () => {
      console.log('WebSocket 连接已打开');
    };

    this.ws.onclose = event => {
      console.warn('WebSocket 连接已关闭：', event.code, event.reason);
    };

    this.ws.onerror = error => {
      console.error('WebSocket 错误：', error.message);
    };
  }

  public static initWebsocket(url: string, token: string): WebSocketSingleton {
    if (!WebSocketSingleton.instance) {
      WebSocketSingleton.instance = new WebSocketSingleton(url, token);
    }

    return WebSocketSingleton.instance;
  }

  public static getWebsocket(): WebSocket | undefined {
    return WebSocketSingleton.instance?.ws;
  }
}