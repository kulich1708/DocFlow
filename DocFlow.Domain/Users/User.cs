using DocFlow.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace DocFlow.Domain.Users
{
	public class User : BaseEntity
	{
		public string Name { get; private set; }
		public string Surname { get; private set; }
		public Email Email { get; private set; }
		public string PasswordHash { get; private set; }
		private User() { }
		public User(string name, string surname, string email, string passwordHash)
		{
			SetGeneral(name, surname, email, passwordHash);
		}
		private void SetName(string name)
		{
			if (string.IsNullOrWhiteSpace(name))
				throw new ArgumentException("Имя не может быть пустым");

			Name = name;
		}
		private void SetSurname(string surname)
		{
			if (string.IsNullOrWhiteSpace(surname))
				throw new ArgumentException("Фамилия не может быть пустой");

			Surname = surname;
		}
		public void SetGeneral(string name, string surname, string email, string passwordHash)
		{
			SetName(name);
			SetSurname(surname);
			Email = new(email);
			PasswordHash = passwordHash;
		}
	}
}
