using DocFlow.API.App.DTOs;
using DocFlow.API.Documents;
using DocFlow.API.Persistence.DbContexts;
using DocFlow.API.Users;
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
			=> await _context.Documents.Include(d => d.Versions).FirstOrDefaultAsync(d => d.Id == id)
			?? throw new InvalidOperationException($"Документ с {id} не найден");
		public async Task<DocumentsWithPagination> GetAllAsync(int? userId, int page, int pageSize)
		{
			return await GetDocumentsAsync(_context.Documents, page, pageSize, userId);
		}
		public async Task<DocumentsWithPagination> GetByCategoriesAsync(
			List<int> categoriesId, int? userId, int page, int pageSize)
		{
			var query = _context.Documents
				.Where(d => d.CategoryId.HasValue && categoriesId.Contains(d.CategoryId.Value));

			return await GetDocumentsAsync(query, page, pageSize, userId);
		}


		public async Task<DocumentsWithPagination> GetByUserAsync(int profileUserId, int? userId, int page, int pageSize)
		{
			var query = _context.Documents.Where(d => d.AuthorId == profileUserId);

			return await GetDocumentsAsync(query, page, pageSize, userId);
		}

		public async Task DeleteAuthorAsync(int userId)
		{
			await _context.Documents
				.Where(d => d.AuthorId == userId && !d.IsPrivate)
				.ExecuteUpdateAsync(setters => setters
					.SetProperty(d => d.AuthorId, (int?)null));

			await _context.Documents
				.Where(d => d.AuthorId == userId && d.IsPrivate)
				.ExecuteDeleteAsync();
		}
		public async Task DeleteAsync(int id)
		{
			Document? document = await _context.Documents.FirstOrDefaultAsync(d => d.Id == id);
			if (document != null)
				_context.Remove(document);
		}
		private async Task<DocumentsWithPagination> GetDocumentsAsync(
			IQueryable<Document> query, int page, int pageSize, int? userId)
		{
			query = query.Where(d => !d.IsPrivate || d.AuthorId == userId);

			query = query.OrderByDescending(d => d.CreatedAt);
			int total = await query.CountAsync();
			var documents = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
			return new(documents, page, pageSize, total, total > page * pageSize);
		}
	}
}
