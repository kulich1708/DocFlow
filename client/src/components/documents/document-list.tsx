import type { DocumentGeneralInfoDTO } from "../../api/api-client"
import { DocumentCard } from "./document-card"
import "./document-list.scss"

type DocumentListProps = {
	documents: DocumentGeneralInfoDTO[];
	documentId?: number;
}

export function DocumentList({ documents, documentId }: DocumentListProps) {
	return (
		<div className="document-grid">
			{documents.map(d => (
				<DocumentCard
					key={d.id}
					document={d}
					to={documentId !== undefined
						? `/documents/${documentId}/versions/${d.id}`
						: `/documents/${d.id}`}
				/>
			))}
		</div>
	)
}