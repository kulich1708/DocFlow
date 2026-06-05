namespace DocFlow.API.App.DTOs
{
	public record UserDTO(
		int Id, string Name, string Surname, string Email);

	public record DocumentGeneralInfoDTO(
		int Id, string Name, UserDTO? Author,
		int? CategoryId, string? CategoryName, bool IsPrivate, bool CanEdit);
	public record DocumentVersionDTO(
		int Id, int Version, string Name, string Content);
	public record DocumentDTO(
		DocumentGeneralInfoDTO GeneralInfo,
		List<DocumentVersionDTO> Versions,
		string? DraftContent,
		string? DraftInitialContent,
		DateTime? DraftModifiedAt);

	public record CategoryDTO(int Id, string Name, int? ParentId);
}
