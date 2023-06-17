import axios from 'axios';
import {showToast, toastType} from '../utils/toastUtil';

const axiosClient = axios.create({
  baseURL: 'http://10.68.95.179:8080', // TODO: hard code
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// token interceptor
const initTokenInceptor = (token: string) => {
  console.log('initTokenInceptor, token: ', token);
  axiosClient.interceptors.request.use(
    config => {
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );
};

axiosClient.interceptors.request.use(req => {
  const method = req.method || '';
  const headers = {
    ...req.headers.common,
    ...req.headers[method],
    ...req.headers,
  };

  const printable = `
Request: ${method.toUpperCase() + ' ' + req.baseURL + req.url}
${JSON.stringify(headers)}
Param: ${JSON.stringify(req.params, null, 2)}
Data: ${JSON.stringify(req.data, null, 2)}
`;
  console.log(printable);

  return req;
});

// Handle errors
const errorHandle = (status: string, msg: string) => {
  console.log('拦截错误');
  switch (msg) {
    case 'No such user!':
      showToast(toastType.ERROR, 'Error', msg);
      break;

    // // 401: 未登录状态，跳转登录页
    // case 401:
    //   // toLogin();
    //   break;
    // // 403 token过期
    // // 清除token并跳转登录页
    // case 403:
    //   // localStorage.removeItem('token');
    //   break;
    // // 404请求不存在
    // case 404:
    //   break;
    default:
      console.log('Unknown error: ', msg);
  }
};

axiosClient.interceptors.response.use(
  res => {
    const status = res.data.status.toString();
    console.log('🚀 ~ file: axios.config.ts:77 ~ status:', status);

    // 请求没问题，传给下一个拦截器
    if (status === 'ok') {
      return Promise.resolve(res);
    }

    // 处理请求错误码
    errorHandle(status, res.data.msg);

    return Promise.reject(
      'Error from axiosClient.interceptors.response: ' + res,
    );
  },
  error => {
    console.log('🚀 ~ file: axios.config.ts:92 ~ error:', error);
    const {response} = error;
    if (response) {
      errorHandle(response.msg, 'unknown error'); // TODO: error message from server
      return Promise.reject(response);
    }
  },
);

axiosClient.interceptors.response.use(
  res => {
    // 只需要 请求体中 data 字段的数据
    res = res.data;
    console.log('Response:', res);
    return Promise.resolve(res);
  },
  error => {
    console.log('Request Error:', error);
    return Promise.reject(error);
  },
);

export {axiosClient, initTokenInceptor};
