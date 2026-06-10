using DocFlow.API.App.DTOs;
using DocFlow.API.App.Mappers;
using DocFlow.API.App.Services;
using DocFlow.API.App.Services.Auth;
using DocFlow.API.Persistence.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DocFlow.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CategoryController(
		UnitOfWork unitOfWork,
		CategoryRepository categoryRepository,
		DocumentRepository documentRepository,
		DocumentDTOService documentDTOService) : ControllerBase
	{
		private readonly UnitOfWork _unitOfWork = unitOfWork;
		private readonly CategoryRepository _categoryRepository = categoryRepository;
		private readonly DocumentRepository _documentRepository = documentRepository;
		private readonly DocumentDTOService _documentDTOService = documentDTOService;

		[HttpGet("{id}/documents")]
		public async Task<ActionResult<DocumentsDTOWithPagination>>
			GetDocumentsByCategory(int id, [FromQuery] PaginationDTO pagination)
		{
			(int page, int pageSize) = PaginationService.Get(pagination);
			List<int> categoriesId = await _categoryRepository.GetAllChildIdAsync(id);
			int? authorizationUserId = User.GetUserId();

			var documents = await _documentRepository.GetByCategoriesAsync(
				categoriesId, authorizationUserId, page, pageSize);
			var documentsDTO = await _documentDTOService.MapToDocumentDTOsAsync(documents.Items);
			var result = Mapper.ToDocumentWithPagination(
				documentsDTO, documents.Page, documents.PageSize, documents.Total, documents.HasMore);
			return Ok(result);
		}
		[HttpGet]
		public async Task<ActionResult<List<CategoryDTO>>> GetCategories()
			=> Ok((await _categoryRepository.GetAllAsync()).Select(Mapper.ToCategoryDTO));
	}
}
