import { useCallback, useEffect, useState } from "react";
import { api, type CategoryDTO } from "../api/api";
import { usePaginatedDocuments } from "../hooks/use-paginated-documents";
import { CategoriesSidebar } from "./categories-sidebar";
import { DocumentList } from "./documents/document-list";

export function HomePage() {
	const [categories, setCategories] = useState<CategoryDTO[]>([]);
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

	const documentsResetKey = selectedCategoryId ?? "all";

	const fetchDocumentsPage = useCallback(
		(page: number) => {
			if (selectedCategoryId === null) {
				return api.getAll({ Page: page });
			}
			return api.getDocumentsByCategory(selectedCategoryId, { Page: page });
		},
		[selectedCategoryId],
	);

	const { documents, hasMore, loadingMore, loadMore } = usePaginatedDocuments(
		fetchDocumentsPage,
		documentsResetKey,
	);

	useEffect(() => {
		const fetchCategories = async () => {
			setCategories(await api.getCategories());
		};
		fetchCategories();
	}, []);

	return (
		<div className="main">
			<div className="main__container">
				<CategoriesSidebar
					categories={categories}
					selectedCategoryId={selectedCategoryId}
					onCategorySelect={setSelectedCategoryId}
					showEmptyOption
					topOptionLabel="Все документы"
				/>
				<DocumentList
					documents={documents}
					hasMore={hasMore}
					loadingMore={loadingMore}
					onLoadMore={loadMore}
				/>
			</div>
		</div>
	);
}
