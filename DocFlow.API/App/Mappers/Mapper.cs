using DocFlow.API.App.DTOs;
using DocFlow.API.Documents;
using DocFlow.API.Users;

namespace DocFlow.API.App.Mappers
{
	public static class Mapper
	{
		public static UserDTO ToDTO(User user)
			=> new(user.Id, user.Name, user.Surname, user.Email.Value);

		public static DocumentGeneralInfoDTO ToDocumentGeneralInfoDTO(Document document)
			=> new(document.Id, document.Name, document.AuthorId,
				document.CategoryId, document.IsPrivate);
		public static DocumentVersionDTO ToDTO(DocumentVersion version)
			=> new(version.Id, version.Version, version.Content.Value);
		public static DocumentDraftDTO ToDTO(DocumentDraft draft)
			=> new(draft.Content.Value, draft.ModifiedAt);
		public static DocumentDTO ToDTO(Document document)
			=> new(
				ToDocumentGeneralInfoDTO(document),
				document.Versions.Select(ToDTO).ToList(),
				ToDTO(document.Draft),
				false);
	}
}
