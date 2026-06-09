import { useCallback, useEffect, useState } from "react";
import type { DocumentGeneralInfoDTO, DocumentsDTOWithPagination } from "../api/api";
import { getApiError } from "../utils/get-api-error";

type FetchDocumentsPage = (page: number) => Promise<DocumentsDTOWithPagination>;

export const emptyDocumentsPage: DocumentsDTOWithPagination = {
	items: [],
	page: 1,
	pageSize: 20,
	total: 0,
	hasMore: false,
};

export function usePaginatedDocuments(fetchPage: FetchDocumentsPage, resetKey: string | number | null) {
	const [documents, setDocuments] = useState<DocumentGeneralInfoDTO[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (resetKey === null) {
			return;
		}

		const load = async () => {
			setDocuments([]);
			setPage(1);
			setHasMore(false);
			setLoading(true);
			setError("");

			try {
				const result = await fetchPage(1);
				setDocuments(result.items);
				setHasMore(result.hasMore);
			} catch (err) {
				setDocuments([]);
				setHasMore(false);
				setError(getApiError(err, "Не удалось загрузить документы"));
			} finally {
				setLoading(false);
			}
		};

		void load();
	}, [resetKey, fetchPage]);

	const loadMore = useCallback(async () => {
		if (loadingMore || !hasMore || resetKey === null) return;

		setLoadingMore(true);

		try {
			const nextPage = page + 1;
			const result = await fetchPage(nextPage);
			setDocuments(prev => [...prev, ...result.items]);
			setHasMore(result.hasMore);
			setPage(nextPage);
		} catch (err) {
			setError(getApiError(err, "Не удалось загрузить документы"));
		} finally {
			setLoadingMore(false);
		}
	}, [page, hasMore, loadingMore, resetKey, fetchPage]);

	return {
		documents: resetKey === null ? [] : documents,
		hasMore: resetKey === null ? false : hasMore,
		loading: resetKey === null ? false : loading,
		loadingMore: resetKey === null ? false : loadingMore,
		error: resetKey === null ? "" : error,
		loadMore,
	};
}
