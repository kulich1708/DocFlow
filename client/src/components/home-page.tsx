import { useEffect, useState } from "react";
import { api, type CategoryDTO, type DocumentGeneralInfoDTO } from "../api/api";
import { CategoriesSidebar } from "./categories-sidebar";
import { DocumentList } from "./documents/document-list";

export function HomePage() {
	const [documents, setDocuments] = useState<DocumentGeneralInfoDTO[]>([]);
	const [categories, setCategories] = useState<CategoryDTO[]>([]);
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

	useEffect(() => {
		const fetchCategories = async () => {
			setCategories(await api.getCategories());
		};
		fetchCategories();
	}, []);

	useEffect(() => {
		const fetchDocuments = async () => {
			if (selectedCategoryId === null) {
				setDocuments((await api.getAll()).items);
				return;
			}

			setDocuments((await api.getDocumentsByCategory(selectedCategoryId)).items);
		};
		fetchDocuments();
	}, [selectedCategoryId]);

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
				<DocumentList documents={documents} />
			</div>
		</div>
	);
}
