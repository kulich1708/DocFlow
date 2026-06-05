using DocFlow.API.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace DocFlow.API.Documents
{
	public class DocumentVersion : BaseEntity
	{
		public int Version { get; private set; }
		public string Name { get; private set; }
		public DocumentContent Content { get; private set; }

		private DocumentVersion() { }
		public DocumentVersion(int version, string name, string content)
		{
			SetVersion(version);
			SetName(name);
			SetContent(content);
		}
		public void SetVersion(int version)
		{
			if (version <= 0)
				throw new ArgumentException("Номер версии должен быть больше 0");

			Version = version;
		}
		public void SetName(string name)
		{
			if (string.IsNullOrWhiteSpace(name))
				throw new ArgumentException("Имя версии не может быть пустым");

			Name = name;
		}
		public void SetContent(string content)
		{
			DocumentContent tryContent = new(content);

			if (tryContent.IsEmpty())
				throw new ArgumentException("Версия документа не может быть пустой");

			Content = tryContent;
		}
	}
}
