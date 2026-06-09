import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { api, type UserDTO } from "../../api/api";
import { usePaginatedDocuments, emptyDocumentsPage } from "../../hooks/use-paginated-documents";
import { getApiError } from "../../utils/get-api-error";
import { getUserIdFromToken } from "../../utils/get-user-id-from-token";
import { PageStatus } from "../page-status/page-status";
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
	const shouldRedirectToLogin = isCabinetRoute && currentUserId === null;
	const shouldRedirectFromSettings = isSettingsActive && !isOwnCabinet;
	const shouldFetchUser = documentsResetKey !== null && !shouldRedirectFromSettings;

	const [user, setUser] = useState<UserDTO | null>(null);
	const [userLoading, setUserLoading] = useState(true);
	const [userError, setUserError] = useState("");

	const fetchDocumentsPage = useCallback(
		(page: number) => {
			if (documentsResetKey === null) {
				return Promise.resolve(emptyDocumentsPage);
			}
			return api.getUserDocuments(documentsResetKey, { Page: page });
		},
		[documentsResetKey],
	);

	const { documents, hasMore, loading, loadingMore, error, loadMore } = usePaginatedDocuments(
		fetchDocumentsPage,
		documentsResetKey,
	);

	useEffect(() => {
		if (!shouldFetchUser || documentsResetKey === null) {
			return;
		}

		const fetchUser = async () => {
			setUserLoading(true);
			setUserError("");
			setUser(null);

			try {
				setUser(await api.getUserById(documentsResetKey));
			} catch (err) {
				setUserError(getApiError(err, "Не удалось загрузить профиль"));
			} finally {
				setUserLoading(false);
			}
		};

		void fetchUser();
	}, [shouldFetchUser, documentsResetKey]);

	const handleLogout = async () => {
		try {
			await api.logoutUser();
		}
		catch { return }
		localStorage.removeItem("token");
		navigate("/login");
	}

	if (shouldRedirectToLogin) {
		return <Navigate to="/login" replace />;
	}

	if (shouldRedirectFromSettings) {
		return <Navigate to="/cabinet" replace />;
	}

	if (documentsResetKey === null) {
		return (
			<div className="user-cabinet">
				<PageStatus error="Некорректный адрес профиля" />
			</div>
		);
	}

	if (userLoading) {
		return (
			<div className="user-cabinet">
				<PageStatus loading />
			</div>
		);
	}

	if (userError || !user) {
		return (
			<div className="user-cabinet">
				<PageStatus error={userError || "Профиль не найден"} />
			</div>
		);
	}

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
				<>
					{error && <PageStatus error={error} />}
					<CabinetDocuments
						documents={documents}
						isOwnCabinet={isOwnCabinet}
						loading={loading}
						hasMore={hasMore}
						loadingMore={loadingMore}
						onLoadMore={loadMore}
					/>
				</>
			)}
		</div>
	);
}
