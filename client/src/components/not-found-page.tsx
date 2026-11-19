import { Link } from "react-router-dom";
import "./not-found-page.scss";

export function NotFoundPage() {
	return (
		<div className="not-found-page">
			<h2 className="not-found-page__title">404</h2>
			<p className="not-found-page__text">Страница не найдена</p>
			<Link to="/" className="not-found-page__link">На главную</Link>
		</div>
	);
}
