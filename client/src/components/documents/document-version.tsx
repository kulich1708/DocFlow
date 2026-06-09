import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, type DocumentDTO } from "../../api/api";
import { getApiError } from "../../utils/get-api-error";
import { PageStatus } from "../page-status/page-status";
import { MarkdownEditor } from "../markdown-editor/markdown-editor";
import { Modal } from "../modal/modal";
import { DocumentInfo } from "./document-info";
import "./document.scss";

export function DocumentVersionPage() {
	const { id, versionId } = useParams();
	const navigate = useNavigate();
	const documentId = Number(id);
	const versionIdNum = Number(versionId);

	const [document, setDocument] = useState<DocumentDTO | null>(null);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState("");
	const [draftError, setDraftError] = useState("");
	const [nameError, setNameError] = useState("");
	const [creatingDraft, setCreatingDraft] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [deleteError, setDeleteError] = useState("");
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		if (Number.isNaN(documentId)) {
			setLoading(false);
			setLoadError("Некорректный адрес документа");
			return;
		}

		let cancelled = false;

		const fetchDocument = async () => {
			setLoading(true);
			setLoadError("");
			setDocument(null);

			try {
				const doc = await api.getDocumentById(documentId);
				if (!cancelled) {
					setDocument(doc);
				}
			} catch (err) {
				if (!cancelled) {
					setLoadError(getApiError(err, "Не удалось загрузить документ"));
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		};

		fetchDocument();
		return () => {
			cancelled = true;
		};
	}, [documentId]);

	if (loading || loadError) {
		return (
			<div className="document-page">
				<PageStatus loading={loading} error={loadError} />
			</div>
		);
	}

	if (!document) {
		return (
			<div className="document-page">
				<PageStatus error="Документ не найден" />
			</div>
		);
	}

	const version = document.versions.find(v => v.id === versionIdNum);
	if (!version) {
		return (
			<div className="document-page">
				<PageStatus error="Версия не найдена" />
			</div>
		);
	}

	const { generalInfo, canEdit } = document;

	const handleCreateDraft = async () => {
		setDraftError("");
		setCreatingDraft(true);
		try {
			await api.createDraftFromVersion(documentId, versionIdNum);
			navigate(`/documents/${documentId}/draft`);
		} catch (err) {
			setDraftError(getApiError(err, "Не удалось создать черновик"));
		} finally {
			setCreatingDraft(false);
		}
	};

	const handleVersionNameSave = async (name: string) => {
		setNameError("");
		try {
			await api.changeDocumentVersionGeneralInfo(documentId, versionIdNum, { name });
			setDocument(prev => {
				if (!prev) return prev;
				return {
					...prev,
					versions: prev.versions.map(v =>
						v.id === versionIdNum ? { ...v, name } : v
					),
				};
			});
		} catch (err) {
			const message = getApiError(err, "Не удалось сохранить название версии");
			setNameError(message);
			throw new Error(message);
		}
	};

	const handleDeleteVersion = async () => {
		setDeleteError("");
		setDeleting(true);
		try {
			await api.deleteDocumentVersion(documentId, versionIdNum);
			navigate(`/documents/${documentId}`);
		} catch (err) {
			setDeleteError(getApiError(err, "Не удалось удалить версию"));
		} finally {
			setDeleting(false);
		}
	};

	return (
		<div className="document-page">
			<DocumentInfo
				generalInfo={generalInfo}
				versionNumber={version.version}
				versionName={version.name}
				canEditVersionName={canEdit}
				onVersionNameSave={handleVersionNameSave}
				titleAction={canEdit ? (
					<button
						type="button"
						className="document-page__button document-page__button_danger"
						onClick={() => {
							setDeleteError("");
							setIsDeleteModalOpen(true);
						}}
					>
						Удалить версию
					</button>
				) : undefined}
				actions={canEdit ? (
					<button
						type="button"
						className="document-page__button"
						onClick={handleCreateDraft}
						disabled={creatingDraft}
					>
						Создать черновик на основе этой версии
					</button>
				) : undefined}
			/>
			{nameError && <p className="document-page__error">{nameError}</p>}
			{draftError && <p className="document-page__error">{draftError}</p>}
			<MarkdownEditor editable={false} value={version.content} />

			<Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
				<h3 className="document-page__modal-title">Удаление версии</h3>
				<p className="document-page__modal-text">
					Версия «{version.name}» будет удалена. Вы уверены?
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
						onClick={handleDeleteVersion}
						disabled={deleting}
					>
						Удалить
					</button>
				</div>
			</Modal>
		</div>
	);
}
