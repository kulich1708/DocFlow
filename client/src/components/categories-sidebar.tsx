import './categories-sidebar.scss';
import { type CategoryDTO } from "../api/api-client";

interface CategoryNode extends CategoryDTO {
	children: CategoryNode[];
}

interface CategoriesSidebarProps {
	categories: CategoryDTO[];
}

export function CategoriesSidebar({ categories }: CategoriesSidebarProps) {
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
		return categoriesList.map(category => (
			<div key={category.id} className="category-item">
				<div className="category-item__title">
					{category.name}
				</div>
				{category.children.length > 0 && renderCategories(category.children)}
			</div>
		));
	};

	const categoryTree = buildCategoryTree();

	return (
		<div className="categories-sidebar">
			<h3 className="categories-sidebar__title">Категории</h3>
			<div className="categories-sidebar__list">
				{renderCategories(categoryTree)}
			</div>
		</div>
	);
};