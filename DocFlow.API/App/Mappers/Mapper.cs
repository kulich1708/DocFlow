using DocFlow.API.App.DTOs;
using DocFlow.API.Categories;
using DocFlow.API.Documents;
using DocFlow.API.Users;

namespace DocFlow.API.App.Mappers
{
	public static class Mapper
	{
		public static UserDTO ToUserDTO(User user)
			=> new(user.Id, user.Name, user.Surname, user.Email.Value);

		public static CategoryDTO ToCategoryDTO(Category category)
			=> new(category.Id, category.Name, category.ParentCategoryId);

		public static DocumentGeneralInfoDTO ToDocumentGeneralInfoDTO(Document document, User? user, Category? category)
			=> new(document.Id, document.Name, user == null ? null : Mapper.ToUserDTO(user),
				document.CategoryId, category?.Name, document.IsPrivate);
		public static DocumentVersionDTO ToVersionDTO(DocumentVersion version)
			=> new(version.Id, version.Version, version.Name, version.Content.Value);
		public static DocumentDTO ToDocumentDTO(Document document, User? user, Category? category, bool canEdit)
			=> new(
				ToDocumentGeneralInfoDTO(document, user, category),
				document.Versions.Select(ToVersionDTO).ToList(),
				canEdit ? document.Draft.Content.Value : null,
				canEdit ? document.Draft.InitialContent.Value : null,
				canEdit ? document.Draft.ModifiedAt : null,
				canEdit);
		public static DocumentsDTOWithPagination ToDocumentWithPagination(
			List<DocumentGeneralInfoDTO> items, int page, int pageSize, int total, bool hasMore)
			=> new(items, page, pageSize, total, hasMore);
	}
}
