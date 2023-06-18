import axios, {AxiosResponse} from 'axios';
import {showToast, toastType} from '../utils/toastUtil';
import {Result} from '../types/network/types';
import {prettyPrint} from '../utils/printUtil';

const axiosClient = axios.create({
  baseURL: 'http://10.68.95.179:8080', // TODO: hard code
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// 调用此方法后，所有接口都会带上token和userId
const initAuthInceptor = (token: string, userId: number) => {
  console.log('initAuthInceptor, token: ', token, 'userId: ', userId);
  axiosClient.interceptors.request.use(
    config => {
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.params = {id: userId, ...config.params};

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

/**
 * 统一处理原生的 http 错误码, 如 401, 500
 * @param status 后端返回的 response.status 字段值
 */
const handleErrorCode = (status: number, message: string) => {
  console.log(`统一处理原生错误码, status: ${status}, message: ${message}`);
  switch (status) {
    case 401:
      showToast(toastType.ERROR, 'Error', '401: Unauthorized');
      // TODO: 跳转到登录页
      break;
    case 500:
      showToast(toastType.ERROR, 'Error', '500: Internal Server Error');
      break;
    default:
      showToast(toastType.ERROR, 'Unknown Error', status.toString());
  }
};

/**
 * 统一处理和后端约定的错误信息, 通过 msg 字段判断错误信息
 * @param status 在 response.data 中的 status 字段
 * @param msg 在 response.data 中的 msg 字段
 */
const handleErrorCustomeCode = (status: string, msg: string) => {
  console.log(`统一处理自定义错误码, status: ${status}, msg: ${msg}`);
  switch (msg) {
    case 'No such user!':
      showToast(toastType.ERROR, 'Error', msg);
      break;
    default:
      console.log('Unknown error: ', msg);
  }
};

axiosClient.interceptors.response.use(
  res => {
    console.log('Response:', prettyPrint(res));

    const data = res.data as Result;
    const {status, msg} = data;

    // 请求没问题，提取 data，往下继续传
    if (status === 'ok') {
      return Promise.resolve(res);
      // console.log('拦截器', prettyPrint(data));

      // return Promise.resolve<AxiosResponse<string>>(res.data);
    }

    // 处理后端自定义的错误信息
    handleErrorCustomeCode(status, msg);

    return Promise.reject('拦截器处理了自定义的错误信息');
  },
  error => {
    /**
     * 原生错误码会走这个回调
     */
    const message = error.message;
    const status = error.response.status;
    handleErrorCode(status, message);

    return Promise.reject('拦截器处理了原生错误码: ' + status);
  },
);

export {axiosClient, initAuthInceptor};
