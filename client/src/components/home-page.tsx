import { useCallback, useEffect, useState } from "react";
import { api, type CategoryDTO } from "../api/api";
import { usePaginatedDocuments } from "../hooks/use-paginated-documents";
import { PageStatus } from "./page-status/page-status";
import { CategoriesSidebar } from "./categories-sidebar";
import { DocumentList } from "./documents/document-list";

export function HomePage() {
	const [categories, setCategories] = useState<CategoryDTO[]>([]);
	const [categoriesLoading, setCategoriesLoading] = useState(true);
	const [categoriesError, setCategoriesError] = useState("");
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

	const { documents, hasMore, loading, loadingMore, error, loadMore } = usePaginatedDocuments(
		fetchDocumentsPage,
		documentsResetKey,
	);

	useEffect(() => {
		const fetchCategories = async () => {
			setCategoriesLoading(true);
			setCategoriesError("");

			try {
				setCategories(await api.getCategories());
			} catch {
				setCategories([]);
				setCategoriesError("Не удалось загрузить категории");
			} finally {
				setCategoriesLoading(false);
			}
		};
		fetchCategories();
	}, []);

	return (
		<div className="main">
			<div className="main__container">
				{categoriesLoading ? (
					<PageStatus loading />
				) : categoriesError ? (
					<PageStatus error={categoriesError} />
				) : (
					<CategoriesSidebar
						categories={categories}
						selectedCategoryId={selectedCategoryId}
						onCategorySelect={setSelectedCategoryId}
						showEmptyOption
						topOptionLabel="Все документы"
					/>
				)}
				<div className="main__content">
					{error && <PageStatus error={error} />}
					<DocumentList
						documents={documents}
						loading={loading}
						hasMore={hasMore}
						loadingMore={loadingMore}
						onLoadMore={loadMore}
					/>
				</div>
			</div>
		</div>
	);
}
