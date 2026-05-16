namespace DocFlow.API.App.DTOs
{
	public record UserDTO(
		int Id, string Name, string Surname, string Email);

	public record DocumentGeneralInfoDTO(
		int Id, string Name, int? AuthorId, int? CategoryId, bool IsPrivate);

	public record DocumentVersionDTO(
		int Id, int Version, string Content);
	public record DocumentVersionGeneralInfoDTO(
		int Id, int Version);

	public record DocumentDraftDTO(
		string Content, DateTime ModifiedAt);

	public record DocumentDTO(
		DocumentGeneralInfoDTO GeneralInfo,
		List<DocumentVersionGeneralInfoDTO> Versions,
		DocumentDraftDTO Draft,
		bool CanEdit);
	public record DocumentForAnotherUserDTO(
		DocumentGeneralInfoDTO GeneralInfo,
		List<DocumentVersionGeneralInfoDTO> Versions,
		bool CanEdit);
	public record DocumentWithVersionDTO(
		DocumentGeneralInfoDTO GeneralInfo,
		DocumentVersionDTO Version,
		bool CanEdit);
}
