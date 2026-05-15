namespace DocFlow.API.App.DTOs
{
	public record UserRegistrateDTO(string Name, string Surname, string Email, string Password);
	public record UserLoginDTO(string Email, string Password);
	public record ChangePasswordDTO(string CurrentPassword, string NewPassword);
	public record ChangeDocumentGeneralInfoDTO(string Name, int? CategoryId, bool IsPrivate);
	public record DocumentCreateDTO(string Name, int AuthorId, int? CategoryId, bool IsPrivate);
}
