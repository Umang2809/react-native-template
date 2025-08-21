import { axiosClient } from './AxiosClient';

export async function postAPI(url: string, payload: any) {
    try {
        const result = await axiosClient.post(url, payload);
        return result.data;
    } catch (err: any) {
        throw err.response?.data || err;
    }
}

export async function putAPI(url: string, payload: any) {
    try {
        const result = await axiosClient.put(url, payload);
        return result.data;
    } catch (err: any) {
        throw err.response?.data || err;
    }
}

export async function deleteAPI(url: string, params?: any) {
    try {
        const result = await axiosClient.delete(url, { params });
        return result.data;
    } catch (err: any) {
        throw err.response?.data || err;
    }
}

export async function getAPI(url: string, params?: any) {
    try {
        const result = await axiosClient.get(url, { params });
        return result.data;
    } catch (err: any) {
        throw err.response?.data || err;
    }
}
