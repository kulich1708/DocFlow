using DocFlow.API.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace DocFlow.API.Documents
{
	public class Document : BaseEntity, IAgregateRoot
	{
		private readonly List<DocumentVersion> _versions = new();

		public string Name { get; private set; }
		public int? AuthorId { get; private set; }
		public int? CategoryId { get; private set; }
		public bool IsPrivate { get; private set; }
		public DocumentDraft Draft { get; private set; }
		public bool IsChanged { get; private set; } = false;
		public IReadOnlyList<DocumentVersion> Versions => _versions;

		public Document(string name, int? authorId = null, int? categoryId = null, bool isPrivate = true)
		{
			Draft = new(new(""));
			SetAuthor(authorId);
			ChangeGeneralInfo(name, categoryId, isPrivate);
		}
		public void SetName(string name)
		{
			if (string.IsNullOrWhiteSpace(name))
				throw new ArgumentException("Имя документа не может быть пустым");

			Name = name;
		}
		public void SetAuthor(int? authorId)
		{
			if (authorId <= 0 || !authorId.HasValue)
				throw new ArgumentException("Id автора должно быть положительным");

			AuthorId = authorId;
		}
		public void SetCategory(int categoryId)
		{
			if (categoryId <= 0)
				throw new ArgumentException("Id категории должно быть положительным");

			CategoryId = categoryId;
		}
		public void SetPrivate(bool isPrivate) => IsPrivate = isPrivate;

		public void SaveDraft(string content)
		{
			if (content != Draft.Content.Value)
				IsChanged = true;
			Draft.Update(new(content));
		}
		public DocumentVersion AddVersion(string name)
		{
			var lastDocumentVersion = GetLastVersion();

			if (!IsChanged || lastDocumentVersion != null && lastDocumentVersion.Content.Value == Draft.Content.Value)
				throw new ArgumentException("Текст этой версии не отличается от предыдущей");

			int version = (lastDocumentVersion?.Version ?? 0) + 1;
			DocumentVersion documentVersion = new(version, name, Draft.Content.Value);
			_versions.Add(documentVersion);

			IsChanged = false;
			return documentVersion;
		}
		public void DeleteVersion(int versionId)
		{
			var version = GetDocumentVersion(versionId);
			_versions.Remove(version);
		}
		public void ChangeVersionGeneralInfo(int versionId, string name)
		{
			var version = GetDocumentVersion(versionId);
			version.SetName(name);
		}
		public void CreateDraftFromVersion(int versionId)
		{
			var version = GetDocumentVersion(versionId);
			Draft.Update(version.Content, version.Content);
			IsChanged = false;
		}
		public void ResetDraft()
		{
			Draft.Update(Draft.InitialContent);
			IsChanged = false;
		}
		public void ChangeGeneralInfo(string name, int? categoryId = null, bool isPrivate = false)
		{
			SetName(name);
			SetPrivate(isPrivate);
			if (categoryId.HasValue)
				SetCategory(categoryId.Value);
		}

		private DocumentVersion? GetLastVersion() => _versions.LastOrDefault();
		private DocumentVersion GetDocumentVersion(int versionId)
		{
			return _versions.FirstOrDefault(v => v.Id == versionId)
				?? throw new ArgumentException("Документ не содержит такой версии");
		}
	}
}
