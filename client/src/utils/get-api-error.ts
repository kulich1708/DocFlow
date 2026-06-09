import axios from "axios";

export function getApiError(err: unknown, fallback = "Не удалось выполнить запрос"): string {
	if (!axios.isAxiosError(err)) {
		return fallback;
	}

	if (!err.response) {
		return "Нет связи с сервером";
	}

	const data = err.response.data as {
		message?: string;
		error?: string;
		title?: string;
	};

	const message = data?.message ?? data?.error ?? data?.title;
	if (message) {
		return message;
	}

	if (err.response.status === 404) {
		return "Не найдено";
	}

	return fallback;
}
