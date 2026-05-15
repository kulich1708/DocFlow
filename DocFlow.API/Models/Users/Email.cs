using System;
using System.Collections.Generic;
using System.Text;

namespace DocFlow.API.Users
{
	public record Email
	{
		public string Value { get; }
		public Email(string value)
		{
			if (string.IsNullOrWhiteSpace(value))
				throw new ArgumentException("Email не может быть пустым");

			if (!value.Contains('@') || !value.Contains('.'))
				throw new ArgumentException("Некорректный формат Email");

			Value = value.Trim().ToLowerInvariant();
		}
		public override string ToString() => Value;
	}
}
