using DocFlow.API.App.Services;
using DocFlow.API.App.Services.Auth;
using DocFlow.API.Persistence.DbContexts;
using DocFlow.API.Persistence.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Text;

namespace DocFlow.API
{
	public class RequiredSchemaFilter : ISchemaFilter
	{
		public void Apply(IOpenApiSchema schema, SchemaFilterContext context)
		{
			if (schema.Properties == null) return;

			foreach (var prop in schema.Properties)
			{
				if (!schema.Required.Contains(prop.Key))
					schema.Required.Add(prop.Key);
			}
		}
	}

	public class AuthorizeOperationFilter : IOperationFilter
	{
		public void Apply(OpenApiOperation operation, OperationFilterContext context)
		{
			if (!RequiresAuthorization(context))
				return;

			operation.Security ??= [];
			operation.Security.Add(new OpenApiSecurityRequirement
			{
				[new OpenApiSecuritySchemeReference("Bearer", context.Document)] = []
			});
		}

		private static bool RequiresAuthorization(OperationFilterContext context)
		{
			var metadata = context.ApiDescription.ActionDescriptor.EndpointMetadata;

			if (metadata.OfType<AllowAnonymousAttribute>().Any())
				return false;

			if (metadata.OfType<IAuthorizeData>().Any())
				return true;

			var controllerType = context.MethodInfo.DeclaringType;
			if (controllerType == null)
				return false;

			return controllerType
				.GetCustomAttributes(inherit: true)
				.OfType<IAuthorizeData>()
				.Any();
		}
	}

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
			services.AddCors(options =>
			{
				options.AddPolicy("ReactApp", policy =>
				{
					policy.WithOrigins("http://localhost:5173")
						  .AllowAnyHeader()
						  .AllowAnyMethod();
				});
			});

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
					Type = SecuritySchemeType.Http,
					Scheme = "bearer",
					BearerFormat = "JWT",
					In = ParameterLocation.Header,
					Description = "Введите только токен"
				});
				options.OperationFilter<AuthorizeOperationFilter>();
				options.UseAllOfToExtendReferenceSchemas();
				options.SupportNonNullableReferenceTypes();

				options.SchemaFilter<RequiredSchemaFilter>();
				// Кастомное именование operationId
				options.CustomOperationIds(apiDescription =>
				{
					var actionDescriptor = apiDescription.ActionDescriptor as ControllerActionDescriptor;
					var actionName = actionDescriptor?.ActionName;

					var routeName = apiDescription.ActionDescriptor.AttributeRouteInfo?.Name;

					return routeName ?? actionName;
				});
			});

			services.AddScoped<JwtService>();
			services.AddScoped<UnitOfWork>();
			services.AddScoped<PasswordService>();
			services.AddScoped<UserRepository>();
			services.AddScoped<DocumentRepository>();
			services.AddScoped<CategoryRepository>();
			services.AddScoped<DocumentDTOService>();
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
			app.UseCors("ReactApp");

			app.UseDefaultFiles();
			app.UseStaticFiles();

			app.UseHttpsRedirection();
			app.UseAuthentication();
			app.UseAuthorization();
			app.MapControllers();
		}
	}
}
