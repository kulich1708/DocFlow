using System.Text.Json;

namespace DocFlow.API.App.Services;

public class GlobalExceptionHandler
{
	private readonly RequestDelegate _next;
	private readonly ILogger<GlobalExceptionHandler> _logger;

	public GlobalExceptionHandler(RequestDelegate next, ILogger<GlobalExceptionHandler> logger)
	{
		_next = next;
		_logger = logger;
	}

	public async Task InvokeAsync(HttpContext context)
	{
		try
		{
			await _next(context);
		}
		catch (ArgumentException ex)
		{
			context.Response.StatusCode = StatusCodes.Status400BadRequest;
			context.Response.ContentType = "application/json";

			var response = new { error = ex.Message };
			await context.Response.WriteAsync(JsonSerializer.Serialize(response));
		}
		catch (InvalidOperationException ex)
		{
			context.Response.StatusCode = StatusCodes.Status400BadRequest;
			context.Response.ContentType = "application/json";

			var response = new { error = ex.Message };
			await context.Response.WriteAsync(JsonSerializer.Serialize(response));
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Unhandled exception");

			context.Response.StatusCode = StatusCodes.Status500InternalServerError;
			context.Response.ContentType = "application/json";

			var response = new { error = "Internal server error" };
			await context.Response.WriteAsync(JsonSerializer.Serialize(response));
		}
	}
}