import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export const axiosInstance = async <T>(
	config: AxiosRequestConfig
): Promise<T> => {
	const response = await axios({
		baseURL: 'https://localhost:7078',
		...config,
	});
	return response.data;
};