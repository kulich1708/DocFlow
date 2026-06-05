import { useEffect, useState } from "react";
import { api, type CategoryDTO, type DocumentGeneralInfoDTO } from "../api/api";
import { CategoriesSidebar } from "./categories-sidebar";
import { DocumentList } from "./documents/document-list";

export function HomePage() {
	const [documents, setDocuments] = useState<DocumentGeneralInfoDTO[]>([]);
	const [categories, setCategories] = useState<CategoryDTO[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const [categoriesData, documentsData] = await Promise.all([
				api.getCategories(),
				api.getUserDocuments(6),
			]);
			setCategories(categoriesData);
			setDocuments(documentsData);
		};
		fetchData();
	}, []);

	return (
		<div className="main">
			<div className="main__container">
				<CategoriesSidebar categories={categories} />
				<DocumentList documents={documents} />
			</div>
		</div>
	);
}
