import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { DocumentGeneralInfoDTO } from "../../api/api";
import "./document.scss";

type DocumentInfoProps = {
	generalInfo: DocumentGeneralInfoDTO;
	versionNumber?: number;
	versionName?: string;
	canEditVersionName?: boolean;
	onVersionNameSave?: (name: string) => Promise<void>;
	linkTitle?: boolean;
	titleAction?: ReactNode;
	actions?: ReactNode;
};

function PencilIcon() {
	return (
		<svg className="document-page__icon" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
		</svg>
	);
}

function SaveIcon() {
	return (
		<svg className="document-page__icon" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
		</svg>
	);
}

export function DocumentInfo({
	generalInfo,
	versionNumber,
	versionName,
	canEditVersionName,
	onVersionNameSave,
	linkTitle,
	titleAction,
	actions,
}: DocumentInfoProps) {
	const [isEditingName, setIsEditingName] = useState(false);
	const [editName, setEditName] = useState(versionName ?? "");
	const [savingName, setSavingName] = useState(false);

	useEffect(() => {
		if (!isEditingName && versionName !== undefined) {
			setEditName(versionName);
		}
	}, [versionName, isEditingName]);

	const authorName = generalInfo.author === null
		? "Удалённый пользователь"
		: `${generalInfo.author.name} ${generalInfo.author.surname}`;

	const handleNameAction = async () => {
		if (!canEditVersionName || !onVersionNameSave) return;

		if (!isEditingName) {
			setEditName(versionName ?? "");
			setIsEditingName(true);
			return;
		}

		setSavingName(true);
		try {
			await onVersionNameSave(editName);
			setIsEditingName(false);
		} finally {
			setSavingName(false);
		}
	};

	return (
		<div className="document-page__info">
			<div className="document-page__title-bar">
				<h2 className="document-page__title">
					{linkTitle ?? versionNumber !== undefined ? (
						<Link to={`/documents/${generalInfo.id}`} className="document-page__link">
							{generalInfo.name}
						</Link>
					) : (
						generalInfo.name
					)}
				</h2>
				{titleAction}
			</div>
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
			{versionNumber !== undefined && (
				<p className="document-page__row">
					<span className="document-page__label">Номер версии:</span>
					<span>{versionNumber}</span>
				</p>
			)}
			{versionName !== undefined && (
				<p className="document-page__row document-page__row_inline">
					<span className="document-page__label">Версия:</span>
					<span className="document-page__version-name">
						{isEditingName ? (
							<input
								className="document-page__version-input"
								type="text"
								value={editName}
								onChange={e => setEditName(e.target.value)}
								disabled={savingName}
								autoFocus
							/>
						) : (
							<span>{versionName}</span>
						)}
						{canEditVersionName && onVersionNameSave && (
							<button
								type="button"
								className="document-page__icon-button"
								onClick={handleNameAction}
								disabled={savingName || (isEditingName && !editName.trim())}
								aria-label={isEditingName ? "Сохранить название версии" : "Редактировать название версии"}
							>
								{isEditingName ? <SaveIcon /> : <PencilIcon />}
							</button>
						)}
					</span>
				</p>
			)}
			{actions !== undefined && (
				<div className="document-page__actions">
					{actions}
				</div>
			)}
		</div>
	);
}
