# 项目介绍

该项目以 React Native 为基本框架，实现了一个聊天交友 APP。系统根据个人资料为用户匹配陌生人并开启聊天，通过亲密度机制，陌生人可以变为永久好友，或者移除聊天室。该 APP 实现了滚动加载、单点聊天、注册登录等功能。

# 项目展示

编写中。。

# 安装和运行

## 安装运行前端

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

## 安装运行后端依赖模拟 WebSocket

安装 Node 环境相关依赖，并开启 WebSocket

```shell
# 在 /server 目录下
npm install
npm start
```

# 设计文档

为了让我们的 APP 支持 IOS 和 Android 平台，再加上我们的技术人员有限，且唯一的前端人员(我) 有 React 经验，所以我们使用 React Native 进行开发。

### 开发工具

项目使用 Visual Studio Code 作为代码编辑器，使用 react-native-debugger 调试 APP，使用 Postman 调试后端接口。

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

我们使用 JWT 来进行用户登录态的验证，APP 通过登录接口获得 JWT 后会保存在本地，并在调用业务接口的时候传给后端。


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

### 聊天室未读

通过 readRooms 数组来维护聊天室的已读未读状态，并在每次增删 readRooms 数组后保存到 local storage 来实现聊天室已读未读状态的持久化。

readRooms 数组保存了 `IReadRoom` 对象，该对象保存了已读的聊天室 id，和此聊天室最新的 message id。

以下三种情况发生时会对 local storage 中的 readRooms 进行读取或维护

- 启动 APP 时，读取所有 readRooms
- APP 开启状态，发出或接收新消息时，更新 readRooms
- 进入一个未读聊天室时，readRoom 增加该聊天室 id 和最新 message id

**刚打开 APP 时**
fetch all chat message 获取所有聊天室和对应的聊天记录，移除 readRoom 中读取状态为未读的聊天室

<img width="668" alt="image" src="https://github.com/Kaiwenkevinz/RandomChat/assets/22761218/dfd5277c-dc8e-4114-9a21-a753eabe9759">


**进入 APP 后发新消息时**

- 刚进入聊天室，会把该聊天室置为已读聊天室。
- 发送消息时，会更新 readRooms 中对应的 message id 为刚刚发送的消息的 id。

<img width="545" alt="image" src="https://github.com/Kaiwenkevinz/RandomChat/assets/22761218/c163de16-8515-4e09-a683-41979fd1ec00">

**进入 APP 后收到新消息时**

编写中。。

### 单人聊天

编写中。。

### 下拉加载更多

编写中。。

### 好友亲密度

编写中。。

## API 文档

编写中。。
