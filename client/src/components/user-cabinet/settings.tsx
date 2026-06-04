import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, type UserDTO } from "../../api/api";
import { getApiError } from "../../utils/get-api-error";
import { Modal } from "../modal/modal";
import "./settings.scss"

type SettingsProps = {
	user: UserDTO;
	onCancel: () => void;
	onSaved: (user: UserDTO) => void;
}

export function Settings({ user, onCancel, onSaved }: SettingsProps) {
	const navigate = useNavigate();

	const [name, setName] = useState(user.name);
	const [surname, setSurname] = useState(user.surname);
	const [email, setEmail] = useState(user.email);
	const [formError, setFormError] = useState("");

	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [deleteError, setDeleteError] = useState("");

	const handleProfileSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormError("");

		try {
			const updatedUser = await api.updateUser({ name, surname, email });
			onSaved(updatedUser);
		} catch (err) {
			setFormError(getApiError(err) ?? "Не удалось сохранить");
		}
	}

	const handlePasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordError("");

		try {
			await api.changeUserPassword({ currentPassword, newPassword });
			setCurrentPassword("");
			setNewPassword("");
			setIsPasswordModalOpen(false);
		} catch (err) {
			setPasswordError(getApiError(err) ?? "Не удалось изменить пароль");
		}
	}

	const handleDeleteAccount = async () => {
		setDeleteError("");

		try {
			await api.deleteUserAccount();
			localStorage.removeItem("token");
			navigate("/login");
		} catch (err) {
			setDeleteError(getApiError(err) ?? "Не удалось удалить аккаунт");
		}
	}

	const openPasswordModal = () => {
		setPasswordError("");
		setCurrentPassword("");
		setNewPassword("");
		setIsPasswordModalOpen(true);
	}

	const openDeleteModal = () => {
		setDeleteError("");
		setIsDeleteModalOpen(true);
	}

	return (
		<div className="settings">
			<h3 className="settings__title">Настройки</h3>

			<form id="settings-form" className="settings__form" onSubmit={handleProfileSubmit}>
				<label className="settings__field">
					<span className="settings__label">Имя</span>
					<input
						className="settings__input"
						type="text"
						value={name}
						onChange={e => setName(e.target.value)}
						required
					/>
				</label>
				<label className="settings__field">
					<span className="settings__label">Фамилия</span>
					<input
						className="settings__input"
						type="text"
						value={surname}
						onChange={e => setSurname(e.target.value)}
						required
					/>
				</label>
				<label className="settings__field">
					<span className="settings__label">Email</span>
					<input
						className="settings__input"
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
					/>
				</label>
				{formError && <p className="settings__error">{formError}</p>}
			</form>

			<div className="settings__footer">
				<button
					type="button"
					className="settings__button settings__button_secondary"
					onClick={onCancel}
				>
					Отмена
				</button>
				<button
					type="submit"
					className="settings__button"
					form="settings-form"
				>
					Сохранить
				</button>
			</div>

			<div className="settings__actions">
				<button
					type="button"
					className="settings__link"
					onClick={openPasswordModal}
				>
					Изменить пароль
				</button>
				<button
					type="button"
					className="settings__link settings__link_danger"
					onClick={openDeleteModal}
				>
					Удалить аккаунт
				</button>
			</div>

			<Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)}>
				<h3 className="settings__modal-title">Изменить пароль</h3>
				<form className="settings__form" onSubmit={handlePasswordSubmit}>
					<label className="settings__field">
						<span className="settings__label">Старый пароль</span>
						<input
							className="settings__input"
							type="password"
							value={currentPassword}
							onChange={e => setCurrentPassword(e.target.value)}
							required
						/>
					</label>
					<label className="settings__field">
						<span className="settings__label">Новый пароль</span>
						<input
							className="settings__input"
							type="password"
							value={newPassword}
							onChange={e => setNewPassword(e.target.value)}
							required
						/>
					</label>
					{passwordError && <p className="settings__error">{passwordError}</p>}
					<button className="settings__button" type="submit">
						Изменить
					</button>
				</form>
			</Modal>

			<Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
				<h3 className="settings__modal-title">Удаление аккаунта</h3>
				<p className="settings__modal-text">
					Ваш аккаунт будет удалён. Вы уверены?
				</p>
				{deleteError && <p className="settings__error">{deleteError}</p>}
				<div className="settings__modal-actions">
					<button
						type="button"
						className="settings__button settings__button_secondary"
						onClick={() => setIsDeleteModalOpen(false)}
					>
						Отмена
					</button>
					<button
						type="button"
						className="settings__button settings__button_danger"
						onClick={handleDeleteAccount}
					>
						Удалить
					</button>
				</div>
			</Modal>
		</div>
	);
}
