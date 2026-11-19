import { Link } from "react-router-dom";
import type { DocumentGeneralInfoDTO } from "../../api/api-client";
import preview from '../../img/documentPreview.png';
import "./document-card.scss"

type DocumentCardProps = {
	document: DocumentGeneralInfoDTO;
	to: string;
	showAuthor?: boolean;
}

export function DocumentCard({ document, to, showAuthor = true }: DocumentCardProps) {
	const authorName = document.author === null
		? "Удалённый пользователь"
		: `${document.author.name} ${document.author.surname}`;

	return (
		<article className="document-card">
			<Link to={to} className="document-card__preview">
				<img src={preview} alt="фото документа" className="document-card__img" />
			</Link>
			<Link to={to} className="document-card__title">
				{document.name}
			</Link>
			{showAuthor && (
				<div className="document-card__author author-document-card">
					{document.author === null ? (
						<p className="author-document-card__name">{authorName}</p>
					) : (
						<Link to={`/users/${document.author.id}`} className="author-document-card__link">
							{authorName}
						</Link>
					)}
				</div>
			)}
		</article>
	);
}
