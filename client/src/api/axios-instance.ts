import axios, { AxiosHeaders } from 'axios';
import type { AxiosRequestConfig } from 'axios';

const instance = axios.create({
	baseURL: 'https://localhost:7078',
});

instance.interceptors.request.use(config => {
	const token = localStorage.getItem('token');
	if (token) {
		const headers = AxiosHeaders.from(config.headers);
		headers.set('Authorization', `Bearer ${token}`);
		config.headers = headers;
	}
	return config;
});

export const axiosInstance = async <T>(
	config: AxiosRequestConfig,
	options?: AxiosRequestConfig
): Promise<T> => {
	const response = await instance({
		...config,
		...options,
	});
	return response.data;
};
