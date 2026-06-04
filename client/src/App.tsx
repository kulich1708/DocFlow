import { useEffect, useState } from 'react';
import { api, type CategoryDTO, type DocumentGeneralInfoDTO } from './api/api';
import { DocumentList } from "./components/documents/document-list";
import { CategoriesSidebar } from "./components/categories-sidebar";
import { Register } from "./components/account/register";
import { Login } from "./components/account/login";
import { UserCabinet } from "./components/user-cabinet/user-cabinet";
import { Header } from "./components/header";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
			<Header />
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
				<Route path="/login" element={<Login />} />
				<Route path="/cabinet" element={<UserCabinet />} />
				<Route path="/cabinet/settings" element={<UserCabinet />} />
				<Route path="/users/:id" element={<UserCabinet />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
