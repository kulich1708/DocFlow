using System;
using System.Collections.Generic;
using System.Text;
using EmailValidation;

namespace DocFlow.API.Users
{
	public record Email
	{
		public string Value { get; }
		public Email(string value)
		{
			if (string.IsNullOrWhiteSpace(value))
				throw new ArgumentException("Email не может быть пустым");

			if (!EmailValidator.Validate(value))
				throw new ArgumentException("Некорректный формат Email");

			Value = value.Trim().ToLowerInvariant();
		}
		public override string ToString() => Value;
	}
}
