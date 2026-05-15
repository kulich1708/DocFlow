using DocFlow.API.App.DTOs;
using DocFlow.API.Users;

namespace DocFlow.API.App.Mappers
{
	public static class Mapper
	{
		public static UserDTO ToDTO(User user)
			=> new(user.Id, user.Name, user.Surname, user.Email.Value);
	}
}
