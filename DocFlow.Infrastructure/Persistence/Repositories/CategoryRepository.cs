using DocFlow.Domain.Categories;
using DocFlow.Infrastructure.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Dapper;
using System;
using System.Collections.Generic;
using System.Text;

namespace DocFlow.Infrastructure.Persistence.Repositories
{
	public class CategoryRepository(AppDbContext context)
	{
		private readonly AppDbContext _context = context;

		public async Task<List<int>> GetAllChildIdAsync(int id)
		{
			var sql = @"
                WITH RECURSIVE category_tree AS (
                    SELECT ""Id""
                    FROM ""Categories""
                    WHERE ""Id"" = @id
                    
                    UNION ALL
                    
                    SELECT c.""Id""
                    FROM ""Categories"" c
                    JOIN category_tree ct ON c.""ParentCategoryId"" = ct.""Id""
                )
                CYCLE ""Id"" SET is_cycle USING path
                SELECT DISTINCT ""Id"" FROM category_tree";

			var connection = _context.Database.GetDbConnection();
			var ids = await connection.QueryAsync<int>(sql, new { id });

			return ids.ToList();
		}
		public async Task<List<Category>> GetChildAsync(int id)
			=> await _context.Categories.Where(c => c.ParentCategoryId == id).ToListAsync();
		public async Task<List<Category>> GetAllAsync()
			=> await _context.Categories.ToListAsync();

		public async Task<Category?> GetAsync(int id)
			=> await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
	}
}
