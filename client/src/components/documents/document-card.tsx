import { Link } from "react-router-dom";
import type { DocumentGeneralInfoDTO } from "../../api/api-client";
import preview from '../../img/documentPreview.png';
import "./document-card.scss"

type DocumentCardProps = {
	document: DocumentGeneralInfoDTO;
	to: string;
}

export function DocumentCard({ document, to }: DocumentCardProps) {
	return (
		<Link to={to} className="document-card">
			<div className="document-card__preview">
				<img src={preview} alt="фото документа" className="document-card__img" />
			</div>
			<p className="document-card__title">{document.name}</p>
			<div className="document-card__author author-document-card">
				<p className="author-document-card__name">
					{document.author === null ?
						"Удалённый пользователь" :
						`${document.author?.name} ${document.author?.surname}`}
				</p>
			</div>
		</Link>
	);
}