import axios from 'axios';
import { uuid } from '../utils/uuid-util';

axios.defaults.timeout = 60000;
const ERROR_INFO = '业务异常，请联系开发人员';
export const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const ApiClient = {
  server: function () {
    return ApiClient.create(BASE_URL);
  },

  create: function (baseUrl) {
    const instance = axios.create({baseUrl});
    // 处理请求
    instance.interceptors.request.use(request => {
      request.headers['trace_id'] = uuid();
      return request;
    }, error => {
      ElMessage.error(ERROR_INFO);
      Promise.reject(error);
    });

    // 处理响应
    instance.interceptors.response.use(response => {
      if (response.data instanceof ArrayBuffer) {
        return response;
      } else {
        const list = [1, 2, 3];
        if (list.includes(Math.round(response.status / 100))) {
          return response.data;
        }
        const error = new Error();
        error.message = response.data.message || null;
        ElMessage.error(ERROR_INFO);
        return Promise.reject(ERROR_INFO);
      }
    }, error => {
      if (!error.response) {
        error.message = '请检查网络设置';
        ElMessage.error(error.message);
        return Promise.reject(error);
      }
      ElMessage.error(error.message);
      return Promise.reject(error);
    });
    return instance;
  },
};
