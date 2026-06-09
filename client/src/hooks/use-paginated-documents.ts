import { useCallback, useEffect, useRef, useState } from "react";
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
	const fetchPageRef = useRef(fetchPage);
	const resetKeyRef = useRef(resetKey);
	fetchPageRef.current = fetchPage;
	resetKeyRef.current = resetKey;

	useEffect(() => {
		if (resetKey === null) {
			setDocuments([]);
			setPage(1);
			setHasMore(false);
			setLoading(false);
			setError("");
			return;
		}

		let cancelled = false;

		const load = async () => {
			setDocuments([]);
			setPage(1);
			setHasMore(false);
			setLoading(true);
			setError("");

			try {
				const result = await fetchPageRef.current(1);
				if (cancelled) return;

				setDocuments(result.items);
				setHasMore(result.hasMore);
			} catch (err) {
				if (cancelled) return;

				setDocuments([]);
				setHasMore(false);
				setError(getApiError(err, "Не удалось загрузить документы"));
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		};

		load();
		return () => {
			cancelled = true;
		};
	}, [resetKey]);

	const loadMore = useCallback(async () => {
		if (loadingMore || !hasMore || resetKey === null) return;

		const requestKey = resetKeyRef.current;
		setLoadingMore(true);

		try {
			const nextPage = page + 1;
			const result = await fetchPageRef.current(nextPage);
			if (resetKeyRef.current !== requestKey) return;

			setDocuments(prev => [...prev, ...result.items]);
			setHasMore(result.hasMore);
			setPage(nextPage);
		} catch (err) {
			if (resetKeyRef.current !== requestKey) return;

			setError(getApiError(err, "Не удалось загрузить документы"));
		} finally {
			if (resetKeyRef.current === requestKey) {
				setLoadingMore(false);
			}
		}
	}, [page, hasMore, loadingMore, resetKey]);

	return { documents, hasMore, loading, loadingMore, error, loadMore };
}
