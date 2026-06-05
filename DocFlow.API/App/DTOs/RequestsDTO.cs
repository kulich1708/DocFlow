namespace DocFlow.API.App.DTOs
{
	public record UserRegistrateDTO(string Name, string Surname, string Email, string Password);
	public record UserLoginDTO(string Email, string Password);
	public record ChangePasswordDTO(string CurrentPassword, string NewPassword);
	public record UserUpdateDTO(string Name, string Surname, string Email);
	public record ChangeDocumentGeneralInfoDTO(string Name, int? CategoryId, bool IsPrivate);
	public record DocumentCreateDTO(string Name, int? CategoryId, bool IsPrivate);
	public record DocumentAddVersionDTO(string Name);
	public record DocumentVersionUpdateGeneralInfoDTO(string Name);
}
