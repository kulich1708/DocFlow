import type { DocumentGeneralInfoDTO } from "../../api/api-client"
import { DocumentCard } from "./document-card"
import "./document-list.scss"

type DocumentListProps = {
	documents: DocumentGeneralInfoDTO[]
}
export function DocumentList({ documents }: DocumentListProps) {
	return (
		<div className="document-grid">
			{documents.map(d => <DocumentCard key={d.id} document={d} />)}
		</div>
	)
}