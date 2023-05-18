import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080', // TODO: hard code
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(req => {
  const method = req.method || '';
  const headers = {
    ...req.headers.common,
    ...req.headers[method],
    ...req.headers,
  };

  const printable = `
Request: ${method.toUpperCase() + ' ' + req.baseURL + req.url}
Param: ${JSON.stringify(req.data, null, 2)}
${JSON.stringify(headers)}
`;
  console.log(printable);

  return req;
});

axiosClient.interceptors.response.use(res => {
  const printable = `
Response: ${res.status}
${JSON.stringify(res.data, null, 2)}
`;

  console.log(printable);

  return res;
});

export {axiosClient};
