import { Link, NavLink, useLocation } from "react-router-dom";
import { getUserIdFromToken } from "../utils/get-user-id-from-token";
import "./header.scss"

export function Header() {
	const location = useLocation();
	const isLoggedIn = getUserIdFromToken(localStorage.getItem("token")) !== null;
	const isCabinetActive = location.pathname.startsWith("/cabinet");

	return (
		<header className="header">
			<div className="header__container">
				<Link to="/" className="header__logo">Doc Flow</Link>
				<nav className="header__nav">
					<NavLink
						to="/"
						end
						className={({ isActive }) =>
							`header__link${isActive ? " header__link_active" : ""}`
						}
					>
						Главная
					</NavLink>
					{isLoggedIn ? (
						<Link
							to="/cabinet"
							className={`header__link${isCabinetActive ? " header__link_active" : ""}`}
						>
							Кабинет
						</Link>
					) : (
						<>
							<NavLink
								to="/login"
								className={({ isActive }) =>
									`header__link${isActive ? " header__link_active" : ""}`
								}
							>
								Вход
							</NavLink>
						</>
					)}
				</nav>
			</div>
		</header>
	);
}
