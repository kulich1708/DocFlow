import type { DocumentGeneralInfoDTO } from "../../api/api-client"
import { DocumentCard } from "./document-card"
import "./document-list.scss"

type DocumentListProps = {
	documents: DocumentGeneralInfoDTO[];
	documentId?: number;
	hasMore?: boolean;
	loadingMore?: boolean;
	onLoadMore?: () => void;
}

export function DocumentList({
	documents,
	documentId,
	hasMore,
	loadingMore,
	onLoadMore,
}: DocumentListProps) {
	return (
		<div className="document-list">
			<div className="document-grid">
				{documents.map(d => (
					<DocumentCard
						key={d.id}
						document={d}
						to={documentId !== undefined
							? `/documents/${documentId}/versions/${d.id}`
							: `/documents/${d.id}`}
						showAuthor={documentId === undefined}
					/>
				))}
			</div>

			{hasMore && onLoadMore && (
				<div className="document-list__more">
					<button
						type="button"
						className="document-list__more-button"
						onClick={onLoadMore}
						disabled={loadingMore}
					>
						{loadingMore ? "Загрузка..." : "Показать ещё"}
					</button>
				</div>
			)}
		</div>
	)
}
