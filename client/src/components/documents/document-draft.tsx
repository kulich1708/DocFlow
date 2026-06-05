import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, type DocumentDTO } from "../../api/api";
import { getApiError } from "../../utils/get-api-error";
import { MarkdownEditor } from "../markdown-editor/markdown-editor";
import { Modal } from "../modal/modal";
import { DocumentInfo } from "./document-info";
import "./document.scss";

export function DocumentDraftPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const documentId = Number(id);

	const [document, setDocument] = useState<DocumentDTO | null>(null);
	const [content, setContent] = useState("");
	const [editorKey, setEditorKey] = useState(0);
	const [error, setError] = useState("");
	const [busy, setBusy] = useState(false);
	const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
	const [versionName, setVersionName] = useState("");
	const [publishError, setPublishError] = useState("");

	const loadDocument = useCallback(async () => {
		const doc = await api.getDocumentById(documentId);
		setDocument(doc);
		setContent(doc.draftContent ?? "");
		return doc;
	}, [documentId]);

	useEffect(() => {
		if (Number.isNaN(documentId)) return;
		loadDocument();
	}, [documentId, loadDocument]);

	const handleSave = async () => {
		setError("");
		setBusy(true);
		try {
			await api.saveDocumentDraft(documentId, content);
		} catch (err) {
			setError(getApiError(err) ?? "Не удалось сохранить черновик");
		} finally {
			setBusy(false);
		}
	};

	const handleReset = async () => {
		setError("");
		setBusy(true);
		try {
			await api.resetDocumentDraft(documentId);
			await loadDocument();
			setEditorKey(k => k + 1);
		} catch (err) {
			setError(getApiError(err) ?? "Не удалось сбросить черновик");
		} finally {
			setBusy(false);
		}
	};

	const openPublishModal = () => {
		setPublishError("");
		setVersionName("");
		setIsPublishModalOpen(true);
	};

	const handlePublish = async (e: React.FormEvent) => {
		e.preventDefault();
		setPublishError("");
		setBusy(true);
		try {
			await api.saveDocumentDraft(documentId, content);
			const versionId = await api.addDocumentVersion(documentId, { name: versionName });
			navigate(`/documents/${documentId}/versions/${versionId}`);
		} catch (err) {
			setPublishError(getApiError(err) ?? "Не удалось опубликовать версию");
		} finally {
			setBusy(false);
		}
	};

	if (!document) return null;

	if (!document.generalInfo.canEdit) {
		return (
			<div className="document-page">
				<p className="document-page__row">Нет доступа к редактированию черновика</p>
			</div>
		);
	}

	return (
		<div className="document-page">
			<DocumentInfo generalInfo={document.generalInfo} linkTitle />

			<div className="document-page__draft-bar">
				<h3 className="document-page__draft-title">Черновик</h3>
				<div className="document-page__draft-actions">
					<button
						type="button"
						className="document-page__button"
						onClick={openPublishModal}
						disabled={busy}
					>
						Опубликовать версию
					</button>
					<button
						type="button"
						className="document-page__button document-page__button_secondary"
						onClick={handleSave}
						disabled={busy}
					>
						Сохранить
					</button>
					<button
						type="button"
						className="document-page__button document-page__button_secondary"
						onClick={handleReset}
						disabled={busy}
					>
						Сбросить
					</button>
				</div>
			</div>

			{error && <p className="document-page__error">{error}</p>}

			<MarkdownEditor
				key={editorKey}
				editable
				value={content}
				onChange={setContent}
			/>

			<Modal isOpen={isPublishModalOpen} onClose={() => setIsPublishModalOpen(false)}>
				<h3 className="document-page__modal-title">Опубликовать версию</h3>
				<form className="document-page__modal-form" onSubmit={handlePublish}>
					<label className="document-page__modal-field">
						<span className="document-page__label">Название версии</span>
						<input
							className="document-page__modal-input"
							type="text"
							value={versionName}
							onChange={e => setVersionName(e.target.value)}
							required
						/>
					</label>
					{publishError && <p className="document-page__error">{publishError}</p>}
					<div className="document-page__modal-actions">
						<button
							type="button"
							className="document-page__button document-page__button_secondary"
							onClick={() => setIsPublishModalOpen(false)}
							disabled={busy}
						>
							Отмена
						</button>
						<button
							type="submit"
							className="document-page__button"
							disabled={busy}
						>
							Опубликовать
						</button>
					</div>
				</form>
			</Modal>
		</div>
	);
}
