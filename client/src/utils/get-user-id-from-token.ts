export function getUserIdFromToken(token: string | null): number | null {
	if (!token) return null;

	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		const userId = Number(payload.userId);
		return Number.isNaN(userId) ? null : userId;
	} catch {
		return null;
	}
}
