import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { api, type UserDTO } from "../../api/api";
import { usePaginatedDocuments, emptyDocumentsPage } from "../../hooks/use-paginated-documents";
import { getUserIdFromToken } from "../../utils/get-user-id-from-token";
import { CabinetDocuments } from "./cabinet-documents";
import { Settings } from "./settings";
import "./user-cabinet.scss"

export function UserCabinet() {
	const { id } = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const currentUserId = getUserIdFromToken(localStorage.getItem("token"));

	const isCabinetRoute = location.pathname.startsWith("/cabinet");
	const isSettingsActive = location.pathname === "/cabinet/settings";
	const userId = isCabinetRoute ? currentUserId : Number(id);
	const isOwnCabinet = currentUserId !== null && userId === currentUserId;
	const documentsResetKey = userId !== null && !Number.isNaN(userId) ? userId : null;

	const [user, setUser] = useState<UserDTO | null>(null);

	const fetchDocumentsPage = useCallback(
		(page: number) => {
			if (documentsResetKey === null) {
				return Promise.resolve(emptyDocumentsPage);
			}
			return api.getUserDocuments(documentsResetKey, { Page: page });
		},
		[documentsResetKey],
	);

	const { documents, hasMore, loadingMore, loadMore } = usePaginatedDocuments(
		fetchDocumentsPage,
		documentsResetKey,
	);

	useEffect(() => {
		if (isCabinetRoute && currentUserId === null) {
			navigate("/login");
			return;
		}
		if (isSettingsActive && !isOwnCabinet) {
			navigate("/cabinet");
			return;
		}
		if (documentsResetKey === null) return;

		const fetchUser = async () => {
			setUser(await api.getUserById(documentsResetKey));
		};
		fetchUser();
	}, [isCabinetRoute, isSettingsActive, isOwnCabinet, currentUserId, documentsResetKey, navigate]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	}

	if (!user) return null;

	return (
		<div className="user-cabinet">
			<div className="user-cabinet__profile">
				<div className="user-cabinet__info">
					<h2 className="user-cabinet__name">{user.name} {user.surname}</h2>
					<p className="user-cabinet__email">{user.email}</p>
				</div>
				{isOwnCabinet && !isSettingsActive && (
					<div className="user-cabinet__actions">
						<Link to="/cabinet/settings" className="user-cabinet__button user-cabinet__button_secondary">
							Настройки
						</Link>
						<button
							type="button"
							className="user-cabinet__button user-cabinet__button_secondary"
							onClick={handleLogout}
						>
							Выйти
						</button>
					</div>
				)}
			</div>

			{isSettingsActive ? (
				<Settings
					key={user.id}
					user={user}
					onCancel={() => navigate("/cabinet")}
					onSaved={updatedUser => {
						setUser(updatedUser);
						navigate("/cabinet");
					}}
				/>
			) : (
				<CabinetDocuments
					documents={documents}
					isOwnCabinet={isOwnCabinet}
					hasMore={hasMore}
					loadingMore={loadingMore}
					onLoadMore={loadMore}
				/>
			)}
		</div>
	);
}
