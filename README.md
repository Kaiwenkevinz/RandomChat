# 项目介绍

该项目以 React Native 为基本框架，实现了一个聊天交友 APP。系统根据个人资料为用户匹配陌生人并开启聊天，通过亲密度机制，陌生人可以变为永久好友，或者移除聊天室。该 APP 实现了滚动加载、单点聊天、注册登录等功能。

# 项目展示

编写中。。

# 安装和运行

## 安装并运行前端

安装相关 JS 环境依赖和原生依赖，然后运行

```shell
# 在根目录下
npm install
npx pod-install
npm start
```

或者运行下列命令行，安装所有依赖并运行

```shell
# 在根目录下
npm rebuild
```

项目使用 `axios-mock-adapter` 模拟除了 `WebSocket` 的所有后端请求，可以在 `.env` 中开启和关闭 mock 请求
![Pasted image 20230715151030](https://github.com/Kaiwenkevinz/RandomChat/assets/22761218/8a4f5287-2f77-4db7-95ca-ccdb94395d88)

## 安装并运行后端，用于模拟 WebSocket

安装 node 环境依赖并开启 WebSocket 连接

```shell
# 在 /server 目录下
npm install
npm start
```

# 设计文档

### 开发工具

项目使用 Visual Studio Code 作为代码编辑器，使用 react-native-debugger 调试 APP，使用 Postman 调试后端接口。

### 项目架构
<img width="428" alt="1" src="https://github.com/Kaiwenkevinz/RandomChat/assets/22761218/a76bb9a7-5791-47ba-a542-c23cd61f8589">

### 前后端交互图
<img width="683" alt="2" src="https://github.com/Kaiwenkevinz/RandomChat/assets/22761218/34979a93-4395-4965-9a79-a712df5de382">

### 项目文件结构

- `/android` - 安卓原生相关代码
- `/ios` -iOS 原生相关代码
- `/assets` - 图片
- `/server` - 用于 mock WebSocket
- `/src` - React Native 相关代码
- `.env` - 开发环境、API base URL 等相关配置

在 `src/` 目录中，项目文件分为如下结构：

- `/components` - 公共 UI 组件
- `/config` - 环境配置开关
- `/hooks` - 自定义 hooks
- `/navigation` - 路由页面跳转相关
- `/network` - 网络请求封装和相关配置
- `/screens` - UI 界面
- `/services` - 全局 service 如 event bus
- `/store` - Redux 状态管理
- `/types` - TypeScript 类型定义
- `/utils` - 工具类

## 关键功能设计

### 登录注册

我们使用 JWT 来维护用户登录态，APP 通过登录接口获得 JWT 后会保存在本地，并在调用业务接口的时候传给后端，当 JWT 失效时，后端会返回 http 401 code，APP 会回到登录页要求用户重新登录。

### 启动页

为了提高用户使用体验感，我们使用启动页来判断用户登录态和预加载数据。

<img width="424" alt="image" src="https://github.com/Kaiwenkevinz/RandomChat/assets/22761218/dd8f24e0-b79d-49af-92b0-18e5376c8afe">

冷启动 APP 时，启动页负责检查用户登录态是否过期，如果过期，则隐藏启动页并跳转到登录页面。否则，拉取进入 Home Screen 前所需要的所有数据，然后隐藏启动页，最后进入 Home Screen。

### 网络请求封装

我们使用 Axios 进行除了图片上传之外的所有网络请求，为了在编写代码时获得更好的类型检查和代码提示，我们使用 TypeScript 对 Axios 进行了封装，同时也配置了拦截器，用于处理 HTTP 错误码和后端自定义错误码。

如下图，我们使用 TypeScript 的泛型来封装 Axios 的 get 方法，这样在编写代码阶段，代码编辑器就可以提供类型检查和代码提示了。 post、put、delete 方法的封装是类似的。

<img width="637" alt="image" src="https://github.com/Kaiwenkevinz/RandomChat/assets/22761218/8a34393a-7c5e-4407-8182-1fa1db8e221a">

### 图片上传

通常上传多媒体文件 (如图片)，需要将文件转换为 blob (Binary large object) 后再进行上传。因为 React Native 本身不提供 blob 文件操作 (reference)，所以本项目使用 `react-native-fetch-blob` 进行来图片上传。
好处是 `react-native-fetch-blob` 已经封装好了 blob 操作和多媒体文件上传。
坏处是不能通过 Axios 拦截器获取到 API 调用信息，也不能通过 Axios adapter 来模拟后端返回，这点我们可以推动后端开一个专门用来上传图片 test 环境来解决。

<img width="695" alt="image" src="https://github.com/Kaiwenkevinz/RandomChat/assets/22761218/6045fd20-fe34-4405-bab1-6968a1d2644c">

图片文字来源: [`react-native-fetch-blob`](https://www.npmjs.com/package/react-native-fetch-blob)

### 未读聊天室

为了区分已读和未读的聊天室，我们使用了一个名为 `readRooms` 的数组来存储已读的聊天室。该数组存储已读聊天室的ID及其对应的最新消息ID。每次接收到新消息或用户进入聊天室时，我们都会更新此数组。每次更新数组时，我们会将其本地保存，以保持数据持久性。

具体而言，有三种情况需要从或更新`readRooms`数组：

1. 当应用程序启动时，获取所有聊天消息并读取`readRooms`数组。比较它们以检查是否有新的离线消息，如果有，则将相应的聊天室显示为未读聊天室。
2. 当进入一个未读的聊天室时，这意味着聊天室已读。然后，我们将房间ID和最新的消息ID添加到`readRooms`数组中。
3. 当用户发送一条消息时，相应的聊天室已读，需要更新`readRooms`数组中聊天室的最新消息ID。当用户接收到一条消息时，如果用户在相应的聊天室中，聊天室保持已读状态，否则聊天室将变为未读状态。

**刚打开 APP 时**  

从后端拉取所有聊天室和其对应的聊天记录，通过比较最新的 message id，筛选出有新的离线信息的聊天室，在 `readRooms` 中移除这些聊天室，代表这些聊天室为未读聊天室。

<img width="668" alt="image" src="https://github.com/Kaiwenkevinz/RandomChat/assets/22761218/dfd5277c-dc8e-4114-9a21-a753eabe9759">

**进入 APP 后发新消息时**  
- 刚进入聊天室，会把该聊天室置为已读聊天室。
- 发送消息时，会更新 `readRooms` 中对应的 message id 为刚刚发送的消息的 id。

<img width="545" alt="image" src="https://github.com/Kaiwenkevinz/RandomChat/assets/22761218/c163de16-8515-4e09-a683-41979fd1ec00">

**进入 APP 后收到新消息时**  
当通过 WebSocket 接收到新信息时，如果此时用户在聊天室，则该聊天室应该保持已读状态。聊天室页面通过监听 event 来更新 `readRooms`。具体流程如下：

<img width="368" alt="image" src="https://github.com/Kaiwenkevinz/RandomChat/assets/22761218/4c2b1827-10d3-463a-bd86-3ebb3c5aec87">

### 单人聊天

APP 通过 WebSocket 支持在线单人聊天。APP 冷启动时，会开启一个 WebSocket 和后端进行长连接。新的聊天信息会通过 WebSocket 发送到对应的聊天室。当收到新信息时，如果聊天室已存在，会直接加入到该聊天室。如果聊天室不存在，会创建一个新的聊天室，并显示这条新信息。
我们通过 send and acknowledge 来展示消息的发送状态。当用户发送消息到服务器时，消息的发送状态为发送中，当服务器收到消息后，消息的状态为已发送。

<img width="594" alt="image" src="https://github.com/Kaiwenkevinz/RandomChat/assets/22761218/99a3fd5f-b698-4b4e-924e-8edf6d93051e">

### 消息加密
加密的常见方式有两种：对称加密和非对称加密。我们分别给这两种加密方法设计了如下方案：

#### 方案一
使用 RSA 非对称加密，每个发送方和接收方都有一对自己的公钥和私钥，通过公钥加密，再通过对应的私钥解密。
具体流程：前端发送方使用自己的公钥对信息进行加密，发给后端，后端用自己的私钥解密后再用前端接收方的公钥加密，发给前端接收方，前端接收方使用自己的私钥解密。在我们 APP 的聊天场景中，所有的 APP 共享一份后端的公钥，后端存储所有 APP 发来的不同的公钥。

<img width="680" alt="image" src="https://github.com/Kaiwenkevinz/RandomChat/assets/22761218/c0f4cf54-94df-4650-9844-45af539c13b7">

#### 方案二
使用 AES 对称加密。AES 对称加密只需要一个密钥，使用此密钥进行加密和解密。

AES 对称加密比 RSA 非对称加密的速度更快，在聊天信息这种需要快速、高频率的传输大量信息的场景中，使用 AES 对称加密更加适合。所以我们的 APP 决定使用 AES 对称加密。关于密钥的保存方式，我们决定将密钥保存在服务器，并使用 HTTPS 协议来传输给 APP，之后通过` react-native-keychain` 保存在本地。

<img width="570" alt="image" src="https://github.com/Kaiwenkevinz/RandomChat/assets/22761218/b31682c3-5f01-48b7-8a05-7f7cc2a68bd4">

### 下拉加载更多

冷启动 APP 时，会拉取用户和所有好友的最新的 20 条聊天记录。当用户进入一个聊天室时，这些最新的聊天记录会展示。当用户想阅读更多历史聊天记录时，可以向下滑动进行分页加载，后端每次会返回 20 条聊天记录。我们通过后端返回的 `total` 字段判断是否需要加载更多的数据。如果 `total` 等于当前已经加载的消息数量，说明没有更多的消息需要加载了。

### 好友亲密度

好友亲密度功能是这款 APP 和市场上大部分其它即时通讯不同的地方。我们希望通过好友亲密度来鼓励用户多进行聊天。
每当用户和好友交换信息，或者每过一段时间（比如一天），好友亲密度会刷新。如果亲密度大于一定的阈值，双方会变为永久好友，如果亲密度小于一定阈值，用户会和该好友解除好友关系，相关聊天室会被移除。APP 会在冷启动、发送和接收信息时调用对应接口获取最新的好友亲密度。

### 接入 ChatGPT
我们接入了 ChatGPT，以让用户可以运用大语言模型来提高和其他人的聊天体验。
APP 只负责将用户需要分析的某一条聊天信息传输到后端，后端通过 prompt engineering 和调用大语言模型来获取结果，然后传给 APP 并显示到用户输入框中，用户可以自行修改并发送。


