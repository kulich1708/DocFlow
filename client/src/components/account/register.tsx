import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import "./register.scss"
import { getApiError } from "../../utils/get-api-error";

export function Register() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [surname, setSurname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			const token = await api.registerUser({ name, surname, email, password });
			localStorage.setItem("token", token);
			navigate("/cabinet");
		} catch (err) {
			setError(getApiError(err) ?? '');
		}
	}

	return (
		<div className="register">
			<h2 className="register__title">Регистрация</h2>
			<form className="register__form" onSubmit={handleSubmit}>
				<label className="register__field">
					<span className="register__label">Имя</span>
					<input
						className="register__input"
						type="text"
						value={name}
						onChange={e => setName(e.target.value)}
						required
					/>
				</label>
				<label className="register__field">
					<span className="register__label">Фамилия</span>
					<input
						className="register__input"
						type="text"
						value={surname}
						onChange={e => setSurname(e.target.value)}
						required
					/>
				</label>
				<label className="register__field">
					<span className="register__label">Email</span>
					<input
						className="register__input"
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
					/>
				</label>
				<label className="register__field">
					<span className="register__label">Пароль</span>
					<input
						className="register__input"
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
				</label>
				{error && <p className="login__error">{error}</p>}
				<button className="register__button" type="submit">
					Зарегистрироваться
				</button>
				<p className="register__footer">
					Уже есть аккаунт? <Link to="/login" className="register__link">Войти</Link>
				</p>
			</form>
		</div>
	);
}
