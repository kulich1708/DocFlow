using DocFlow.API.Users;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DocFlow.API.App.Services.Auth
{
	public class JwtService
	{
		private readonly string _secretKey;
		private readonly int _expirationMinutes;

		public JwtService(IConfiguration config)
		{
			_secretKey = config["JwtSettings:SecretKey"]!;
			_expirationMinutes = int.Parse(config["JwtSettings:ExpirationMinutes"] ?? "60");
		}

		public string GenerateToken(int userId, string email)
		{
			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
			var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			var claims = new[]
			{
			new Claim("userId", userId.ToString()),
			new Claim("email", email)
		};

			var token = new JwtSecurityToken(
				claims: claims,
				expires: DateTime.UtcNow.AddMinutes(_expirationMinutes),
				signingCredentials: credentials
			);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}

		public int? GetUserIdFromToken(string token)
		{
			try
			{
				var tokenHandler = new JwtSecurityTokenHandler();
				var key = Encoding.UTF8.GetBytes(_secretKey);

				tokenHandler.ValidateToken(token, new TokenValidationParameters
				{
					ValidateIssuerSigningKey = true,
					IssuerSigningKey = new SymmetricSecurityKey(key),
					ValidateIssuer = false,
					ValidateAudience = false,
					ValidateLifetime = true,
					ClockSkew = TimeSpan.Zero
				}, out SecurityToken validatedToken);

				var jwtToken = (JwtSecurityToken)validatedToken;
				return int.Parse(jwtToken.Claims.First(x => x.Type == "userId").Value);
			}
			catch
			{
				return null;
			}
		}
	}
	public static class ClaimsPrincipalExtensions
	{
		public static int? GetUserId(this ClaimsPrincipal user)
		{
			string? value = user.FindFirst("userId")?.Value;
			return value != null ? int.Parse(value) : null;
		}
		public static int GetUserIdOrThrow(this ClaimsPrincipal user)
		{
			string? value = user.FindFirst("userId")?.Value
				?? throw new ArgumentException("Не удалось получить id пользователя");
			return int.Parse(value);
		}
	}
}
