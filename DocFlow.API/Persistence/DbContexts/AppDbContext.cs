using DocFlow.API.Categories;
using DocFlow.API.Documents;
using DocFlow.API.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;
using System.Text;

namespace DocFlow.API.Persistence.DbContexts
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
		public DbSet<User> Users { get; set; }
		public DbSet<Category> Categories { get; set; }
		public DbSet<Document> Documents { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			var converterDocumentContent = new ValueConverter<DocumentContent, string>(
				v => v.Value,
				v => new DocumentContent(v)
			);
			var converterEmail = new ValueConverter<Email, string>(
				u => u.Value,
				u => new Email(u)
			);
			modelBuilder.Entity<Document>()
				.OwnsOne(d => d.Draft, draft =>
				{
					draft.Property(d => d.Content)
					.HasColumnName("DraftContent")
					.HasConversion(converterDocumentContent);

					draft.Property(d => d.ModifiedAt)
					.HasColumnName("DraftModifiedAt");
				});
			modelBuilder.Entity<DocumentVersion>()
				.Property(v => v.Content)
				.HasConversion(converterDocumentContent);
			modelBuilder.Entity<User>()
				.OwnsOne(u => u.Email)
				.Property(e => e.Value)
				.HasColumnName("Email");
		}
	}
}
