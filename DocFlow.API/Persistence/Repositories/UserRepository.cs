using DocFlow.API.Users;
using DocFlow.API.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace DocFlow.API.Persistence.Repositories
{
	public class UserRepository(AppDbContext context)
	{
		private readonly AppDbContext _context = context;

		public async Task<List<User>> GetAllAsync()
			=> await _context.Users.ToListAsync();
		public async Task<User> GetAsync(int id)
			=> await _context.Users.FirstOrDefaultAsync(u => u.Id == id)
			?? throw new InvalidOperationException($"Пользователь с айди {id} не найден");
		public async Task<User> GetByEmailAsync(string email)
			=> await _context.Users.FirstOrDefaultAsync(u => u.Email.Value == email)
			?? throw new InvalidOperationException($"Пользователь с почтой {email} не найден");
		public async Task DeleteAsync(int id)
		{
			User? user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
			if (user != null)
				_context.Remove(user);
		}

	}
}
