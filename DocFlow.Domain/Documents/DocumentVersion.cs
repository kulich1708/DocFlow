using DocFlow.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace DocFlow.Domain.Documents
{
	public class DocumentVersion : BaseEntity
	{
		public int Version { get; private set; }
		public DocumentContent Content { get; private set; }

		private DocumentVersion() { }
		public DocumentVersion(int version, string content)
		{
			Version = version;
			Content = new(content);

			if (Content.IsEmpty())
				throw new ArgumentException("Версия документа не может быть пустой");
		}
	}
}
