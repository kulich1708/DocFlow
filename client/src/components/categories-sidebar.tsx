import './categories-sidebar.scss';
import { type CategoryDTO } from "../api/api-client";

interface CategoryNode extends CategoryDTO {
	children: CategoryNode[];
}

interface CategoriesSidebarProps {
	categories: CategoryDTO[];
	selectedCategoryId?: number | null;
	onCategorySelect?: (categoryId: number | null) => void;
	variant?: 'sidebar' | 'picker';
}

export function CategoriesSidebar({
	categories,
	selectedCategoryId,
	onCategorySelect,
	variant = 'sidebar',
}: CategoriesSidebarProps) {
	const selectable = onCategorySelect !== undefined;

	const buildCategoryTree = (): CategoryNode[] => {
		const map = new Map<number, CategoryNode>();
		const roots: CategoryNode[] = [];

		categories.forEach(category => {
			map.set(category.id, { ...category, children: [] });
		});

		categories.forEach(category => {
			const node = map.get(category.id);
			if (!node) return;

			if (category.parentId === null) {
				roots.push(node);
			} else {
				const parent = map.get(category.parentId);
				if (parent) {
					parent.children.push(node);
				} else {
					roots.push(node);
				}
			}
		});

		return roots;
	};

	const renderCategories = (categoriesList: CategoryNode[]): React.ReactNode => {
		return categoriesList.map(category => {
			const titleClassName = `category-item__title${selectedCategoryId === category.id ? " category-item__title_selected" : ""}${selectable ? " category-item__title_selectable" : ""}`;

			return (
				<div key={category.id} className="category-item">
					{selectable ? (
						<button
							type="button"
							className={titleClassName}
							onClick={() => onCategorySelect(category.id)}
						>
							{category.name}
						</button>
					) : (
						<div className={titleClassName}>
							{category.name}
						</div>
					)}
					{category.children.length > 0 && renderCategories(category.children)}
				</div>
			);
		});
	};

	const categoryTree = buildCategoryTree();
	const rootClassName = `categories-sidebar${variant === 'picker' ? " categories-sidebar_picker" : ""}`;

	return (
		<div className={rootClassName}>
			<h3 className="categories-sidebar__title">Категории</h3>
			<div className="categories-sidebar__list">
				{selectable && (
					<button
						type="button"
						className={`category-item__title category-item__title_selectable${selectedCategoryId === null ? " category-item__title_selected" : ""}`}
						onClick={() => onCategorySelect(null)}
					>
						Без категории
					</button>
				)}
				{renderCategories(categoryTree)}
			</div>
		</div>
	);
}
