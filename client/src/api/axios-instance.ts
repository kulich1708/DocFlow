import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

const instance = axios.create({
	baseURL: 'https://localhost:7078',
});

instance.interceptors.request.use(config => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
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
		headers: {
			...config.headers,
			...options?.headers,
		},
	});
	return response.data;
};
