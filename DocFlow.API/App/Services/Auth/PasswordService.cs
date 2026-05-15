namespace DocFlow.API.App.Services.Auth
{
	public class PasswordService
	{
		private const int _workFactor = 12;

		public string HashPassword(string password)
			=> BCrypt.Net.BCrypt.HashPassword(password, workFactor: _workFactor);

		public bool VerifyPassword(string password, string hash)
			=> BCrypt.Net.BCrypt.Verify(password, hash);
	}
}
