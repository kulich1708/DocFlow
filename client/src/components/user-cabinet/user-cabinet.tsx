import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { api, type DocumentGeneralInfoDTO, type UserDTO } from "../../api/api";
import { getUserIdFromToken } from "../../utils/get-user-id-from-token";
import { DocumentList } from "../document-list";
import "./user-cabinet.scss"

type DocumentFilter = "all" | "public" | "private";

export function UserCabinet() {
	const { id } = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const currentUserId = getUserIdFromToken(localStorage.getItem("token"));

	const isCabinetRoute = location.pathname === "/cabinet";
	const userId = isCabinetRoute ? currentUserId : Number(id);
	const isOwnCabinet = currentUserId !== null && userId === currentUserId;
	console.log(id);
	console.log(currentUserId);
	const [user, setUser] = useState<UserDTO | null>(null);
	const [documents, setDocuments] = useState<DocumentGeneralInfoDTO[]>([]);
	const [filter, setFilter] = useState<DocumentFilter>("all");

	useEffect(() => {
		if (isCabinetRoute && currentUserId === null) {
			navigate("/login");
			return;
		}
		if (userId === null || Number.isNaN(userId)) return;

		const fetchCabinet = async () => {
			setUser(await api.getUserById(userId));
			setDocuments(await api.getUserDocuments(userId));
		}
		fetchCabinet();
	}, [isCabinetRoute, currentUserId, userId, navigate]);

	const filteredDocuments = useMemo(() => {
		if (filter === "public") return documents.filter(d => !d.isPrivate);
		if (filter === "private") return documents.filter(d => d.isPrivate);
		return documents;
	}, [documents, filter]);

	if (!user) return null;

	return (
		<div className="user-cabinet">
			<div className="user-cabinet__profile">
				<div className="user-cabinet__info">
					<h2 className="user-cabinet__name">{user.name} {user.surname}</h2>
					<p className="user-cabinet__email">{user.email}</p>
				</div>
				{isOwnCabinet && (
					<Link to="cabinet/settings" className="user-cabinet__button user-cabinet__button_secondary">
						Настройки
					</Link>
				)}
			</div>

			<div className="user-cabinet__documents">
				<div className="user-cabinet__documents-header">
					<h3 className="user-cabinet__documents-title">Документы</h3>
					{isOwnCabinet && (
						<Link to="/documents/create" className="user-cabinet__button">
							Создать документ
						</Link>
					)}
				</div>

				{isOwnCabinet && (
					<div className="user-cabinet__filter">
						<button
							type="button"
							className={`user-cabinet__filter-item${filter === "all" ? " user-cabinet__filter-item_active" : ""}`}
							onClick={() => setFilter("all")}
						>
							Все
						</button>
						<button
							type="button"
							className={`user-cabinet__filter-item${filter === "public" ? " user-cabinet__filter-item_active" : ""}`}
							onClick={() => setFilter("public")}
						>
							Публичные
						</button>
						<button
							type="button"
							className={`user-cabinet__filter-item${filter === "private" ? " user-cabinet__filter-item_active" : ""}`}
							onClick={() => setFilter("private")}
						>
							Приватные
						</button>
					</div>
				)}

				<DocumentList documents={filteredDocuments} />
			</div>
		</div>
	);
}
