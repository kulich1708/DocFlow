using DocFlow.API.App.DTOs;

namespace DocFlow.API.App.Services
{
	public static class PaginationService
	{
		public static PaginationDTO Get(PaginationDTO? dto)
		{
			int DEFAULT_PAGE = 1;
			int DEFAULT_PAGE_SIZE = 20;

			int page = DEFAULT_PAGE;
			int pageSize = DEFAULT_PAGE_SIZE;

			if (dto != null && dto.Page > 0)
				page = dto.Page;
			if (dto != null && dto.PageSize > 0)
				pageSize = dto.PageSize;

			return new(page, pageSize);
		}
	}
}
