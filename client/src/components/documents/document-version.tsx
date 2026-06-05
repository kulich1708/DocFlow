import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, type DocumentDTO } from "../../api/api";
import { getApiError } from "../../utils/get-api-error";
import { MarkdownEditor } from "../markdown-editor/markdown-editor";
import { DocumentInfo } from "./document-info";
import "./document.scss";

export function DocumentVersionPage() {
	const { id, versionId } = useParams();
	const navigate = useNavigate();
	const documentId = Number(id);
	const versionIdNum = Number(versionId);

	const [document, setDocument] = useState<DocumentDTO | null>(null);
	const [draftError, setDraftError] = useState("");
	const [nameError, setNameError] = useState("");
	const [creatingDraft, setCreatingDraft] = useState(false);

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

	const { generalInfo } = document;

	const handleCreateDraft = async () => {
		setDraftError("");
		setCreatingDraft(true);
		try {
			await api.createDraftFromVersion(documentId, versionIdNum);
			navigate(`/documents/${documentId}/draft`);
		} catch (err) {
			setDraftError(getApiError(err) ?? "Не удалось создать черновик");
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
			const message = getApiError(err) ?? "Не удалось сохранить название версии";
			setNameError(message);
			throw new Error(message);
		}
	};

	return (
		<div className="document-page">
			<DocumentInfo
				generalInfo={generalInfo}
				versionNumber={version.version}
				versionName={version.name}
				canEditVersionName={generalInfo.canEdit}
				onVersionNameSave={handleVersionNameSave}
				actions={generalInfo.canEdit ? (
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
		</div>
	);
}
