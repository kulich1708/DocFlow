using DocFlow.API.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace DocFlow.API.Documents
{
	public class DocumentDraft
	{
		public DocumentContent Content { get; private set; }
		public DateTime ModifiedAt { get; private set; }
		private DocumentDraft() { }
		public DocumentDraft(string content)
		{
			Update(content);
		}
		public void Update(string content, DateTime? modifiedAt = null)
		{
			Content = new(content);
			ModifiedAt = modifiedAt ?? DateTime.UtcNow;
		}

	}
}
