using DocFlow.API.App.DTOs;
using DocFlow.API.Documents;
using DocFlow.API.Users;

namespace DocFlow.API.App.Mappers
{
	public static class Mapper
	{
		public static UserDTO ToUserDTO(User user)
			=> new(user.Id, user.Name, user.Surname, user.Email.Value);

		public static DocumentGeneralInfoDTO ToDocumentGeneralInfoDTO(Document document)
			=> new(document.Id, document.Name, document.AuthorId,
				document.CategoryId, document.IsPrivate);
		public static DocumentVersionGeneralInfoDTO ToVersionGeneralInfoDTO(DocumentVersion version)
			=> new(version.Id, version.Version);
		public static DocumentVersionDTO ToVersionDTO(DocumentVersion version)
			=> new(version.Id, version.Version, version.Content.Value);
		public static DocumentDraftDTO ToDocumentDraftDTO(DocumentDraft draft)
			=> new(draft.Content.Value, draft.ModifiedAt);
		public static DocumentDTO ToDocumentDTO(Document document, bool canEdit)
			=> new(
				ToDocumentGeneralInfoDTO(document),
				document.Versions.Select(ToVersionGeneralInfoDTO).ToList(),
				ToDocumentDraftDTO(document.Draft),
				canEdit);
		public static DocumentForAnotherUserDTO ToDocumentForAnotherUserDTO(Document document, bool canEdit)
			=> new(
				ToDocumentGeneralInfoDTO(document),
				document.Versions.Select(ToVersionGeneralInfoDTO).ToList(),
				canEdit);
		public static DocumentWithVersionDTO ToDocumentWithVersionDTO(Document document, DocumentVersion version, bool canEdit)
			=> new(
				ToDocumentGeneralInfoDTO(document),
				ToVersionDTO(version),
				canEdit);
	}
}
