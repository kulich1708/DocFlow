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
		public DocumentContent InitialContent { get; private set; }
		private DocumentDraft() { }
		public DocumentDraft(DocumentContent content)
		{
			Update(content, content);
		}
		public void Update(DocumentContent content, DocumentContent? initialContent = null, DateTime? modifiedAt = null)
		{
			Content = content;
			ModifiedAt = modifiedAt ?? DateTime.UtcNow;

			if (initialContent != null)
				InitialContent = initialContent;
		}

	}
}
