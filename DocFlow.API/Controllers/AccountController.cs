using DocFlow.API.App.DTOs;
using DocFlow.API.App.Services.Auth;
using DocFlow.API.Persistence.Repositories;
using DocFlow.API.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DocFlow.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AccountController(
		JwtService jwtService,
		PasswordService passwordService,
		UnitOfWork unitOfWork,
		UserRepository userRepository,
		DocumentRepository documentRepository) : ControllerBase
	{
		private readonly JwtService _jwtService = jwtService;
		private readonly PasswordService _passwordService = passwordService;
		private readonly UnitOfWork _unitOfWork = unitOfWork;
		private readonly UserRepository _userRepository = userRepository;
		private readonly DocumentRepository _documentRepository = documentRepository;

		[HttpPost("register")]
		public async Task<ActionResult<string>> Register([FromBody] UserRegistrateDTO dto)
		{
			User user = new(dto.Name, dto.Surname, dto.Email, _passwordService.HashPassword(dto.Password));
			_unitOfWork.Add(user);
			await _unitOfWork.SaveChangesAsync();

			return Ok(_jwtService.GenerateToken(user.Id, user.Email.Value));
		}

		[HttpPost("login")]
		public async Task<ActionResult> Login([FromBody] UserLoginDTO dto)
		{
			User user = await _userRepository.GetByEmailAsync(dto.Email);
			if (user == null)
				return Unauthorized(new { message = "Данный email не зарегестрирован" });

			if (!_passwordService.VerifyPassword(dto.Password, user.PasswordHash))
				return Unauthorized(new { message = "Неверный пароль" });

			return Ok(_jwtService.GenerateToken(user.Id, user.Email.Value));
		}

		[Authorize]
		[HttpPost("change-password")]
		public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDTO dto)
		{
			int userId = User.GetUserIdOrThrow();
			User user = await _userRepository.GetAsync(userId);
			if (!_passwordService.VerifyPassword(dto.CurrentPassword, user.PasswordHash))
				return BadRequest(new { message = "Неверный текущий пароль" });

			user.SetPassword(_passwordService.HashPassword(dto.NewPassword));
			await _unitOfWork.SaveChangesAsync();

			return NoContent();
		}
		[Authorize]
		[HttpDelete]
		public async Task<ActionResult> DeleteAccount()
		{
			int userId = User.GetUserIdOrThrow();
			await _documentRepository.DeleteAuthor(userId);
			await _userRepository.DeleteAsync(userId);
			await _unitOfWork.SaveChangesAsync();

			return NoContent();
		}
	}
}
