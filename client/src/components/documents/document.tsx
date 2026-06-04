import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, type DocumentDTO, type DocumentGeneralInfoDTO } from "../../api/api";
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
	const authorName = generalInfo.author === null
		? "Удалённый пользователь"
		: `${generalInfo.author.name} ${generalInfo.author.surname}`;

	return (
		<div className="document-page">
			<div className="document-page__info">
				<h2 className="document-page__title">{generalInfo.name}</h2>
				<p className="document-page__row">
					<span className="document-page__label">Автор:</span>
					{generalInfo.author === null ? (
						<span>{authorName}</span>
					) : (
						<Link to={`/users/${generalInfo.author.id}`} className="document-page__link">
							{authorName}
						</Link>
					)}
				</p>
				<p className="document-page__row">
					<span className="document-page__label">Категория:</span>
					<span>{generalInfo.categoryName ?? "Без категории"}</span>
				</p>
				<p className="document-page__row">
					<span className="document-page__label">Доступ:</span>
					<span>{generalInfo.isPrivate ? "Приватный" : "Публичный"}</span>
				</p>
			</div>

			<h3 className="document-page__versions-title">Версии</h3>
			<DocumentList documents={versionDocuments} documentId={documentId} />
		</div>
	);
}
