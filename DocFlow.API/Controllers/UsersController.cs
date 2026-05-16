using DocFlow.API.App.DTOs;
using DocFlow.API.App.Mappers;
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
		DocumentRepository documentRepository) : ControllerBase
	{
		private readonly UserRepository _userRepository = userRepository;
		private readonly DocumentRepository _documentRepository = documentRepository;
		[HttpGet("{id}")]
		public async Task<ActionResult<UserDTO>> Get(int id)
		{
			User user = await _userRepository.GetAsync(id);
			UserDTO userDTO = Mapper.ToUserDTO(user);
			return Ok(userDTO);
		}
		[HttpGet("{id}/documents")]
		public async Task<ActionResult<List<DocumentDTO>>> GetDocuments(int id)
		{
			int? authorizationUserId = User.GetUserId();

			bool isMe = authorizationUserId.HasValue && authorizationUserId.Value == id;
			List<Document> documents = await _documentRepository.GetByUserAsync(id, isMe);

			return Ok(isMe ?
				documents.Select(d => Mapper.ToDocumentDTO(d, isMe)) :
				documents.Select(d => Mapper.ToDocumentForAnotherUserDTO(d, isMe)));
		}
	}
}
