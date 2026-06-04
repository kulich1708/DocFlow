import axios from "axios";

export function getApiError(err: unknown): string | null {
	if (!axios.isAxiosError(err) || !err.response?.data) return null;

	const data = err.response.data as { message?: string; error?: string };
	return data.message ?? data.error ?? null;
}
