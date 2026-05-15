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

		public async Task<Document?> GetAsync(int id)
			=> await _context.Documents.FirstOrDefaultAsync(d => d.Id == id);
		public async Task<List<Document>> GetByCategoriesAsync(List<int> categoriesId)
			=> await _context.Documents.Where(d => categoriesId.Contains(d.CategoryId)).ToListAsync();

		public async Task<List<Document>> GetByUserAsync(int userId)
			=> await _context.Documents.Where(d => d.AuthorId == userId).ToListAsync();
	}
}
