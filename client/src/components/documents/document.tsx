import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api, type DocumentDTO, type DocumentGeneralInfoDTO } from "../../api/api";
import { DocumentInfo } from "./document-info";
import { DocumentList } from "./document-list";
import "./document.scss"

export function DocumentPage() {
	const { id } = useParams();
	const documentId = Number(id);

	const [document, setDocument] = useState<DocumentDTO | null>(null);

	useEffect(() => {
		if (Number.isNaN(documentId)) return;

		const fetchDocument = async () => {
			setDocument(await api.getDocumentById(documentId));
		}
		fetchDocument();
	}, [documentId]);

	const versionDocuments = useMemo((): DocumentGeneralInfoDTO[] => {
		if (!document) return [];

		const { generalInfo } = document;
		return document.versions.map(version => ({
			id: version.id,
			name: `Версия ${version.version}`,
			author: generalInfo.author,
			categoryId: generalInfo.categoryId,
			categoryName: generalInfo.categoryName,
			isPrivate: generalInfo.isPrivate,
			canEdit: generalInfo.canEdit,
		}));
	}, [document]);

	if (!document) return null;

	const { generalInfo } = document;

	return (
		<div className="document-page">
			<DocumentInfo generalInfo={generalInfo} />

			<h3 className="document-page__versions-title">Версии</h3>
			<DocumentList documents={versionDocuments} documentId={documentId} />
		</div>
	);
}
