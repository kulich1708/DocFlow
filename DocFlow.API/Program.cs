using DocFlow.API.App.Services;
using DocFlow.API.App.Services.Auth;
using DocFlow.API.Persistence.DbContexts;
using DocFlow.API.Persistence.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text;

namespace DocFlow.API
{
	public class Program
	{

		private readonly static string _version = "v1";
		private readonly static string _name = "Doc Flow";
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

			var jwtSettings = builder.Configuration.GetSection("JwtSettings");
			var secretKey = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]);

			services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
			.AddJwtBearer(options =>
			{
				options.RequireHttpsMetadata = true;
				options.SaveToken = true;
				options.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuer = false,
					ValidateAudience = false,
					ValidateLifetime = true,
					ValidateIssuerSigningKey = true,
					IssuerSigningKey = new SymmetricSecurityKey(secretKey),
					ClockSkew = TimeSpan.Zero
				};
			});

			services.AddAuthorization();
			services.AddControllers();
			services.AddEndpointsApiExplorer();

			services.AddSwaggerGen(options =>
			{
				options.SwaggerDoc(_version, new OpenApiInfo
				{
					Title = $"{_name} API",
					Version = _version
				});
				options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
				{
					Name = "Authorization",
					Type = SecuritySchemeType.ApiKey,
					Scheme = "Bearer",
					BearerFormat = "JWT",
					In = ParameterLocation.Header,
					Description = "Введите токен в формате: Bearer ваш_токен"
				});
				options.AddSecurityRequirement(doc => new OpenApiSecurityRequirement
				{
					[new OpenApiSecuritySchemeReference("Bearer", doc)] = new List<string>()
				});
			});

			services.AddScoped<JwtService>();
			services.AddScoped<UnitOfWork>();
			services.AddScoped<PasswordService>();
			services.AddScoped<UserRepository>();
			services.AddScoped<DocumentRepository>();
			services.AddScoped<CategoryRepository>();
		}

		private static async Task ConfigureMiddleware(WebApplication app)
		{
			using var scope = app.Services.CreateScope();
			var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
			await db.Database.MigrateAsync();

			app.UseSwagger();

			app.UseSwaggerUI(options =>
			{
				options.SwaggerEndpoint(
					$"/swagger/{_version}/swagger.json",
					$"{_name} API {_version}");

				options.RoutePrefix = "swagger";
			});
			app.UseMiddleware<GlobalExceptionHandler>();


			app.UseDefaultFiles();
			app.UseStaticFiles();

			app.UseHttpsRedirection();
			app.UseAuthentication();
			app.UseAuthorization();
			app.MapControllers();
		}
	}
}
