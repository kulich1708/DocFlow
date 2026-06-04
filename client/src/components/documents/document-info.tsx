import { Link } from "react-router-dom";
import type { DocumentGeneralInfoDTO } from "../../api/api";
import "./document.scss";

type DocumentInfoProps = {
	generalInfo: DocumentGeneralInfoDTO;
	versionName?: string;
};

export function DocumentInfo({ generalInfo, versionName }: DocumentInfoProps) {
	const authorName = generalInfo.author === null
		? "Удалённый пользователь"
		: `${generalInfo.author.name} ${generalInfo.author.surname}`;

	return (
		<div className="document-page__info">
			<h2 className="document-page__title">
				{versionName !== undefined ? (
					<Link to={`/documents/${generalInfo.id}`} className="document-page__link">
						{generalInfo.name}
					</Link>
				) : (
					generalInfo.name
				)}
			</h2>
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
			{versionName !== undefined && (
				<p className="document-page__row">
					<span className="document-page__label">Версия:</span>
					<span>{versionName}</span>
				</p>
			)}
		</div>
	);
}
