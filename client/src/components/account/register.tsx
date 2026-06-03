import { useState } from "react";
import { api } from "../../api/api";
import "./register.scss"

export function Register() {
	const [name, setName] = useState("");
	const [surname, setSurname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log(await api.registerUser({ name, surname, email, password }));
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
				<button className="register__button" type="submit">
					Зарегистрироваться
				</button>
			</form>
		</div>
	);
}
