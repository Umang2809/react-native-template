import axios from 'axios';
import { API_BASE_URL } from '../../constants/AppConstants';
import store from '../redux/store';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

// Adds the access token from the auth slice to every request.
axiosClient.interceptors.request.use(
  config => {
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Add a response interceptor here for token refresh / global 401 handling,
// e.g. dispatch(clearAuth()) and navigateAndSimpleReset('LoginScreen').
