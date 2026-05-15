using DocFlow.API.App.DTOs;
using DocFlow.API.App.Mappers;
using DocFlow.API.Persistence.Repositories;
using DocFlow.API.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DocFlow.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController(
		UserRepository userRepository) : ControllerBase
	{
		private readonly UserRepository _userRepository = userRepository;
		[HttpGet("{id}")]
		public async Task<ActionResult<UserDTO>> Get(int id)
		{
			User user = await _userRepository.GetAsync(id);
			UserDTO userDTO = Mapper.ToDTO(user);
			return Ok(userDTO);
		}
	}
}
