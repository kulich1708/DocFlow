import { useCallback, useEffect, useRef, useState } from "react";
import type { DocumentGeneralInfoDTO, DocumentsDTOWithPagination } from "../api/api";

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
	const [loadingMore, setLoadingMore] = useState(false);
	const fetchPageRef = useRef(fetchPage);
	fetchPageRef.current = fetchPage;

	useEffect(() => {
		if (resetKey === null) {
			setDocuments([]);
			setPage(1);
			setHasMore(false);
			return;
		}

		let cancelled = false;

		const load = async () => {
			setDocuments([]);
			setPage(1);
			setHasMore(false);

			const result = await fetchPageRef.current(1);
			if (cancelled) return;

			setDocuments(result.items);
			setHasMore(result.hasMore);
		};

		load();
		return () => {
			cancelled = true;
		};
	}, [resetKey]);

	const loadMore = useCallback(async () => {
		if (loadingMore || !hasMore || resetKey === null) return;

		setLoadingMore(true);
		try {
			const nextPage = page + 1;
			const result = await fetchPageRef.current(nextPage);
			setDocuments(prev => [...prev, ...result.items]);
			setHasMore(result.hasMore);
			setPage(nextPage);
		} finally {
			setLoadingMore(false);
		}
	}, [page, hasMore, loadingMore, resetKey]);

	return { documents, hasMore, loadingMore, loadMore };
}
