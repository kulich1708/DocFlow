import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, type DocumentDTO } from "../../api/api";
import { MarkdownEditor } from "../markdown-editor/markdown-editor";
import { DocumentInfo } from "./document-info";
import "./document.scss";

export function DocumentVersionPage() {
	const { id, versionId } = useParams();
	const documentId = Number(id);
	const versionIdNum = Number(versionId);

	const [document, setDocument] = useState<DocumentDTO | null>(null);

	useEffect(() => {
		if (Number.isNaN(documentId)) return;

		const fetchDocument = async () => {
			setDocument(await api.getDocumentById(documentId));
		};
		fetchDocument();
	}, [documentId]);

	if (!document) return null;

	const version = document.versions.find(v => v.id === versionIdNum);
	if (!version) {
		return (
			<div className="document-page">
				<p className="document-page__row">Версия не найдена</p>
			</div>
		);
	}

	const versionName = `Версия ${version.version}`;

	return (
		<div className="document-page">
			<DocumentInfo generalInfo={document.generalInfo} versionName={versionName} />
			<MarkdownEditor editable={false} value={version.content} />
		</div>
	);
}
