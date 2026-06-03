using DocFlow.API.App.DTOs;
using DocFlow.API.App.Mappers;
using DocFlow.API.App.Services;
using DocFlow.API.App.Services.Auth;
using DocFlow.API.Documents;
using DocFlow.API.Persistence.Repositories;
using DocFlow.API.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DocFlow.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController(
		UserRepository userRepository,
		DocumentRepository documentRepository,
		CategoryRepository categoryRepository,
		DocumentDTOService documentDTOService) : ControllerBase
	{
		private readonly UserRepository _userRepository = userRepository;
		private readonly DocumentRepository _documentRepository = documentRepository;
		private readonly CategoryRepository _categoryRepository = categoryRepository;
		private readonly DocumentDTOService _documentDTOService = documentDTOService;
		[HttpGet("{id}")]
		public async Task<ActionResult<UserDTO>> GetUserById(int id)
		{
			User user = await _userRepository.GetAsync(id);
			UserDTO userDTO = Mapper.ToUserDTO(user);
			return Ok(userDTO);
		}
		[HttpGet("{id}/documents")]
		public async Task<ActionResult<List<DocumentGeneralInfoDTO>>> GetUserDocuments(int id)
		{
			int? authorizationUserId = User.GetUserId();

			bool isMe = authorizationUserId.HasValue && authorizationUserId.Value == id;
			var documents = await _documentRepository.GetByUserAsync(id, isMe);
			var documentsDTO = await _documentDTOService.MapToDocumentDTOsAsync(documents, isMe);
			return Ok(documentsDTO);
		}
	}
}
