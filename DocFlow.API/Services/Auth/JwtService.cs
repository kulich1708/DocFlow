using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static DocFlow.API.Services.Auth.JwtService;

namespace DocFlow.API.Services.Auth
{
	public class JwtService
	{
		private readonly string _secretKey;
		private readonly int _expirationMinutes;

		public JwtService(IConfiguration config)
		{
			_secretKey = config["Jwt:SecretKey"]!;
			_expirationMinutes = int.Parse(config["Jwt:ExpirationMinutes"] ?? "60");
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
}
