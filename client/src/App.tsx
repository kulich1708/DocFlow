import { useEffect, useState } from 'react';
import { api, type CategoryDTO, type DocumentGeneralInfoDTO } from './api/api';
import { DocumentList } from "./components/document-list";
import { CategoriesSidebar } from "./components/categories-sidebar";
import { Register } from "./components/account/register";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
function App() {
	const [documents, setDocuments] = useState<DocumentGeneralInfoDTO[]>([]);
	useEffect(() => {
		const fetchDocuments = async () => {
			setDocuments(await api.getUserDocuments(6));
		}
		fetchDocuments();
	}, [])
	const [categories, setCategories] = useState<CategoryDTO[]>([]);
	useEffect(() => {
		const fetchCategories = async () => {
			setCategories(await api.getCategories());
		}
		fetchCategories();
	}, [])
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={
					<div className="main">
						<div className="main__container">
							<CategoriesSidebar categories={categories} />
							<DocumentList documents={documents} />
						</div>
					</div>
				} />
				<Route path="/register" element={<Register />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
