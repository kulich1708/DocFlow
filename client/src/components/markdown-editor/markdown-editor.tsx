import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./markdown-editor.scss";

const DEMO_MARKDOWN = `# Заголовок

Текст с **жирным**, *курсивом* и \`кодом\`.

## Список

- пункт один
- пункт два

## Таблица

| Колонка | Значение |
| ------- | -------- |
| A       | 1        |
| B       | 2        |

\`\`\`js
console.log("Hello, DocFlow");
\`\`\`
`;

type MarkdownEditorProps = {
	/** true — вкладки «Написать» / «Превью»; false — только превью */
	editable: boolean;
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
};

type Tab = "write" | "preview";

export function MarkdownEditor({
	editable,
	value,
	defaultValue = DEMO_MARKDOWN,
	onChange,
	placeholder = "Введите Markdown…",
}: MarkdownEditorProps) {
	const [internalValue, setInternalValue] = useState(defaultValue);
	const [tab, setTab] = useState<Tab>("write");

	const content = value ?? internalValue;

	const handleChange = (next: string) => {
		onChange?.(next);
		if (value === undefined) {
			setInternalValue(next);
		}
	};

	const preview = (
		<div className="markdown-editor__preview markdown-body">
			{content.trim() ? (
				<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
			) : (
				<p className="markdown-editor__empty">Нечего показывать</p>
			)}
		</div>
	);

	if (!editable) {
		return <div className="markdown-editor markdown-editor_preview-only">{preview}</div>;
	}

	return (
		<div className="markdown-editor">
			<div className="markdown-editor__header">
				<nav className="markdown-editor__tabs" aria-label="Режим редактора">
					<button
						type="button"
						className={`markdown-editor__tab${tab === "write" ? " markdown-editor__tab_active" : ""}`}
						onClick={() => setTab("write")}
					>
						Написать
					</button>
					<button
						type="button"
						className={`markdown-editor__tab${tab === "preview" ? " markdown-editor__tab_active" : ""}`}
						onClick={() => setTab("preview")}
					>
						Превью
					</button>
				</nav>
			</div>
			<div className="markdown-editor__body">
				{tab === "write" ? (
					<textarea
						className="markdown-editor__textarea"
						value={content}
						onChange={e => handleChange(e.target.value)}
						placeholder={placeholder}
						spellCheck
					/>
				) : (
					preview
				)}
			</div>
		</div>
	);
}
