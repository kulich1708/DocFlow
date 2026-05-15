namespace DocFlow.API.DTOs
{
	public record UserRegistrateDTO(string Name, string Surname, string Email, string Password);
	public record UserLoginDTO(string Email, string Password);
	public record ChangePasswordDTO(string CurrentPassword, string NewPassword);
}
