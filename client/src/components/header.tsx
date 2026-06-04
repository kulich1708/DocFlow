import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { getUserIdFromToken } from "../utils/get-user-id-from-token";
import { Modal } from "./modal/modal";
import "./header.scss"

export function Header() {
	const location = useLocation();
	const isLoggedIn = getUserIdFromToken(localStorage.getItem("token")) !== null;
	const isCabinetActive = location.pathname.startsWith("/cabinet");
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
					{isLoggedIn && (
						<Link
							to="/cabinet"
							className={`header__link${isCabinetActive ? " header__link_active" : ""}`}
						>
							Кабинет
						</Link>
					)}
					{!isLoggedIn && (
						<NavLink
							to="/login"
							className={({ isActive }) =>
								`header__link${isActive ? " header__link_active" : ""}`
							}
						>
							Вход
						</NavLink>
					)}
					{isLoggedIn ? (
						<Link to="/documents/create" className="header__button">
							Создать документ
						</Link>
					) : (
						<button
							type="button"
							className="header__button"
							onClick={() => setIsAuthModalOpen(true)}
						>
							Создать документ
						</button>
					)}
				</nav>
			</div>

			<Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
				<p className="header__modal-text">
					Создание документов доступно только зарегистрированным пользователям.
				</p>
				<div className="header__modal-links">
					<Link
						to="/login"
						className="header__button"
						onClick={() => setIsAuthModalOpen(false)}
					>
						Вход
					</Link>
					<Link
						to="/register"
						className="header__button"
						onClick={() => setIsAuthModalOpen(false)}
					>
						Регистрация
					</Link>
				</div>
			</Modal>
		</header>
	);
}
