import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import "./login.scss"
import { getApiError } from "../../utils/get-api-error";

export function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			const token = await api.loginUser({ email, password });
			localStorage.setItem("token", token);
			navigate("/cabinet");
		} catch (err) {
			setError(getApiError(err) ?? '');
		}
	}

	return (
		<div className="login">
			<h2 className="login__title">Вход</h2>
			<form className="login__form" onSubmit={handleSubmit}>
				<label className="login__field">
					<span className="login__label">Email</span>
					<input
						className="login__input"
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
					/>
				</label>
				<label className="login__field">
					<span className="login__label">Пароль</span>
					<input
						className="login__input"
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
				</label>
				{error && <p className="login__error">{error}</p>}
				<button className="login__button" type="submit">
					Войти
				</button>
				<p className="login__footer">
					Нет аккаунта? <Link to="/register" className="login__link">Регистрация</Link>
				</p>
			</form>
		</div>
	);
}
