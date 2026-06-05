import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, type CategoryDTO, type DocumentGeneralInfoDTO } from "../../api/api";
import { getApiError } from "../../utils/get-api-error";
import { CategoriesSidebar } from "../categories-sidebar";
import "./document-form.scss";

type DocumentFormState = {
	name: string;
	categoryId: number | null;
	isPrivate: boolean;
};

const emptyForm: DocumentFormState = {
	name: "",
	categoryId: null,
	isPrivate: true,
};

function getCategoryName(categories: CategoryDTO[], categoryId: number | null): string | null {
	if (categoryId === null) return null;
	return categories.find(c => c.id === categoryId)?.name ?? null;
}

function formFromGeneralInfo(generalInfo: DocumentGeneralInfoDTO): DocumentFormState {
	return {
		name: generalInfo.name,
		categoryId: generalInfo.categoryId,
		isPrivate: generalInfo.isPrivate,
	};
}

export function DocumentFormPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const isCreateMode = id === undefined;
	const documentId = isCreateMode ? NaN : Number(id);

	const [categories, setCategories] = useState<CategoryDTO[]>([]);
	const [generalInfo, setGeneralInfo] = useState<DocumentGeneralInfoDTO | null>(null);
	const [form, setForm] = useState<DocumentFormState>(emptyForm);
	const [initialForm, setInitialForm] = useState<DocumentFormState>(emptyForm);
	const [error, setError] = useState("");
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		const fetchCategories = async () => {
			setCategories(await api.getCategories());
		};
		fetchCategories();
	}, []);

	const loadDocument = useCallback(async () => {
		const document = await api.getDocumentById(documentId);
		const nextForm = formFromGeneralInfo(document.generalInfo);
		setGeneralInfo(document.generalInfo);
		setForm(nextForm);
		setInitialForm(nextForm);
	}, [documentId]);

	useEffect(() => {
		if (isCreateMode || Number.isNaN(documentId)) return;
		loadDocument();
	}, [isCreateMode, documentId, loadDocument]);

	const handleReset = () => {
		setError("");
		setForm(initialForm);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setBusy(true);

		try {
			if (isCreateMode) {
				const newDocumentId = await api.createDocument({
					name: form.name,
					categoryId: form.categoryId,
					isPrivate: form.isPrivate,
				});
				navigate(`/documents/${newDocumentId}`);
				return;
			}

			if (!generalInfo) return;

			await api.updateDocumentGeneralInfo(documentId, {
				...generalInfo,
				name: form.name,
				categoryId: form.categoryId,
				categoryName: getCategoryName(categories, form.categoryId),
				isPrivate: form.isPrivate,
			});
			navigate(`/documents/${documentId}`);
		} catch (err) {
			setError(getApiError(err) ?? (isCreateMode ? "Не удалось создать документ" : "Не удалось сохранить документ"));
		} finally {
			setBusy(false);
		}
	};

	if (!isCreateMode && !generalInfo) return null;

	if (!isCreateMode && generalInfo && !generalInfo.canEdit) {
		return (
			<div className="document-form">
				<p className="document-form__error">Нет доступа к редактированию документа</p>
			</div>
		);
	}

	const title = isCreateMode ? "Создание документа" : "Редактирование документа";

	return (
		<div className="document-form">
			<div className="document-form__header">
				<h2 className="document-form__title">{title}</h2>
				{!isCreateMode && (
					<Link to={`/documents/${documentId}`} className="document-form__back">
						К документу
					</Link>
				)}
			</div>

			<form className="document-form__form" onSubmit={handleSubmit}>
				<label className="document-form__field">
					<span className="document-form__label">Название</span>
					<input
						className="document-form__input"
						type="text"
						value={form.name}
						onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
						required
					/>
				</label>

				<div className="document-form__field">
					<span className="document-form__label">Категория</span>
					<CategoriesSidebar
						categories={categories}
						variant="picker"
						selectedCategoryId={form.categoryId}
						onCategorySelect={categoryId => setForm(prev => ({ ...prev, categoryId }))}
					/>
				</div>

				<div className="document-form__field">
					<span className="document-form__label">Доступ</span>
					<label className="document-form__toggle">
						<input
							type="checkbox"
							className="document-form__toggle-input"
							checked={form.isPrivate}
							onChange={e => setForm(prev => ({ ...prev, isPrivate: e.target.checked }))}
						/>
						<span className="document-form__toggle-track" aria-hidden="true">
							<span className="document-form__toggle-thumb" />
						</span>
						<span className="document-form__toggle-text">
							{form.isPrivate ? "Приватный" : "Публичный"}
						</span>
					</label>
				</div>

				{error && <p className="document-form__error">{error}</p>}

				<div className="document-form__actions">
					<button
						type="button"
						className="document-form__button document-form__button_secondary"
						onClick={handleReset}
						disabled={busy}
					>
						Сбросить
					</button>
					<button
						type="submit"
						className="document-form__button"
						disabled={busy}
					>
						{isCreateMode ? "Создать" : "Сохранить"}
					</button>
				</div>
			</form>
		</div>
	);
}
