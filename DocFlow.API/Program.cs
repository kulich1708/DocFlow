using DocFlow.API.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;

namespace DocFlow.API
{
	public class Program
	{
		public static async Task Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);


			builder.Services.AddDbContext<AppDbContext>(options =>
				options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
			);
			ConfigureServices(builder);

			var app = builder.Build();

			await ConfigureMiddleware(app);

			app.Run();
		}

		private static void ConfigureServices(WebApplicationBuilder builder)
		{
			var services = builder.Services;

			//services.AddControllers()
			//	.AddJsonOptions(options =>
			//	{
			//		options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
			//	});



			services.AddControllers();
			services.AddEndpointsApiExplorer();

			services.AddSwaggerGen(options =>
			{
				options.SwaggerDoc("", new OpenApiInfo
				{
					Title = "Doc Flow API",
				});
			});
		}

		private static async Task ConfigureMiddleware(WebApplication app)
		{
			using var scope = app.Services.CreateScope();
			var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
			await db.Database.MigrateAsync();

			var version = "v1";

			app.UseSwagger();

			app.UseSwaggerUI(options =>
			{
				options.SwaggerEndpoint(
					$"/swagger/{version}/swagger.json",
					$"Sports Stats API {version}");

				options.RoutePrefix = "swagger";
			});


			app.UseDefaultFiles();
			app.UseStaticFiles();

			app.UseHttpsRedirection();
			app.UseAuthorization();
			app.MapControllers();
		}
	}
}
