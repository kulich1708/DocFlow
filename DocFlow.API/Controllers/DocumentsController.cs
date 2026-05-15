using DocFlow.API.App.DTOs;
using DocFlow.API.App.Mappers;
using DocFlow.API.App.Services.Auth;
using DocFlow.API.Documents;
using DocFlow.API.Persistence.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DocFlow.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class DocumentsController(
		DocumentRepository documentRepository,
		UnitOfWork unitOfWork) : ControllerBase
	{
		private readonly DocumentRepository _documentRepository = documentRepository;
		private readonly UnitOfWork _unitOfWork = unitOfWork;

		[HttpGet("{id}")]
		public async Task<ActionResult<DocumentDTO>> Get(int id)
		{
			int? authorizationUserId = User.GetUserId();
			bool isMe = authorizationUserId.HasValue && authorizationUserId.Value == id;
			Document document = await _documentRepository.GetAsync(id);

			return Ok(Mapper.ToDTO(document, isMe));
		}
		[Authorize]
		[HttpPost]
		public async Task<ActionResult> Create([FromBody] DocumentCreateDTO dto)
		{
			Document document = new(dto.Name, dto.AuthorId, dto.CategoryId, dto.IsPrivate);
			_unitOfWork.Add(document);
			await _unitOfWork.SaveChangesAsync();

			return NoContent();
		}
		[Authorize]
		[HttpPost("{id}/change-general-info")]
		public async Task<ActionResult> ChangeGeneralInfo(int id, [FromBody] DocumentGeneralInfoDTO dto)
		{
			int userId = User.GetUserIdOrThrow();
			Document document = await _documentRepository.GetAsync(id);
			if (userId != document.AuthorId)
				return Unauthorized(new { message = "Нет доступа для изменения этого документа" });
			document.ChangeGeneralInfo(dto.Name, dto.CategoryId, dto.IsPrivate);

			return NoContent();
		}
	}
}
