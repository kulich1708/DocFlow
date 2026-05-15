using System;
using System.Collections.Generic;
using System.Text;

namespace DocFlow.API.Documents
{
	public record DocumentContent
	{
		public string Value { get; }

		public DocumentContent(string value)
		{
			Value = value;
		}

		public bool IsEmpty() => string.IsNullOrWhiteSpace(Value);
	}
}
