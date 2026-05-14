using DocFlow.Domain.Users;
using DocFlow.Infrastructure.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace DocFlow.Infrastructure.Persistence.Repositories
{
	public class UserRepository(AppDbContext context)
	{
		private readonly AppDbContext _context = context;

		public async Task<List<User>> GetAllAsync()
			=> await _context.Users.ToListAsync();
		public async Task<User?> GetAsync(int id)
			=> await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

	}
}
