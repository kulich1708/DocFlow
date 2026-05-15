using DocFlow.API.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace DocFlow.API.Categories
{
	public class Category : BaseEntity
	{
		public int? ParentCategoryId { get; private set; } = null;
		public string Name { get; private set; }
		public Category(string name, int? parentCategoryId = null)
		{
			SetName(name);
			SetParentCategory(parentCategoryId);
		}
		public void SetName(string name)
		{
			if (string.IsNullOrWhiteSpace(name))
				throw new ArgumentException("Имя категории не должно быть пустым");

			Name = name;
		}
		public void SetParentCategory(int? parentId)
			=> ParentCategoryId = parentId;
	}
}
