import { useEffect } from "react";
import "./modal.scss"

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
	useEffect(() => {
		if (!isOpen) return;

		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className="modal" onClick={onClose}>
			<div className="modal__content" onClick={e => e.stopPropagation()}>
				<button
					type="button"
					className="modal__close"
					onClick={onClose}
					aria-label="Закрыть"
				>
					×
				</button>
				{children}
			</div>
		</div>
	);
}
