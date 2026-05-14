using DocFlow.Infrastructure.Persistence.DbContexts;
using System;
using System.Collections.Generic;
using System.Text;

namespace DocFlow.Infrastructure.Persistence.Repositories
{
	public class UnitOfWork(AppDbContext context)
	{
		private readonly AppDbContext _context = context;

		public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
			=> await _context.SaveChangesAsync(cancellationToken);
		public void Add<T>(T entity) where T : class
			=> _context.Set<T>().Add(entity);
	}
}
