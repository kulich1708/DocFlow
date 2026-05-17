using DocFlow.API.App.DTOs;
using DocFlow.API.App.Mappers;
using DocFlow.API.App.Services;
using DocFlow.API.App.Services.Auth;
using DocFlow.API.Documents;
using DocFlow.API.Persistence.Repositories;
using DocFlow.API.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DocFlow.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class DocumentsController(
		DocumentRepository documentRepository,
		UnitOfWork unitOfWork,
		DocumentDTOService documentDTOService,
		UserRepository userRepository,
		CategoryRepository categoryRepository) : ControllerBase
	{
		private readonly DocumentRepository _documentRepository = documentRepository;
		private readonly UnitOfWork _unitOfWork = unitOfWork;
		private readonly DocumentDTOService _documentDTOService = documentDTOService;
		private readonly UserRepository _userRepository = userRepository;
		private readonly CategoryRepository _categoryRepository = categoryRepository;

		[HttpGet("{id}")]
		public async Task<ActionResult<DocumentDTO>> GetDocumentById(int id)
		{
			Document document = await _documentRepository.GetAsync(id);
			bool isMe = IsCurrentUser(document.AuthorId);

			var user = document.AuthorId.HasValue ? await _userRepository.GetAsync(document.AuthorId.Value) : null;
			var category = document.CategoryId.HasValue ? await _categoryRepository.GetAsync(document.CategoryId.Value) : null;

			return Ok(Mapper.ToDocumentDTO(document, user, category, isMe));
		}

		[Authorize]
		[HttpPost]
		public async Task<ActionResult> CreateDocument([FromBody] DocumentCreateDTO dto)
		{
			int userId = User.GetUserIdOrThrow();
			Document document = new(dto.Name, userId, dto.CategoryId, dto.IsPrivate);
			_unitOfWork.Add(document);
			await _unitOfWork.SaveChangesAsync();

			return NoContent();
		}

		[Authorize]
		[HttpPost("{id}/general-info")]
		public async Task<ActionResult> UpdateDocumentGeneralInfo(int id, [FromBody] DocumentGeneralInfoDTO dto)
			=> await ExecuteAsOwner(id, document => document.ChangeGeneralInfo(dto.Name, dto.CategoryId, dto.IsPrivate));

		[Authorize]
		[HttpPost("{id}/draft")]
		public async Task<ActionResult> CreateDraftFromVersion(int id, [FromBody] int versionId)
			=> await ExecuteAsOwner(id, document => document.CreateDraftFromVersion(versionId));

		[Authorize]
		[HttpPost("{id}/draft/save")]
		public async Task<ActionResult> SaveDocumentDraft(int id, [FromBody] string content)
			=> await ExecuteAsOwner(id, document => document.SaveDraft(content));

		[Authorize]
		[HttpPost("{id}/draft/reset")]
		public async Task<ActionResult> ResetDocumentDraft(int id)
			=> await ExecuteAsOwner(id, document => document.ResetDraft());

		[Authorize]
		[HttpPost("{id}/versions")]
		public async Task<ActionResult> AddDocumentVersion(int id)
			=> await ExecuteAsOwner(id, document => document.AddVersion());

		[Authorize]
		[HttpDelete("{documentId}/versions/{versionId}")]
		public async Task<ActionResult> DeleteDocumentVersion(int documentId, int versionId)
			=> await ExecuteAsOwner(documentId, document => document.DeleteVersion(versionId));

		[Authorize]
		[HttpDelete("{documentId}")]
		public async Task<ActionResult> DeleteDocument(int documentId)
		{
			(Document? document, ActionResult? result) = await Test(documentId);
			if (result != null)
				return result;
			await _documentRepository.DeleteAsync(documentId);
			await _unitOfWork.SaveChangesAsync();
			return NoContent();
		}

		private async Task<ActionResult> ExecuteAsOwner(int documentId, Action<Document> action)
		{
			(Document? document, ActionResult? result) = await Test(documentId);
			if (result != null)
				return result;

			action(document!);
			await _unitOfWork.SaveChangesAsync();

			return NoContent();
		}
		private async Task<(Document?, ActionResult?)> Test(int documentId)
		{
			int userId = User.GetUserIdOrThrow();
			Document document = await _documentRepository.GetAsync(documentId);

			return userId == document.AuthorId ?
				(document, null) :
				(null, Unauthorized(new { message = "Нет доступа для изменения этого документа" }));
		}

		private bool IsCurrentUser(int? targetId)
		{
			int? authorizationUserId = User.GetUserId();
			return authorizationUserId.HasValue && targetId.HasValue && authorizationUserId.Value == targetId.Value;
		}
	}
}