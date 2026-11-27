import type { AxiosRequestConfig } from 'axios';
import { axiosClient } from './AxiosClient';

/**
 * Thin wrappers around the axios client. They return `response.data` and
 * reject with the server's error body when there is one (so `err.message`
 * is the backend's message), otherwise with the axios error.
 */
const unwrapError = (err: unknown) => {
  const responseData = (err as { response?: { data?: unknown } })?.response?.data;
  return responseData ?? err;
};

export async function getAPI<T = unknown>(url: string, params?: object): Promise<T> {
  try {
    const result = await axiosClient.get<T>(url, { params });
    return result.data;
  } catch (err) {
    throw unwrapError(err);
  }
}

export async function postAPI<T = unknown>(url: string, payload?: unknown): Promise<T> {
  try {
    const result = await axiosClient.post<T>(url, payload);
    return result.data;
  } catch (err) {
    throw unwrapError(err);
  }
}

export async function putAPI<T = unknown>(url: string, payload?: unknown): Promise<T> {
  try {
    const result = await axiosClient.put<T>(url, payload);
    return result.data;
  } catch (err) {
    throw unwrapError(err);
  }
}

export async function patchAPI<T = unknown>(url: string, payload?: unknown): Promise<T> {
  try {
    const result = await axiosClient.patch<T>(url, payload);
    return result.data;
  } catch (err) {
    throw unwrapError(err);
  }
}

export async function deleteAPI<T = unknown>(url: string, params?: object): Promise<T> {
  try {
    const result = await axiosClient.delete<T>(url, { params });
    return result.data;
  } catch (err) {
    throw unwrapError(err);
  }
}

/** Multipart upload. Build the body with `new FormData()` and `append(...)`. */
export async function uploadAPI<T = unknown>(
  url: string,
  body: FormData,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    const result = await axiosClient.post<T>(url, body, {
      ...config,
      headers: { 'Content-Type': 'multipart/form-data', ...config?.headers },
    });
    return result.data;
  } catch (err) {
    throw unwrapError(err);
  }
}
