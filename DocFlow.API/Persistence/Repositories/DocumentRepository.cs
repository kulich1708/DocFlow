using DocFlow.API.Documents;
using DocFlow.API.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace DocFlow.API.Persistence.Repositories
{
	public class DocumentRepository(AppDbContext context)
	{
		private readonly AppDbContext _context = context;

		public async Task<Document> GetAsync(int id)
			=> await _context.Documents.FirstOrDefaultAsync(d => d.Id == id)
			?? throw new InvalidOperationException($"Документ с {id} не найден");
		public async Task<List<Document>> GetByCategoriesAsync(List<int> categoriesId)
			=> await _context.Documents.Where(d => d.CategoryId.HasValue && categoriesId.Contains(d.CategoryId.Value)).ToListAsync();

		public async Task<List<Document>> GetByUserAsync(int userId, bool includePrivate = false)
		{
			var query = _context.Documents.Where(d => d.AuthorId == userId);
			if (!includePrivate)
				query = query.Where(d => !d.IsPrivate);
			return await query.ToListAsync();
		}

		public async Task DeleteAuthor(int userId)
		{
			await _context.Documents
				.Where(d => d.AuthorId == userId && !d.IsPrivate)
				.ExecuteUpdateAsync(setters => setters
					.SetProperty(d => d.AuthorId, (int?)null));

			await _context.Documents
				.Where(d => d.AuthorId == userId && d.IsPrivate)
				.ExecuteDeleteAsync();
		}
	}
}
