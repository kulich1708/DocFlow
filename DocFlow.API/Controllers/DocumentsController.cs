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

			return Ok(isMe ?
				Mapper.ToDocumentDTO(document, isMe) :
				Mapper.ToDocumentForAnotherUserDTO(document, isMe));
		}
		[Authorize]
		[HttpPost]
		public async Task<ActionResult> Create([FromBody] DocumentCreateDTO dto)
		{
			int userId = User.GetUserIdOrThrow();
			Document document = new(dto.Name, userId, dto.CategoryId, dto.IsPrivate);
			_unitOfWork.Add(document);
			await _unitOfWork.SaveChangesAsync();

			return NoContent();
		}
		[Authorize]
		[HttpPost("{id}/general-info")]
		public async Task<ActionResult> ChangeGeneralInfo(int id, [FromBody] DocumentGeneralInfoDTO dto)
		{
			int userId = User.GetUserIdOrThrow();
			Document document = await _documentRepository.GetAsync(id);
			if (userId != document.AuthorId)
				return Unauthorized(new { message = "Нет доступа для изменения этого документа" });

			document.ChangeGeneralInfo(dto.Name, dto.CategoryId, dto.IsPrivate);
			await _unitOfWork.SaveChangesAsync();

			return NoContent();
		}
		[Authorize]
		[HttpPost("{id}/draft")]
		public async Task<ActionResult> CreateDraftFromVersion(int id, [FromBody] int versionId)
		{
			int userId = User.GetUserIdOrThrow();
			Document document = await _documentRepository.GetAsync(id);
			if (userId != document.AuthorId)
				return Unauthorized(new { message = "Нет доступа для изменения этого документа" });

			document.CreateDraftFromVersion(versionId);
			await _unitOfWork.SaveChangesAsync();

			return NoContent();
		}
		[Authorize]
		[HttpPost("{id}/draft/save")]
		public async Task<ActionResult> SaveDraft(int id, [FromBody] string content)
		{
			int userId = User.GetUserIdOrThrow();
			Document document = await _documentRepository.GetAsync(id);
			if (userId != document.AuthorId)
				return Unauthorized(new { message = "Нет доступа для изменения этого документа" });

			document.SaveDraft(content);
			await _unitOfWork.SaveChangesAsync();

			return NoContent();
		}
		[Authorize]
		[HttpPost("{id}/draft/reset")]
		public async Task<ActionResult> ResetDraft(int id)
		{
			int userId = User.GetUserIdOrThrow();
			Document document = await _documentRepository.GetAsync(id);
			if (userId != document.AuthorId)
				return Unauthorized(new { message = "Нет доступа для изменения этого документа" });

			document.ResetDraft();
			await _unitOfWork.SaveChangesAsync();

			return NoContent();
		}
		[Authorize]
		[HttpPost("{id}/versions")]
		public async Task<ActionResult> AddVersion(int id)
		{
			int userId = User.GetUserIdOrThrow();
			Document document = await _documentRepository.GetAsync(id);
			if (userId != document.AuthorId)
				return Unauthorized(new { message = "Нет доступа для изменения этого документа" });

			document.AddVersion();
			await _unitOfWork.SaveChangesAsync();

			return NoContent();
		}
		[Authorize]
		[HttpDelete("{documentId}/versions/{versionId}")]
		public async Task<ActionResult> DeleteVersion(int documentId, int versionId)
		{
			int userId = User.GetUserIdOrThrow();
			Document document = await _documentRepository.GetAsync(documentId);
			if (userId != document.AuthorId)
				return Unauthorized(new { message = "Нет доступа для изменения этого документа" });

			document.DeleteVersion(versionId);
			await _unitOfWork.SaveChangesAsync();

			return NoContent();
		}
		[HttpGet("{documentId}/versions/{versionId}")]
		public async Task<ActionResult<DocumentWithVersionDTO>> GetVersions(int documentId, int versionId)
		{
			Document document = await _documentRepository.GetAsync(documentId);
			DocumentVersion version = document.GetDocumentVersion(versionId);

			int? authorizationUserId = User.GetUserId();
			bool isMe = authorizationUserId.HasValue && authorizationUserId.Value == document.AuthorId;

			return Ok(Mapper.ToDocumentWithVersionDTO(document, version, isMe));
		}
	}
}
