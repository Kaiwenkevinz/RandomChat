import axios from 'axios';
import {showToast, toastType} from '../utils/toastUtil';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080', // TODO: hard code
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// log request and response
const printResponse = (res: any) => {
  const printable = `
Response: ${res.status}
${JSON.stringify(res.data, null, 2)}
`;

  console.log(printable);

  return res;
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

axiosClient.interceptors.response.use(
  res => {
    printResponse(res);
    return Promise.resolve(res);
  },
  error => {
    printResponse(error.response);
    return Promise.reject(error);
  },
);

// Handle errors
const errorHandle = (status: number, other: string) => {
  switch (status) {
    case -1:
      showToast(toastType.ERROR, 'Error', 'username already exists');
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
      console.log(other);
  }
};

axiosClient.interceptors.response.use(
  res => (res.status === 200 ? Promise.resolve(res) : Promise.reject(res)),
  error => {
    const {response} = error;
    if (response) {
      console.log('拦截错误');
      errorHandle(response.status, 'unknown error'); // TODO: error message from server
      return Promise.reject(response);
    }
  },
);

export {axiosClient};
