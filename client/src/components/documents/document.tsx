import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, type DocumentDTO, type DocumentGeneralInfoDTO } from "../../api/api";
import { getApiError } from "../../utils/get-api-error";
import { Modal } from "../modal/modal";
import { DocumentInfo } from "./document-info";
import { DocumentList } from "./document-list";
import "./document.scss"

export function DocumentPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const documentId = Number(id);

	const [document, setDocument] = useState<DocumentDTO | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [deleteError, setDeleteError] = useState("");
	const [deleting, setDeleting] = useState(false);

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
			name: version.name,
			author: generalInfo.author,
			categoryId: generalInfo.categoryId,
			categoryName: generalInfo.categoryName,
			isPrivate: generalInfo.isPrivate,
			canEdit: generalInfo.canEdit,
		}));
	}, [document]);

	if (!document) return null;

	const { generalInfo } = document;

	const handleDeleteDocument = async () => {
		setDeleteError("");
		setDeleting(true);
		try {
			await api.deleteDocument(documentId);
			navigate("/cabinet");
		} catch (err) {
			setDeleteError(getApiError(err) ?? "Не удалось удалить документ");
		} finally {
			setDeleting(false);
		}
	};

	return (
		<div className="document-page">
			<DocumentInfo
				generalInfo={generalInfo}
				titleAction={generalInfo.canEdit ? (
					<div className="document-page__title-actions">
						<Link
							to={`/documents/${documentId}/edit`}
							className="document-page__button document-page__button_secondary"
						>
							Редактировать документ
						</Link>
						<button
							type="button"
							className="document-page__button document-page__button_danger"
							onClick={() => {
								setDeleteError("");
								setIsDeleteModalOpen(true);
							}}
						>
							Удалить документ
						</button>
					</div>
				) : undefined}
				actions={generalInfo.canEdit ? (
					<Link to={`/documents/${documentId}/draft`} className="document-page__button">
						Черновик
					</Link>
				) : undefined}
			/>

			<div className="document-page__section-bar">
				<h3 className="document-page__section-title">Версии</h3>
				{generalInfo.canEdit && (
					<Link to={`/documents/${documentId}/draft`} className="document-page__button">
						Новая версия
					</Link>
				)}
			</div>
			<DocumentList documents={versionDocuments} documentId={documentId} />

			<Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
				<h3 className="document-page__modal-title">Удаление документа</h3>
				<p className="document-page__modal-text">
					Документ «{generalInfo.name}» будет удалён. Вы уверены?
				</p>
				{deleteError && <p className="document-page__error">{deleteError}</p>}
				<div className="document-page__modal-actions">
					<button
						type="button"
						className="document-page__button document-page__button_secondary"
						onClick={() => setIsDeleteModalOpen(false)}
						disabled={deleting}
					>
						Отмена
					</button>
					<button
						type="button"
						className="document-page__button document-page__button_danger"
						onClick={handleDeleteDocument}
						disabled={deleting}
					>
						Удалить
					</button>
				</div>
			</Modal>
		</div>
	);
}
