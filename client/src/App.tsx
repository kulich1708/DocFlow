import { HomePage } from "./components/home-page";
import { DocumentPage } from "./components/documents/document";
import { Register } from "./components/account/register";
import { Login } from "./components/account/login";
import { UserCabinet } from "./components/user-cabinet/user-cabinet";
import { Header } from "./components/header";
import { DocumentVersionPage } from "./components/documents/document-version";
import { DocumentDraftPage } from "./components/documents/document-draft";
import { DocumentFormPage } from "./components/documents/document-form";
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route path="/cabinet" element={<UserCabinet />} />
				<Route path="/cabinet/settings" element={<UserCabinet />} />
				<Route path="/users/:id" element={<UserCabinet />} />
				<Route path="/documents/create" element={<DocumentFormPage />} />
				<Route path="/documents/:id/edit" element={<DocumentFormPage />} />
				<Route path="/documents/:id/draft" element={<DocumentDraftPage />} />
				<Route path="/documents/:id/versions/:versionId" element={<DocumentVersionPage />} />
				<Route path="/documents/:id" element={<DocumentPage />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
