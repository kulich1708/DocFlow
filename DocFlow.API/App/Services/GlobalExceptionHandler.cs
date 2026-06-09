using System.Text.Json;
using DocFlow.API.App.Services.Auth;

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
			await LogWarningAsync(context, ex.Message);
			await WriteJsonResponse(context, StatusCodes.Status400BadRequest, ex.Message);
		}
		catch (InvalidOperationException ex)
		{
			await LogWarningAsync(context, ex.Message);
			await WriteJsonResponse(context, StatusCodes.Status400BadRequest, ex.Message);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Unhandled exception");
			await LogErrorAsync(context, ex);
			await WriteJsonResponse(context, StatusCodes.Status500InternalServerError, "Internal server error");
		}
	}

	private static async Task LogWarningAsync(HttpContext context, string message)
	{
		var activityLog = context.RequestServices.GetRequiredService<ActivityLogService>();
		await activityLog.LogWarningAsync(BuildRequestMessage(context, message));
	}

	private static async Task LogErrorAsync(HttpContext context, Exception ex)
	{
		var activityLog = context.RequestServices.GetRequiredService<ActivityLogService>();
		await activityLog.LogErrorAsync($"{BuildRequestMessage(context, ex.Message)} ({ex.GetType().Name})");
	}

	private static string BuildRequestMessage(HttpContext context, string message)
	{
		var userId = context.User.GetUserId();
		var userPart = userId.HasValue ? $"Пользователь {userId.Value}" : "Аноним";
		return $"{userPart}: {message} ({context.Request.Method} {context.Request.Path})";
	}

	private static async Task WriteJsonResponse(HttpContext context, int statusCode, string error)
	{
		context.Response.StatusCode = statusCode;
		context.Response.ContentType = "application/json";
		await context.Response.WriteAsync(JsonSerializer.Serialize(new { error }));
	}
}
