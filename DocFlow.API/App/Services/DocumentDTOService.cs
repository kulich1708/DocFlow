using DocFlow.API.App.DTOs;
using DocFlow.API.App.Mappers;
using DocFlow.API.Documents;
using DocFlow.API.Persistence.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DocFlow.API.App.Services
{
	public class DocumentDTOService(
		UserRepository userRepository,
		CategoryRepository categoryRepository)
	{
		private readonly UserRepository _userRepository = userRepository;
		private readonly CategoryRepository _categoryRepository = categoryRepository;
		public async Task<List<DocumentGeneralInfoDTO>> MapToDocumentDTOsAsync(List<Document> documents)
		{
			var usersId = documents.Where(d => d.AuthorId.HasValue).Select(d => d.AuthorId!.Value).Distinct().ToList();
			var users = (await _userRepository.GetAsync(usersId)).ToDictionary(u => u.Id);

			var categoriesId = documents.Where(d => d.CategoryId.HasValue).Select(d => d.CategoryId!.Value).Distinct().ToList();
			var categories = (await _categoryRepository.GetAsync(categoriesId)).ToDictionary(c => c.Id);

			return documents.Select(d => Mapper.ToDocumentGeneralInfoDTO(
				d,
				d.AuthorId.HasValue ? users.GetValueOrDefault(d.AuthorId.Value) : null,
				d.CategoryId.HasValue ? categories.GetValueOrDefault(d.CategoryId.Value) : null)).ToList();
		}
	}
}
