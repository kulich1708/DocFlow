using DocFlow.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace DocFlow.Domain.Documents
{
	public class DocumentDraft : BaseEntity
	{
		public DocumentContent Content { get; private set; }
		public DateTime ModifiedAt { get; private set; }

		public DocumentDraft(string content)
		{
			Update(content, CreatedAt);
		}
		public void Update(string content, DateTime modifiedAt)
		{
			Content = new(content);
			ModifiedAt = modifiedAt;
		}

	}
}
