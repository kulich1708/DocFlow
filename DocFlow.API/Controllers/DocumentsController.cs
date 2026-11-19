using DocFlow.API.App.DTOs;
using DocFlow.API.App.Mappers;
using DocFlow.API.App.Services;
using DocFlow.API.App.Services.Auth;
using DocFlow.API.Documents;
using DocFlow.API.Persistence.Repositories;
using DocFlow.API.Users;
using Microsoft.AspNetCore.Authorization;
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
		CategoryRepository categoryRepository,
		ActivityLogService activityLog) : ControllerBase
	{
		private readonly DocumentRepository _documentRepository = documentRepository;
		private readonly UnitOfWork _unitOfWork = unitOfWork;
		private readonly DocumentDTOService _documentDTOService = documentDTOService;
		private readonly UserRepository _userRepository = userRepository;
		private readonly CategoryRepository _categoryRepository = categoryRepository;
		private readonly ActivityLogService _activityLog = activityLog;

		[HttpGet]
		public async Task<ActionResult<DocumentsDTOWithPagination>>
			GetAll([FromQuery] PaginationDTO pagination)
		{
			(int page, int pageSize) = PaginationService.Get(pagination);
			int? authorizationUserId = User.GetUserId();
			var documents = await _documentRepository.GetAllAsync(authorizationUserId, page, pageSize);
			var documentsDTO = await _documentDTOService.MapToDocumentDTOsAsync(documents.Items);
			var result = Mapper.ToDocumentWithPagination(
				documentsDTO, documents.Page, documents.PageSize, documents.Total, documents.HasMore);

			return Ok(result);
		}

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
		public async Task<ActionResult<int>> CreateDocument([FromBody] DocumentCreateDTO dto)
		{
			int userId = User.GetUserIdOrThrow();
			Document document = new(dto.Name, userId, dto.CategoryId, dto.IsPrivate);
			_unitOfWork.Add(document);
			await _unitOfWork.SaveChangesAsync();

			var categoryPart = dto.CategoryId.HasValue ? $" в категории {dto.CategoryId.Value}" : string.Empty;
			await _activityLog.LogInformationAsync($"Пользователь {userId} создал документ {document.Id}{categoryPart}");

			return Ok(document.Id);
		}

		[Authorize]
		[HttpPut("{id}/general-info")]
		public async Task<ActionResult> UpdateDocumentGeneralInfo(int id, [FromBody] DocumentGeneralInfoDTO dto)
			=> await ExecuteAsOwner(id, document => document.ChangeGeneralInfo(dto.Name, dto.CategoryId, dto.IsPrivate),
				userId => $"Пользователь {userId} изменил данные документа {id}");

		[Authorize]
		[HttpPost("{id}/draft")]
		public async Task<ActionResult> CreateDraftFromVersion(int id, [FromBody] int versionId)
			=> await ExecuteAsOwner(id, document => document.CreateDraftFromVersion(versionId));

		[Authorize]
		[HttpPut("{id}/draft/save")]
		public async Task<ActionResult> SaveDocumentDraft(int id, [FromBody] string content)
			=> await ExecuteAsOwner(id, document => document.SaveDraft(content));

		[Authorize]
		[HttpPut("{id}/draft/reset")]
		public async Task<ActionResult> ResetDocumentDraft(int id)
			=> await ExecuteAsOwner(id, document => document.ResetDraft());

		[Authorize]
		[HttpPost("{id}/versions")]
		public async Task<ActionResult<int>> AddDocumentVersion(int id, [FromBody] DocumentAddVersionDTO dto)
		{
			(Document? document, ActionResult? result) = await Test(id);
			if (result != null)
				return result;

			int userId = User.GetUserIdOrThrow();
			var version = document!.AddVersion(dto.Name);
			await _unitOfWork.SaveChangesAsync();
			await _activityLog.LogInformationAsync($"Пользователь {userId} создал новую версию {version.Id} в документе {id}");

			return Ok(version.Id);
		}

		[Authorize]
		[HttpDelete("{documentId}/versions/{versionId}")]
		public async Task<ActionResult> DeleteDocumentVersion(int documentId, int versionId)
			=> await ExecuteAsOwner(documentId, document => document.DeleteVersion(versionId),
				userId => $"Пользователь {userId} удалил версию {versionId} в документе {documentId}");

		[Authorize]
		[HttpDelete("{documentId}")]
		public async Task<ActionResult> DeleteDocument(int documentId)
		{
			(Document? document, ActionResult? result) = await Test(documentId);
			if (result != null)
				return result;

			int userId = User.GetUserIdOrThrow();
			await _documentRepository.DeleteAsync(documentId);
			await _unitOfWork.SaveChangesAsync();
			await _activityLog.LogInformationAsync($"Пользователь {userId} удалил документ {documentId}");

			return NoContent();
		}

		[Authorize]
		[HttpPut("{documentId}/versions/{versionId}/change-general-info")]
		public async Task<ActionResult> ChangeDocumentVersionGeneralInfo(
			int documentId, int versionId, [FromBody] DocumentVersionUpdateGeneralInfoDTO dto)
			=> await ExecuteAsOwner(documentId, document => document.ChangeVersionGeneralInfo(versionId, dto.Name),
				userId => $"Пользователь {userId} переименовал версию {versionId} в документе {documentId}");

		private async Task<ActionResult> ExecuteAsOwner(
			int documentId,
			Action<Document> action,
			Func<int, string>? successMessage = null)
		{
			(Document? document, ActionResult? result) = await Test(documentId);
			if (result != null)
				return result;

			int userId = User.GetUserIdOrThrow();
			action(document!);
			await _unitOfWork.SaveChangesAsync();

			if (successMessage != null)
				await _activityLog.LogInformationAsync(successMessage(userId));

			return NoContent();
		}

		private async Task<(Document?, ActionResult?)> Test(int documentId)
		{
			int userId = User.GetUserIdOrThrow();
			Document document = await _documentRepository.GetAsync(documentId);

			if (userId != document.AuthorId)
			{
				await _activityLog.LogWarningAsync($"Пользователь {userId} попытался изменить документ {documentId} без доступа");
				return (null, Unauthorized(new { message = "Нет доступа для изменения этого документа" }));
			}

			return (document, null);
		}

		private bool IsCurrentUser(int? targetId)
		{
			int? authorizationUserId = User.GetUserId();
			return authorizationUserId.HasValue && targetId.HasValue && authorizationUserId.Value == targetId.Value;
		}
	}
}
