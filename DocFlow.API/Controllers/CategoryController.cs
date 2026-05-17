using DocFlow.API.App.DTOs;
using DocFlow.API.App.Mappers;
using DocFlow.API.App.Services;
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
		public async Task<ActionResult<List<DocumentGeneralInfoDTO>>> GetDocumentsByCategory(int id)
		{
			List<int> categoriesId = await _categoryRepository.GetAllChildIdAsync(id);
			var documents = await _documentRepository.GetByCategoriesAsync(categoriesId);
			var documentsDTO = await _documentDTOService.MapToDocumentDTOsAsync(documents, false);
			return Ok(documentsDTO);
		}
		[HttpGet]
		public async Task<ActionResult<List<CategoryDTO>>> GetCategories()
			=> Ok((await _categoryRepository.GetAllAsync()).Select(Mapper.ToCategoryDTO));
	}
}
