import axios from 'axios';
import { API_BASE_URL } from '../../constants/AppConstants';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000
});

axiosClient.interceptors.request.use(
  async (config: any) => {

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);