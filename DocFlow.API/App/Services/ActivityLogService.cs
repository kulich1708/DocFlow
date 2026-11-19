namespace DocFlow.API.App.Services;

public enum ActivityLogLevel
{
	Information,
	Warning,
	Error
}

public class ActivityLogService(IWebHostEnvironment environment)
{
	private readonly string _logFilePath = Path.GetFullPath(Path.Combine(environment.ContentRootPath, "..", "activity.log"));
	private readonly SemaphoreSlim _writeLock = new(1, 1);

	public Task LogInformationAsync(string message) => LogAsync(ActivityLogLevel.Information, message);
	public Task LogWarningAsync(string message) => LogAsync(ActivityLogLevel.Warning, message);
	public Task LogErrorAsync(string message) => LogAsync(ActivityLogLevel.Error, message);
	private async Task LogAsync(ActivityLogLevel level, string message)
	{
		var now = DateTime.Now;
		var line = $"[{level}] {now:dd.MM.yyyy} {now:HH:mm:ss} | {message}{Environment.NewLine}";
		await _writeLock.WaitAsync();

		try
		{
			await File.AppendAllTextAsync(_logFilePath, line);
		}
		finally
		{
			_writeLock.Release();
		}
	}
}