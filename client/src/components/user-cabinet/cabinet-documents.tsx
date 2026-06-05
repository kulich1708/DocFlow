import { useMemo, useState } from "react";
import type { DocumentGeneralInfoDTO } from "../../api/api";
import { DocumentList } from "../documents/document-list";
import "./cabinet-documents.scss"

type DocumentFilter = "all" | "public" | "private";

type CabinetDocumentsProps = {
	documents: DocumentGeneralInfoDTO[];
	isOwnCabinet: boolean;
	hasMore?: boolean;
	loadingMore?: boolean;
	onLoadMore?: () => void;
}

export function CabinetDocuments({
	documents,
	isOwnCabinet,
	hasMore,
	loadingMore,
	onLoadMore,
}: CabinetDocumentsProps) {
	const [filter, setFilter] = useState<DocumentFilter>("all");

	const filteredDocuments = useMemo(() => {
		if (filter === "public") return documents.filter(d => !d.isPrivate);
		if (filter === "private") return documents.filter(d => d.isPrivate);
		return documents;
	}, [documents, filter]);

	return (
		<div className="cabinet-documents">
			<h3 className="cabinet-documents__title">Документы</h3>

			{isOwnCabinet && (
				<div className="cabinet-documents__filter">
					<button
						type="button"
						className={`cabinet-documents__filter-item${filter === "all" ? " cabinet-documents__filter-item_active" : ""}`}
						onClick={() => setFilter("all")}
					>
						Все
					</button>
					<button
						type="button"
						className={`cabinet-documents__filter-item${filter === "public" ? " cabinet-documents__filter-item_active" : ""}`}
						onClick={() => setFilter("public")}
					>
						Публичные
					</button>
					<button
						type="button"
						className={`cabinet-documents__filter-item${filter === "private" ? " cabinet-documents__filter-item_active" : ""}`}
						onClick={() => setFilter("private")}
					>
						Приватные
					</button>
				</div>
			)}

			<DocumentList
				documents={filteredDocuments}
				hasMore={hasMore}
				loadingMore={loadingMore}
				onLoadMore={onLoadMore}
			/>
		</div>
	);
}
